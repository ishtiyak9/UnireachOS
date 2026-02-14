import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized access to applicant intelligence.",
    });
  }

  // Retrieve Applicant Identity
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: "Applicant profile not found in the global registry.",
    });
  }

  // Fetch Applications with Academic Lineage
  const applications = await prisma.application.findMany({
    where: { applicantId: profile.id },
    include: {
      course: {
        include: {
          university: true,
          level: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: applications,
  };
});
