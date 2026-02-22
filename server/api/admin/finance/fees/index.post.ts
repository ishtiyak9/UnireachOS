import { prisma } from "../../../../utils/db";
import { z } from "zod";

const FeeSchema = z.object({
  applicantId: z.string().uuid(),
  applicationId: z.string().uuid().optional().nullable(),
  feeType: z.enum([
    "APPLICATION_FEE",
    "SERVICE_FEE",
    "VISA_FEE",
    "DOCUMENT_FEE",
    "TUITION_DEPOSIT",
    "COURIER_FEE",
    "ASSESSMENT_FEE",
    "OTHER",
  ]),
  amount: z.number().positive(),
  currency: z.string().length(3).default("BDT"),
  description: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

/**
 * Global Fee Ingress: FeeCollection POST
 * Issues a new charge or records a service fee for a student.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (
    !session?.user ||
    !["super_admin", "staff_standard"].includes((session.user as any).roleCode)
  ) {
    throw createError({
      statusCode: 403,
      message: "Unauthorized Billing Action",
    });
  }

  const body = await readBody(event);
  const result = FeeSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Validation Error",
      data: result.error.format(),
    });
  }

  const data = result.data;

  // Get current FX rate if not BDT
  let exchangeRate = 1.0;
  if (data.currency !== "BDT") {
    const fx = await prisma.exchangeRate.findFirst({
      where: { fromCurrency: data.currency, toCurrency: "BDT", isActive: true },
      orderBy: { effectiveDate: "desc" },
    });
    exchangeRate = fx ? fx.rate : 1.0;
  }

  const amountBDT = data.amount * exchangeRate;

  const collection = await prisma.feeCollection.create({
    data: {
      ...data,
      exchangeRate,
      amountBDT,
      status: "PENDING",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      collectedById: (session.user as any).id,
    },
  });

  // Audit
  await prisma.financialAuditLog.create({
    data: {
      entityType: "FeeCollection",
      entityId: collection.id,
      entityCode: collection.code,
      action: "CREATED",
      performedById: (session.user as any).id,
      amount: data.amount,
      currency: data.currency,
      notes: `New ${data.feeType} issued for applicant ${data.applicantId}`,
    },
  });

  return { success: true, collection };
});
