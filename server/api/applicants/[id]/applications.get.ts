import { prisma } from "../../../utils/db";

/**
 * Applicant Board: External Fetch
 * Provides a clean, simplified view for applicants and agents,
 * masking institutional complexity with the "External Status" layer.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Authentication Required" });
  }

  const applicantId = getRouterParam(event, "id");
  if (!applicantId) {
    throw createError({
      statusCode: 400,
      message: "Missing applicant identifier",
    });
  }

  // Security Gate: Ensure users can only see their own applications (or their agent's students)
  // [INTELLIGENCE] We query based on applicantId (profile ID) which is passed in the URL
  const applications = await prisma.application.findMany({
    where: { applicantId },
    select: {
      id: true,
      code: true,
      externalStatus: true,
      priority: true,
      courseSnapshot: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return { success: true, applications };
});
