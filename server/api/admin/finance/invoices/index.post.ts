import { prisma } from "../../../../utils/db";
import { z } from "zod";

const InvoiceSchema = z.object({
  universityId: z.string().uuid(),
  earningIds: z.array(z.string().uuid()),
  dueDate: z.string(),
  notes: z.string().optional(),
});

/**
 * Institutional Billing Engine: Invoice POST
 * Aggregates pending commission earnings into a formal invoice for a University.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || (session.user as any).roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const result = InvoiceSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid Invoice Data",
      data: result.error.format(),
    });
  }

  const { universityId, earningIds, dueDate, notes } = result.data;

  // 1. Fetch Earnings to ensure they belong to the university and are pending
  const earnings = await prisma.commissionEarning.findMany({
    where: {
      id: { in: earningIds },
      application: { course: { universityId } },
      status: "PENDING_INVOICE",
    },
  });

  if (earnings.length === 0) {
    throw createError({
      statusCode: 400,
      message: "No valid pending earnings found for this university.",
    });
  }

  // 2. Calculate Totals
  const totalAmount = earnings.reduce(
    (sum: number, e: any) => sum + e.grossAmount,
    0
  );
  const currency = earnings[0].currency;

  return await prisma.$transaction(async (tx: any) => {
    // 3. Create Invoice
    const invoice = await tx.commissionInvoice.create({
      data: {
        code: `INV-${universityId.substring(0, 4).toUpperCase()}-${Date.now()
          .toString()
          .slice(-6)}`,
        universityId,
        amount: totalAmount,
        amountDue: totalAmount,
        currency,
        status: "SENT",
        dueDate: new Date(dueDate),
        notes,
        createdById: (session.user as any).id,
      },
    });

    // 4. Link Earnings to Invoice and update status
    await tx.commissionEarning.updateMany({
      where: { id: { in: earnings.map((e: any) => e.id) } },
      data: {
        invoiceId: invoice.id,
        status: "INVOICED",
      },
    });

    // 5. Audit Trail
    await tx.financialAuditLog.create({
      data: {
        entityType: "CommissionInvoice",
        entityId: invoice.id,
        entityCode: invoice.code,
        action: "CREATED",
        amount: totalAmount,
        currency,
        performedById: (session.user as any).id,
        performedByName:
          (session.user as any).firstName +
          " " +
          (session.user as any).lastName,
        notes: `Invoice generated for ${earnings.length} earnings records.`,
      },
    });

    return { success: true, invoice };
  });
});
