import { prisma } from "./db";
import { InvoiceTrigger } from "@prisma/client";

/**
 * Financial Intelligence Engine (FIE)
 * Logic for calculating commissions, handling FX, and ledger entries.
 */
export const financialEngine = {
  /**
   * Evaluates an application for revenue generation.
   * Typically called when status reaches an 'InvoiceTrigger' milestone.
   */
  async triggerEarning(
    applicationId: string,
    trigger: InvoiceTrigger,
    performerId: string
  ) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        course: { include: { university: true } },
        applicant: { include: { agent: true } },
      },
    });

    if (!application) throw new Error("Application not found");

    // 1. Fetch Active Agreement
    const agreement = await prisma.commissionAgreement.findFirst({
      where: {
        universityId: application.course.universityId,
        status: "ACTIVE",
        invoiceTrigger: trigger,
        effectiveFrom: { lte: application.createdAt },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: application.createdAt } },
        ],
      },
    });

    if (!agreement) {
      console.warn(
        `[FinanceEngine] No active agreement found for ${application.course.university.name} with trigger ${trigger}`
      );
      return null;
    }

    // 2. Fetch Active Agent Tier
    let agentShareRate = 0;
    if (application.applicant.agent) {
      const tier = await prisma.agentCommissionTier.findFirst({
        where: {
          agentId: application.applicant.agent.id,
          isActive: true,
          OR: [
            { universityId: application.course.universityId },
            { universityId: null },
          ],
        },
        orderBy: [
          { priority: "desc" },
          { universityId: "desc" }, // Specific university override wins over null
        ],
      });

      // Fallback to legacy flat commission if no tier exists
      agentShareRate = tier
        ? tier.commissionRate
        : application.applicant.agent.commission || 0;
    }

    // 3. Current Exchange Rate (Target: BDT)
    const fxRecord = await prisma.exchangeRate.findFirst({
      where: {
        fromCurrency: agreement.currency,
        toCurrency: "BDT",
        isActive: true,
      },
      orderBy: { effectiveDate: "desc" },
    });
    const fxRate = fxRecord ? fxRecord.rate : 1.0;

    // 4. Calculations
    // Note: Tuition fee is stored in Course, frozen in courseSnapshot
    const snapshot: any = application.courseSnapshot || {};
    const tuitionFee = snapshot.tuitionFee || application.course.tuitionFee;

    let grossAmount = 0;
    if (agreement.commissionType === "PERCENTAGE") {
      grossAmount = (tuitionFee * agreement.commissionRate) / 100;
    } else {
      grossAmount = agreement.commissionRate; // Fixed amount
    }

    const grossAmountBDT = grossAmount * fxRate;
    const agentShare = (grossAmount * agentShareRate) / 100;
    const agentShareBDT = agentShare * fxRate;
    const netAmount = grossAmount - agentShare;
    const netAmountBDT = netAmount * fxRate;

    // 5. Atomic Ledger Ingress
    return await prisma.$transaction(async (tx) => {
      const earning = await tx.commissionEarning.create({
        data: {
          applicationId,
          universityId: application.course.universityId,
          agreementId: agreement.id,
          trigger,
          grossAmount,
          currency: agreement.currency,
          exchangeRate: fxRate,
          grossAmountBDT,
          agentShare,
          agentShareBDT,
          netAmount,
          netAmountBDT,
          status: "PENDING_INVOICE",
          rateSnapshot: {
            agreementRate: agreement.commissionRate,
            agreementType: agreement.commissionType,
            agentTierRate: agentShareRate,
            tuitionFeeBasis: tuitionFee,
            fxRateSource: fxRecord?.source || "DEFAULT",
          },
          createdById: performerId,
        },
      });

      // Payout Generation (Conditional - usually when earning is confirmed or if auto-payout)
      // For now, let's just create the entry so it stays in "PENDING_APPROVAL"
      if (agentShare > 0 && application.applicant.agent) {
        await tx.agentPayout.create({
          data: {
            earningId: earning.id,
            agentId: application.applicant.agent.id,
            grossEarning: grossAmount,
            commissionRate: agentShareRate,
            amount: agentShare,
            currency: agreement.currency,
            exchangeRate: fxRate,
            amountBDT: agentShareBDT,
            status: "PENDING_APPROVAL",
            createdById: performerId,
          },
        });
      }

      await tx.financialAuditLog.create({
        data: {
          entityType: "CommissionEarning",
          entityId: earning.id,
          entityCode: earning.code,
          action: "CREATED",
          performedById: performerId,
          amount: grossAmount,
          currency: agreement.currency,
          notes: `Earning triggered by ${trigger} for Application ${application.code}`,
        },
      });

      return earning;
    });
  },
};
