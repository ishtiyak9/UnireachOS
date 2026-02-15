import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing user ID" });
  }

  // --- GOD MODE PROTECTION START ---
  const targetUserCheck = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: { select: { code: true } } },
  });

  if (!targetUserCheck) {
    // If user not found, we might proceed to see if downstream handles it, but safer to error early
    // Or let the logic flow. However, for protection, we need to know the role.
    throw createError({ statusCode: 404, message: "Node not found." });
  }

  if (targetUserCheck.role.code === "super_admin") {
    // Strict Lock: Even other admins cannot touch this record.
    if ((session.user as any).id !== targetUserCheck.id) {
      throw createError({
        statusCode: 403,
        message: "GOD MODE ACTIVE: The Architect cannot be modified.",
      });
    }
  }
  // --- GOD MODE PROTECTION END ---

  const body = await readBody(event);
  // body should contain partial user or applicantProfile data

  // We need to handle updates carefully.
  // Assumption: The frontend sends { applicantProfile: { ... }, role: ... } or similar structure.
  // Or maybe flattening the structure for specific sections?
  // Let's assume the body matches the structure we want to update.

  try {
    // If updating applicant profile specifically
    if (body.applicantProfile) {
      const {
        addresses,
        educationHistory,
        workExperience,
        englishProficiency,
        emergencyContacts,
        ...profileData
      } = body.applicantProfile;

      // Update basic profile fields
      await prisma.applicantProfile.upsert({
        where: { userId: id },
        create: {
          userId: id,
          ...profileData,
        },
        update: {
          ...profileData,
        },
      });

      // Handle Relations - using transaction or separate updates
      // This part depends on how specific we want to be.
      // For simplicity, we might deleteStragy or upsert logic.
      // Let's implement a smart update for addresses for now.

      if (addresses && Array.isArray(addresses)) {
        for (const addr of addresses) {
          if (addr.id) {
            await prisma.address.update({
              where: { id: addr.id },
              data: addr,
            });
          } else {
            await prisma.address.create({
              data: {
                ...addr,
                applicantProfile: { connect: { userId: id } },
              },
            });
          }
        }
      }

      // Handle Education History (replace all logic often easiest for lists, or upsert)
      // Attempting upsert for items with IDs, create for others.
      if (educationHistory && Array.isArray(educationHistory)) {
        for (const edu of educationHistory) {
          if (edu.id) {
            await prisma.educationHistory.update({
              where: { id: edu.id },
              data: edu,
            });
          } else {
            await prisma.educationHistory.create({
              data: { ...edu, applicantProfile: { connect: { userId: id } } },
            });
          }
        }
      }

      // Work Experience
      if (workExperience && Array.isArray(workExperience)) {
        for (const work of workExperience) {
          if (work.id) {
            await prisma.workExperience.update({
              where: { id: work.id },
              data: work,
            });
          } else {
            await prisma.workExperience.create({
              data: { ...work, applicantProfile: { connect: { userId: id } } },
            });
          }
        }
      }

      // English Proficiency
      if (englishProficiency && Array.isArray(englishProficiency)) {
        for (const eng of englishProficiency) {
          if (eng.id) {
            await prisma.englishProficiency.update({
              where: { id: eng.id },
              data: eng,
            });
          } else {
            await prisma.englishProficiency.create({
              data: { ...eng, applicantProfile: { connect: { userId: id } } },
            });
          }
        }
      }

      // Emergency Contacts
      if (emergencyContacts && Array.isArray(emergencyContacts)) {
        for (const contact of emergencyContacts) {
          if (contact.id) {
            await prisma.emergencyContact.update({
              where: { id: contact.id },
              data: contact,
            });
          } else {
            await prisma.emergencyContact.create({
              data: {
                ...contact,
                applicantProfile: { connect: { userId: id } },
              },
            });
          }
        }
      }
    }

    // Return the updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        applicantProfile: {
          include: {
            addresses: true,
            educationHistory: true,
            workExperience: true,
            englishProficiency: true,
            emergencyContacts: true,
          },
        },
      },
    });

    return updatedUser;
  } catch (error: any) {
    console.error("Update User Error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update user profile",
      statusMessage: error.message,
    });
  }
});
