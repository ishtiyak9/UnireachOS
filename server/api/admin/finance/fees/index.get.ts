import { prisma } from "../../../../utils/db";

/**
 * Client Billing Registry: Fees & Collections
 * Lists all historical and pending charges for applicants/students.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Authentication Required" });
  }

  const query = getQuery(event);
  const { applicantId, status, feeType } = query;

  const collections = await prisma.feeCollection.findMany({
    where: {
      ...(applicantId && { applicantId: applicantId as string }),
      ...(status && { status: status as any }),
      ...(feeType && { feeType: feeType as any }),
    },
    include: {
      applicant: {
        select: {
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
      application: {
        select: {
          code: true,
          course: { include: { university: { select: { name: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, count: collections.length, data: collections };
});
