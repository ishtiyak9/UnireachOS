import { prisma } from "../../../../utils/db";

/**
 * Partnership Agreement Registry
 * Fetches all active and historical commission contracts with universities.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || (session.user as any).roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Restricted Administrative Registry",
    });
  }

  const query = getQuery(event);
  const { universityId, status } = query;

  const agreements = await prisma.commissionAgreement.findMany({
    where: {
      ...(universityId && { universityId: universityId as string }),
      ...(status && { status: status as any }),
    },
    include: {
      university: {
        select: {
          name: true,
          code: true,
          country: true,
          logo: true,
        },
      },
      _count: {
        select: { earnings: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, agreements };
});
