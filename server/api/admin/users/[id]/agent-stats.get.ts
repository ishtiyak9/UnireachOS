import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || (session.user as any).roleCategory !== "SYSTEM") {
    throw createError({
      statusCode: 403,
      message: "Unauthorized. Neural Access Denied.",
    });
  }

  const agentId = getRouterParam(event, "id");
  if (!agentId) {
    throw createError({ statusCode: 400, message: "Missing Agent ID" });
  }

  try {
    const stats = await prisma.$transaction(async (tx) => {
      // Total Applicants Onboarded
      const totalApplicants = await tx.applicantProfile.count({
        where: { agentId },
      });

      // Active Applications Logic
      const activeApplications = await tx.application.count({
        where: {
          applicant: { agentId },
          status: { notIn: ["REJECTED", "WITHDRAWN", "COMPLETED"] },
        },
      });

      // Recent Activity Hub
      const recentApplicants = await tx.applicantProfile.findMany({
        where: { agentId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });

      return {
        totalApplicants,
        activeApplications,
        recentApplicants,
        efficiencyRate:
          totalApplicants > 0
            ? ((activeApplications / totalApplicants) * 100).toFixed(1)
            : 0,
      };
    });

    return stats;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message:
        "Failed to harmonize agent performance analytics: " + error.message,
    });
  }
});
