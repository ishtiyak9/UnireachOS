import { prisma } from "../../../utils/db";

/**
 * High-Density Financial Intelligence: Executive Overview
 * Aggregates global financial state across receivables, payables, and collections.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (
    !session?.user ||
    !["super_admin", "staff_status"].includes((session.user as any).roleCode)
  ) {
    // Only super_admin or users in FINANCE vertical should ideally see this.
    // Checking role for now as per project patterns.
    if ((session?.user as any).roleCode !== "super_admin") {
      throw createError({ statusCode: 403, message: "Neural Access Denied" });
    }
  }

  // Calculate High-Level Aggregates
  const [
    totalEarnings,
    pendingReceivables,
    pendingPayables,
    totalFeeCollections,
    recentAuditLogs,
  ] = await Promise.all([
    // 1. Total Gross Revenue (Earning records that are not cancelled)
    prisma.commissionEarning.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { grossAmountBDT: true },
    }),

    // 2. Accounts Receivable (Unpaid Invoices)
    prisma.commissionInvoice.aggregate({
      where: { status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] } },
      _sum: { amountDue: true },
    }),

    // 3. Accounts Payable (Unpaid Payouts)
    prisma.agentPayout.aggregate({
      where: {
        status: {
          in: ["PENDING_APPROVAL", "APPROVED", "PROCESSING", "FAILED"],
        },
      },
      _sum: { amountBDT: true },
    }),

    // 4. Client Fee Collections (Paid service fees)
    prisma.feeCollection.aggregate({
      where: { status: "PAID" },
      _sum: { amountBDT: true },
    }),

    // 5. Recent Financial Activity
    prisma.financialAuditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Aggregate Revenue by Month (Last 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(
      d.toLocaleString("default", { month: "short", year: "2-digit" })
    );
  }

  const earningsLast6Months = await prisma.commissionEarning.findMany({
    where: {
      status: {
        in: ["RECEIVED", "INVOICED", "PARTIALLY_RECEIVED", "PENDING_INVOICE"],
      },
      createdAt: { gte: sixMonthsAgo },
    },
    select: {
      grossAmountBDT: true,
      createdAt: true,
    },
  });

  const revenueByMonth = months.map((month) => {
    const monthTotal = earningsLast6Months
      .filter(
        (e: any) =>
          new Date(e.createdAt).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          }) === month
      )
      .reduce((sum: number, e: any) => sum + (e.grossAmountBDT || 0), 0);
    return { month, total: monthTotal };
  });

  return {
    success: true,
    stats: {
      totalRevenue: totalEarnings._sum.grossAmountBDT || 0,
      accountsReceivable: pendingReceivables._sum.amountDue || 0,
      accountsPayable: pendingPayables._sum.amountBDT || 0,
      totalFeesCollected: totalFeeCollections._sum.amountBDT || 0,
    },
    recentActivity: recentAuditLogs,
    revenueByMonth: revenueByMonth,
  };
});
