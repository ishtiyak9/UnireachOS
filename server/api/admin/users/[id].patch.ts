import { prisma } from "../../../utils/db";
import { generateId } from "../../../utils/ids";

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
  const targetUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: { select: { code: true } } },
  });

  if (!targetUser) {
    throw createError({ statusCode: 404, message: "User node not declared." });
  }

  if (targetUser.role.code === "super_admin") {
    // Strict Lock: Even other admins cannot touch this record.
    // Only the user themselves can edit (if session implies self-edit).
    // Assuming session.user.id is available.
    if ((session.user as any).id !== targetUser.id) {
      throw createError({
        statusCode: 403,
        message: "GOD MODE ACTIVE: The Architect cannot be modified.",
      });
    }
  }
  // --- GOD MODE PROTECTION END ---

  const body = await readBody(event);

  try {
    // Direct User Model Updates (Status, Email, etc.)
    if (body.status || body.email) {
      const updateData: any = {};
      if (body.status) updateData.status = body.status;
      if (body.email) updateData.email = body.email;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        include: { role: true },
      });

      // SYNC: If user is an AGENT, update their primaryEmail in the profile
      if (body.email && updatedUser.role.category === "AGENT") {
        await prisma.agentProfile.update({
          where: { userId: id },
          data: { primaryEmail: body.email },
        });
      }
    }

    // Direct Permission Group Assignment
    if (body.groupIds) {
      // 1. Clear existing groups
      await prisma.userPermissionGroup.deleteMany({
        where: { userId: id },
      });

      // 2. Assign new groups
      if (Array.isArray(body.groupIds) && body.groupIds.length > 0) {
        await prisma.userPermissionGroup.createMany({
          data: body.groupIds.map((gid: string) => ({
            userId: id,
            groupId: gid,
          })),
        });
      }
    }

    // If updating agent profile specifically
    if (body.agentProfile) {
      const {
        id: profileId,
        userId: profileUserId,
        user: profileUser,
        applicants,
        enquiries,
        createdAt,
        updatedAt,
        agentCode: providedCode,
        ...profileData
      } = body.agentProfile;

      // Check if we need to auto-generate code (if not provided and doesn't exist)
      let finalCode = providedCode;
      if (!finalCode) {
        const existing = await prisma.agentProfile.findUnique({
          where: { userId: id },
        });
        if (!existing?.agentCode) {
          finalCode = await generateId.generateCorporateId(
            prisma.agentProfile,
            "agentCode",
            "URP"
          );
        }
      }

      await prisma.agentProfile.upsert({
        where: { userId: id },
        create: {
          ...profileData,
          userId: id,
          agencyName: profileData.agencyName || "New Agency",
          agentCode: finalCode,
        },
        update: {
          ...profileData,
          ...(finalCode ? { agentCode: finalCode } : {}),
        },
      });

      // SYNC: Registered email should be the primary email for partner case
      if (profileData.primaryEmail) {
        await prisma.user.update({
          where: { id },
          data: { email: profileData.primaryEmail },
        });
      }
    }

    // If updating staff profile specifically
    if (body.staffProfile) {
      const {
        id: profileId,
        userId: profileUserId,
        user: profileUser,
        leads,
        leadEvents,
        applications,
        assignedApplicants,
        unlockRequests,
        documentUnlockRequests,
        createdAt,
        updatedAt,
        employeeId: providedId,
        ...profileData
      } = body.staffProfile;

      // Check if we need to auto-generate ID (if not provided and doesn't exist)
      let finalId = providedId;
      if (!finalId) {
        const existing = await prisma.staffProfile.findUnique({
          where: { userId: id },
        });
        if (!existing?.employeeId) {
          finalId = await generateId.generateCorporateId(
            prisma.staffProfile,
            "employeeId",
            "URS"
          );
        }
      }

      await prisma.staffProfile.upsert({
        where: { userId: id },
        create: {
          ...profileData,
          userId: id,
          firstName: profileData.firstName || "Staff",
          lastName: profileData.lastName || "Member",
          employeeId: finalId,
        },
        update: {
          ...profileData,
          ...(finalId ? { employeeId: finalId } : {}),
        },
      });
    }

    // If updating applicant profile specifically
    if (body.applicantProfile) {
      const {
        id: profileId,
        userId: profileUserId,
        user,
        agent,
        assignedStaff,
        addresses,
        educationHistory,
        workExperience,
        englishProficiency,
        emergencyContacts,
        enquiries,
        applications,
        createdAt,
        updatedAt,
        ...profileData
      } = body.applicantProfile;

      // Update basic profile fields
      const profile = await prisma.applicantProfile.upsert({
        where: { userId: id },
        create: {
          id: profileId || generateId.applicant(),
          userId: id,
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          ...profileData,
        },
        update: {
          ...profileData,
        },
      });

      const internalProfileId = profile.id;

      // Handle Addresses
      if (addresses && Array.isArray(addresses)) {
        for (const addr of addresses) {
          const { applicant, id: addrId, applicantId, ...addrData } = addr;
          if (addrId) {
            await prisma.applicantAddress.update({
              where: { id: addrId },
              data: addrData,
            });
          } else {
            await prisma.applicantAddress.create({
              data: {
                ...addrData,
                applicantId: internalProfileId,
              },
            });
          }
        }
      }

      // Handle Education History
      if (educationHistory && Array.isArray(educationHistory)) {
        for (const edu of educationHistory) {
          const { applicant, id: eduId, applicantId, ...eduData } = edu;
          if (eduId) {
            await prisma.educationHistory.update({
              where: { id: eduId },
              data: eduData,
            });
          } else {
            await prisma.educationHistory.create({
              data: {
                ...eduData,
                applicantId: internalProfileId,
              },
            });
          }
        }
      }

      // Work Experience
      if (workExperience && Array.isArray(workExperience)) {
        for (const work of workExperience) {
          const { applicant, id: workId, applicantId, ...workData } = work;
          if (workId) {
            await prisma.workExperience.update({
              where: { id: workId },
              data: workData,
            });
          } else {
            await prisma.workExperience.create({
              data: {
                ...workData,
                applicantId: internalProfileId,
              },
            });
          }
        }
      }

      // English Proficiency
      if (englishProficiency && Array.isArray(englishProficiency)) {
        for (const eng of englishProficiency) {
          const { applicant, id: engId, applicantId, ...engData } = eng;
          if (engId) {
            await prisma.englishProficiency.update({
              where: { id: engId },
              data: engData,
            });
          } else {
            await prisma.englishProficiency.create({
              data: {
                ...engData,
                applicantId: internalProfileId,
              },
            });
          }
        }
      }

      // Emergency Contacts
      if (emergencyContacts && Array.isArray(emergencyContacts)) {
        for (const contact of emergencyContacts) {
          const {
            applicant,
            id: contactId,
            applicantId,
            ...contactData
          } = contact;
          if (contactId) {
            await prisma.emergencyContact.update({
              where: { id: contactId },
              data: contactData,
            });
          } else {
            await prisma.emergencyContact.create({
              data: {
                ...contactData,
                applicantId: internalProfileId,
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
        staffProfile: true,
        agentProfile: true,
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

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error: any) {
    console.error("Update User Error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update user profile",
      statusMessage: error.message,
    });
  }
});
