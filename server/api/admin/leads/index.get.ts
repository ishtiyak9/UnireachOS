import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  try {
    // Highly Optimized: Use session data directly to avoid the redundant DB roundtrip.
    // The roleCode and profile are already persisted in the encrypted session.
    const userRole = (session.user as any).roleCode;
    const staffProfile = (session.user as any).profile;

    // 2. Build Filter Logic (Neural Shield)
    const where: any = { AND: [] };
    const isSuperAdmin = userRole === "super_admin";

    // If not a Super Admin, restrict to their own assignments
    if (!isSuperAdmin) {
      if (staffProfile && staffProfile.id) {
        where.AND.push({ assignedCounselorId: staffProfile.id });
      } else {
        where.AND.push({ id: "none" });
      }
    }

    // Parallelize if we have complex dashboard needs, but for now single findMany is fine
    const leads = await prisma.lead.findMany({
      where: where.AND.length > 0 ? where : {},
      include: {
        assignedCounselor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Safety limit
    });

    return {
      data: leads,
    };
  } catch (error) {
    console.error("❌ Lead Hub Retrieval Failure:", error);
    throw error;
  }
});
