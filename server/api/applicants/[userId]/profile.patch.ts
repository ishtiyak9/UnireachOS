import { z } from "zod";
import { applicantProfileSchema } from "../../../utils/schemas/applicant";
// prisma is auto-imported in Nitro if exported from server/utils
// If explicit import needed: import { prisma } from "../../../utils/db";

async function syncRelation(
  tx: any,
  model: any,
  applicantId: string,
  newItems: any[] | undefined
) {
  if (!newItems) return;

  const keepIds = newItems.filter((item) => item.id).map((item) => item.id);

  // Delete items not in the new list
  await model.deleteMany({
    where: {
      applicantId,
      id: { notIn: keepIds }, // Delete excluded IDs
    },
  });

  // Upsert items
  for (const item of newItems) {
    if (item.id) {
      // Update
      const { id, applicantId: _aid, ...data } = item;
      await model.update({
        where: { id },
        data: data,
      });
    } else {
      // Create
      const { id, ...data } = item; // remove id if undefined/empty
      await model.create({
        data: {
          ...data,
          applicantId,
        },
      });
    }
  }
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const userId = getRouterParam(event, "userId");
  if (!userId) {
    throw createError({ statusCode: 400, message: "Missing User ID in route" });
  }

  // --- PERMISSIONS ---
  const isSelf = session.user.id === userId;
  const isAdmin = ["super_admin", "admin", "official"].includes(
    (session.user as any).roleCode || (session.user as any).role || ""
  );

  let isAssignedAgent = false;
  if (!isSelf && !isAdmin) {
    // Basic Agent Check
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (agentProfile) {
      const applicant = await prisma.applicantProfile.findUnique({
        where: { userId },
        select: { agentId: true, isLocked: true },
      });
      if (applicant?.agentId === agentProfile.id) {
        isAssignedAgent = true;
        // Agents can't edit locked profiles either?
        if (applicant.isLocked) {
          throw createError({ statusCode: 403, message: "Profile is locked." });
        }
      }
    }
  }

  if (!isSelf && !isAdmin && !isAssignedAgent) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  if (isSelf) {
    const currentProfile = await prisma.applicantProfile.findUnique({
      where: { userId },
      select: { isLocked: true },
    });
    if (currentProfile?.isLocked) {
      throw createError({ statusCode: 403, message: "Profile is locked." });
    }
  }

  // --- VALIDATION ---
  const body = await readBody(event);
  console.log("RAW BODY RECEIVED:", JSON.stringify(body, null, 2));

  // Zod coerce date handles string->Date conversion automatically
  const result = await applicantProfileSchema.safeParseAsync(body);

  if (!result.success) {
    console.error(
      "ZOD VALIDATION FAILED for profile update:",
      JSON.stringify(result.error.issues, null, 2)
    );
    throw createError({
      statusCode: 400,
      message: "Validation Failed",
      data: result.error.issues,
    });
  }

  console.log(
    "ZOD VALIDATION SUCCESS. Parsed Data Keys:",
    Object.keys(result.data)
  );

  const {
    addresses,
    emergencyContacts,
    educationHistory,
    workExperience,
    englishProficiency,
    ...mainProfile
  } = result.data;

  // --- TRANSACTION ---
  return await prisma.$transaction(async (tx) => {
    // 1. Upsert Main Profile
    console.log("Upserting ApplicantProfile for userId:", userId);
    const profile = await tx.applicantProfile.upsert({
      where: { userId },
      update: mainProfile,
      create: {
        userId,
        firstName: mainProfile.firstName || "",
        lastName: mainProfile.lastName || "",
        ...mainProfile,
      },
    });

    console.log("Profile Upserted. ID:", profile.id);

    // 2. Sync Nested Relations
    console.log("Syncing relations for:", profile.id);
    console.log("WE Count to sync:", workExperience?.length || 0);
    console.log("EP Count to sync:", englishProficiency?.length || 0);

    await syncRelation(tx, tx.applicantAddress, profile.id, addresses);
    await syncRelation(tx, tx.emergencyContact, profile.id, emergencyContacts);
    await syncRelation(tx, tx.educationHistory, profile.id, educationHistory);

    try {
      console.log("Running WE sync...");
      await syncRelation(tx, tx.workExperience, profile.id, workExperience);
      console.log("WE sync done.");
    } catch (e) {
      console.error("WE Sync Error:", e);
      throw e;
    }

    try {
      console.log("Running EP sync...");
      await syncRelation(
        tx,
        tx.englishProficiency,
        profile.id,
        englishProficiency
      );
      console.log("EP sync done.");
    } catch (e) {
      console.error("EP Sync Error:", e);
      throw e;
    }

    return profile;
  });
});
