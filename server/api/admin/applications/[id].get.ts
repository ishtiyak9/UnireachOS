import { prisma } from "../../../utils/db";

/**
 * Detailed Application Insight: Administrative Fetch
 * Retrieves the full immutable state of an application including snapshots,
 * audit history, and associated staff.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (
    !session?.user ||
    !["super_admin", "staff_standard"].includes((session.user as any).roleCode)
  ) {
    throw createError({ statusCode: 403, message: "Neural Access Denied" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing application identifier",
    });
  }

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      applicant: {
        include: {
          agent: true,
        },
      },
      course: {
        include: {
          university: true,
          level: true,
        },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
      assignedStaff: true,
      documents: true,
    },
  });

  if (!application) {
    throw createError({
      statusCode: 404,
      message: "Application node not found",
    });
  }

  return { success: true, application };
});
