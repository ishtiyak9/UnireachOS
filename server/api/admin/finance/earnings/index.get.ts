import { prisma } from "../../../../utils/db";

/**
 * Global Revenue Ledger (Earnings)
 * Lists all accounts receivable events triggered by applications.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Authentication Required" });
  }

  const userRole = (session.user as any).roleCode;
  if (!["super_admin", "counselor"].includes(userRole)) {
    // Checking super_admin for simplicity or staff with finance vertical in a more complex setup
    if (userRole !== "super_admin") {
      throw createError({ statusCode: 403, message: "Permission Denied" });
    }
  }

  const query = getQuery(event);
  const { status, universityId, periodId } = query;

  const earnings = await prisma.commissionEarning.findMany({
    where: {
      ...(status && { status: status as any }),
      ...(universityId && { universityId: universityId as string }),
      ...(periodId && { periodId: periodId as string }),
    },
    include: {
      application: {
        include: {
          applicant: {
            select: {
              firstName: true,
              lastName: true,
              agent: { select: { agencyName: true } },
            },
          },
          course: {
            select: {
              name: true,
              university: { select: { name: true } },
            },
          },
        },
      },
      invoice: {
        select: {
          code: true,
          status: true,
          totalAmount: true,
        },
      },
      agentPayout: {
        select: {
          status: true,
          amount: true,
        },
      },
    },
    orderBy: { triggerDate: "desc" },
    take: 200,
  });

  return { success: true, data: earnings };
});
