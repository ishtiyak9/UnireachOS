import { prisma } from "../../../../utils/db";
import { z } from "zod";

const ExchangeRateSchema = z.object({
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3).default("BDT"),
  rate: z.number().positive(),
  source: z.string().optional().default("MANUAL"),
  effectiveDate: z.string(),
});

/**
 * FX Registry Ingress: Exchange Rate POST
 * Updates the system with new currency conversion rates for financial reporting.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || (session.user as any).roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Restricted Treasury Operation",
    });
  }

  const body = await readBody(event);
  const result = ExchangeRateSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Neural Validation Failure",
      data: result.error.format(),
    });
  }

  const { fromCurrency, toCurrency, rate, source, effectiveDate } = result.data;
  const targetDate = new Date(effectiveDate);

  return await prisma.$transaction(async (tx) => {
    // 1. Deactivate old rates for this pair
    await tx.exchangeRate.updateMany({
      where: { fromCurrency, toCurrency, isActive: true },
      data: { isActive: false },
    });

    // 2. Insert new active rate
    const fxRecord = await tx.exchangeRate.create({
      data: {
        fromCurrency,
        toCurrency,
        rate,
        source,
        effectiveDate: targetDate,
        isActive: true,
        createdById: (session.user as any).id,
      },
    });

    // 3. Audit Log
    await tx.financialAuditLog.create({
      data: {
        entityType: "ExchangeRate",
        entityId: fxRecord.id,
        action: "EXCHANGE_RATE_SET",
        performedById: (session.user as any).id,
        performedByName:
          (session.user as any).firstName +
          " " +
          (session.user as any).lastName,
        notes: `New FX Rate: 1 ${fromCurrency} = ${rate} ${toCurrency}`,
        metadata: { fromCurrency, toCurrency, rate },
      },
    });

    return { success: true, data: fxRecord };
  });
});
