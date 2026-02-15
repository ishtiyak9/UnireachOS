import { z } from "zod";
import { applicantProfileSchema } from "../../../utils/schemas/applicant";
import { notifyApplicantChange } from "../../../utils/notifications";

async function syncRelation(
  tx: any,
  model: any,
  applicantId: string,
  newItems: any[] | undefined
) {
  if (!newItems) return;

  const keepIds = newItems.filter((item) => item.id).map((item) => item.id);

  await model.deleteMany({
    where: {
      applicantId,
      id: { notIn: keepIds },
    },
  });

  for (const item of newItems) {
    if (item.id) {
      const { id, applicantId: _aid, ...data } = item;
      await model.update({
        where: { id },
        data: data,
      });
    } else {
      const { id, ...data } = item;
      await model.create({
        data: {
          ...data,
          applicantId,
        },
      });
    }
  }
}

async function triggerNotifications(event: any, applicantId: string) {
  const session = await getUserSession(event);
  const user = session?.user as any;

  if (user?.roleCategory === "AGENT") {
    const updaterName =
      `${user.profile?.firstName || ""} ${
        user.profile?.lastName || ""
      }`.trim() || user.email;

    try {
      await notifyApplicantChange({
        applicantId,
        updaterId: user.id,
        updaterName,
        type: "PROFILE_UPDATE",
      });
    } catch (e) {
      console.error("Failed to trigger notifications for profile update:", e);
    }
  }
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing Identifier in route",
    });
  }

  const isSelf = session.user.id === id;
  const isAdmin = ["super_admin", "admin", "official"].includes(
    (session.user as any).roleCode || (session.user as any).role || ""
  );

  let isAssignedAgent = false;
  if (!isSelf && !isAdmin) {
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (agentProfile) {
      const applicant = await prisma.applicantProfile.findUnique({
        where: { userId: id },
        select: { agentId: true, isLocked: true },
      });
      if (applicant?.agentId === agentProfile.id) {
        isAssignedAgent = true;
      }
    }
  }

  if (!isSelf && !isAdmin && !isAssignedAgent) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // Block editing if locked (unless Admin/Staff)
  if (!isAdmin) {
    const currentProfile = await prisma.applicantProfile.findUnique({
      where: { userId: id },
      select: { isLocked: true },
    });
    if (currentProfile?.isLocked) {
      throw createError({ statusCode: 403, message: "Profile is locked." });
    }
  }

  const body = await readBody(event);
  const result = await applicantProfileSchema.safeParseAsync(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Validation Failed",
      data: result.error.issues,
    });
  }

  const {
    addresses,
    emergencyContacts,
    educationHistory,
    workExperience,
    englishProficiency,
    ...mainProfile
  } = result.data;

  const profile = await prisma.$transaction(async (tx) => {
    const p = await tx.applicantProfile.upsert({
      where: { userId: id },
      update: mainProfile,
      create: {
        userId: id,
        firstName: mainProfile.firstName || "",
        lastName: mainProfile.lastName || "",
        ...mainProfile,
      },
    });

    await syncRelation(tx, tx.applicantAddress, p.id, addresses);
    await syncRelation(tx, tx.emergencyContact, p.id, emergencyContacts);
    await syncRelation(tx, tx.educationHistory, p.id, educationHistory);
    await syncRelation(tx, tx.workExperience, p.id, workExperience);
    await syncRelation(tx, tx.englishProficiency, p.id, englishProficiency);

    return p;
  });

  // Post-Success Notification Trigger
  await triggerNotifications(event, id);

  return profile;
});
