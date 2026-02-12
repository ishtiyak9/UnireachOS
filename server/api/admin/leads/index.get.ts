import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  try {
    // 1. Fetch deep session details (Role & Team)
    const dbUser = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: {
        role: true,
        staffProfile: true, // Needed for counselor assignment filtering
      },
    });

    if (!dbUser)
      throw createError({ statusCode: 403, message: "User not found." });

    // 2. Build Filter Logic (Neural Shield)
    const where: any = {};

    // If not a Super Admin, restrict to their own assignments or team
    if (dbUser.role.code !== "super_admin") {
      if (dbUser.staffProfile) {
        where.assignedCounselorId = dbUser.staffProfile.id;
      } else {
        // Fallback for non-staff who somehow reached here
        where.id = "none";
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedCounselor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: leads,
    };
  } catch (error) {
    console.error("❌ Lead Hub Retrieval Failure:", error);
    throw error;
  }
});
