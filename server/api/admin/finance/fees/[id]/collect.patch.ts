import { prisma } from "../../../../../utils/db";
import { z } from "zod";

const PaymentSchema = z.object({
  paymentMethod: z.enum([
    "BANK_TRANSFER",
    "WIRE_TRANSFER",
    "CHEQUE",
    "CASH",
    "ONLINE_PAYMENT",
    "CRYPTO",
    "OTHER",
  ]),
  paymentRef: z.string().min(2),
  paidAt: z.string(),
  amount: z.number().positive(),
  notes: z.string().optional().nullable(),
});

/**
 * Fee Settlement Engine: Collection PATCH
 * Records a successful payment for a student fee and closes the record.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const result = PaymentSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid Payment Data",
      data: result.error.format(),
    });
  }

  const collection = await prisma.feeCollection.findUnique({ where: { id } });
  if (!collection) {
    throw createError({ statusCode: 404, message: "Fee record not found" });
  }

  return await prisma.$transaction(async (tx: any) => {
    // 1. Update Collection Record
    const updated = await tx.feeCollection.update({
      where: { id },
      data: {
        status: "PAID",
        paymentMethod: result.data.paymentMethod,
        paymentRef: result.data.paymentRef,
        paidAt: new Date(result.data.paidAt),
        amount: result.data.amount, // Correcting if different
      },
      include: {
        applicant: true,
      },
    });

    // 2. Audit Trail Injection
    await tx.financialAuditLog.create({
      data: {
        entityType: "FeeCollection",
        entityId: updated.id,
        entityCode: updated.code,
        action: "PAYMENT_RECORDED",
        amount: result.data.amount,
        currency: updated.currency,
        performedById: (session.user as any).id,
        performedByName:
          (session.user as any).firstName +
          " " +
          (session.user as any).lastName,
        notes: `Payment of ${result.data.amount} recorded via ${result.data.paymentMethod}. Ref: ${result.data.paymentRef}`,
      },
    });

    return { success: true, data: updated };
  });
});
