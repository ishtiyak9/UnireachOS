import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const query = getQuery(event);
    const category = query.category as string | undefined;

    const where: any = { AND: [] };
    if (category) {
      where.AND.push({ role: { category } });
    }

    // IMMUNITY: Hide Super Admin ghost node from everyone else
    if (session.user.roleCode !== "super_admin") {
      where.AND.push({
        role: { NOT: { code: "super_admin" } },
      });
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: true,
        staffProfile: true,
        agentProfile: true,
        applicantProfile: {
          include: {
            agent: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user) => {
      let firstName = "Unknown";
      let lastName = "";
      let agentName = null;

      if (user.staffProfile) {
        firstName = user.staffProfile.firstName;
        lastName = user.staffProfile.lastName;
      } else if (user.agentProfile) {
        firstName = user.agentProfile.agencyName;
        // lastName = user.agentProfile.licenseNo || "";
      } else if (user.applicantProfile) {
        firstName = user.applicantProfile.firstName;
        lastName = user.applicantProfile.lastName;
        if ((user.applicantProfile as any).agent) {
          agentName = (user.applicantProfile as any).agent.agencyName;
        }
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role.name,
        roleCode: user.role.code,
        roleCategory: (user.role as any).category,
        status: user.status,
        firstName,
        lastName,
        agentName,
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
