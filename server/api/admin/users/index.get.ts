import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const query = getQuery(event);
    const category = query.category as string | undefined;
    const categories = query.categories as string[] | string | undefined;

    const where: any = {};
    const andFilters: any[] = [];

    if (categories) {
      const categoryList = Array.isArray(categories)
        ? categories
        : (categories as string).split(",");
      andFilters.push({ role: { category: { in: categoryList } } });
    } else if (category) {
      andFilters.push({ role: { category } });
    }

    // IMMUNITY: Hide Super Admin ghost node from everyone else
    if ((session.user as any).roleCode !== "super_admin") {
      andFilters.push({
        role: { NOT: { code: "super_admin" } },
      });
    }

    if (andFilters.length > 0) {
      where.AND = andFilters;
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
            assignedStaff: true,
          },
        },
        createdBy: {
          include: {
            staffProfile: true,
            agentProfile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map((user: any) => {
      let ownerName = "Direct Enrollment";
      let ownerType = "System";
      let firstName = "Unknown";
      let lastName = "";
      let agentName = null;

      if (user.staffProfile) {
        firstName = user.staffProfile.firstName;
        lastName = user.staffProfile.lastName;
      } else if (user.agentProfile) {
        firstName = user.agentProfile.agencyName;
      } else if (user.applicantProfile) {
        firstName = user.applicantProfile.firstName;
        lastName = user.applicantProfile.lastName;

        // HIGH-PRECISION OWNERSHIP RESOLUTION
        if ((user.applicantProfile as any).agent) {
          agentName = (user.applicantProfile as any).agent.agencyName;
          ownerType = "Partner";
          ownerName = agentName;
        } else if ((user.applicantProfile as any).assignedStaff) {
          const staff = (user.applicantProfile as any).assignedStaff;
          ownerType = "System";
          ownerName = `${staff.firstName} ${staff.lastName}`;
        } else if (user.createdBy) {
          // FALLBACK TO CREATOR IDENTITY
          if (user.createdBy.agentProfile) {
            ownerType = "Partner";
            ownerName = user.createdBy.agentProfile.agencyName;
            agentName = ownerName;
          } else if (user.createdBy.staffProfile) {
            ownerType = "System";
            ownerName = `${user.createdBy.staffProfile.firstName} ${user.createdBy.staffProfile.lastName}`;
          }
        }
      }

      const applicantProfile = user.applicantProfile as any;
      const assignedStaffName = applicantProfile?.assignedStaff
        ? `${applicantProfile.assignedStaff.firstName} ${applicantProfile.assignedStaff.lastName}`
        : null;

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
        ownerName,
        ownerType,
        assignedStaffName,
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
