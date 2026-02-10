import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        staffProfile: true,
        agentProfile: true,
        applicantProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user) => {
      let firstName = "Unknown";
      let lastName = "";

      if (user.staffProfile) {
        firstName = user.staffProfile.firstName;
        lastName = user.staffProfile.lastName;
      } else if (user.agentProfile) {
        firstName = user.agentProfile.agencyName;
        // lastName = user.agentProfile.licenseNo || "";
      } else if (user.applicantProfile) {
        firstName = user.applicantProfile.firstName;
        lastName = user.applicantProfile.lastName;
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role.name,
        roleCode: user.role.code,
        roleCategory: user.role.category,
        status: user.status,
        firstName,
        lastName,
        avatar: firstName[0]?.toUpperCase() || user.email[0].toUpperCase(),
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      };
    });
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch neural population.",
    });
  }
});
