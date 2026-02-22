import { prisma } from "../../../../utils/db";
import { z } from "zod";

const AgreementSchema = z.object({
  universityId: z.string().uuid(),
  code: z.string().min(3),
  effectiveFrom: z.string(),
  effectiveTo: z.string().optional().nullable(),
  status: z
    .enum(["DRAFT", "ACTIVE", "SUSPENDED", "EXPIRED", "TERMINATED"])
    .default("DRAFT"),
  commissionType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "TIERED"]),
  commissionRate: z.number().positive(),
  currency: z.string().length(3),
  paymentTermDays: z.number().int().default(90),
  invoiceTrigger: z.enum([
    "ON_ENROLLMENT",
    "ON_OFFER_ACCEPTED",
    "ON_VISA_APPROVAL",
    "ON_TUITION_PAYMENT",
    "MANUAL",
  ]),
  notes: z.string().optional().nullable(),
});

/**
 * Contractual Injection: Agreement POST
 * Registers a new formal commission contract with an institution.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || (session.user as any).roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Restricted Administrative Operation",
    });
  }

  const body = await readBody(event);
  const result = AgreementSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Neural Validation Failure",
      data: result.error.format(),
    });
  }

  const data = result.data;

  try {
    const agreement = await prisma.commissionAgreement.create({
      data: {
        ...data,
        effectiveFrom: new Date(data.effectiveFrom),
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
        createdById: (session.user as any).id,
      },
    });

    // Log the financial action
    await prisma.financialAuditLog.create({
      data: {
        entityType: "CommissionAgreement",
        entityId: agreement.id,
        entityCode: agreement.code,
        action: "CREATED",
        performedById: (session.user as any).id,
        performedByName:
          (session.user as any).firstName +
          " " +
          (session.user as any).lastName,
        notes: `Agreement created for University ID: ${data.universityId}`,
      },
    });

    return { success: true, agreement };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw createError({
        statusCode: 409,
        message: "Agreement code already exists",
      });
    }
    throw error;
  }
});
