import {
  PrismaClient,
  PeriodStatus,
  AgreementStatus,
  CommissionType,
  InvoiceTrigger,
  PeriodType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding Financial Intelligence...");

  // 1. Setup Financial Period
  const period = await prisma.financialPeriod.create({
    data: {
      name: "Q1 2026",
      type: PeriodType.QUARTERLY,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-03-31"),
      status: PeriodStatus.OPEN,
      notes: "Active operational quarter for 2026 intakes.",
    },
  });

  // 2. Clear & Seed Exchange Rates
  await prisma.exchangeRate.deleteMany();
  const rates = [
    { fromCurrency: "GBP", rate: 154.5, effectiveDate: new Date() },
    { fromCurrency: "USD", rate: 121.2, effectiveDate: new Date() },
    { fromCurrency: "EUR", rate: 131.8, effectiveDate: new Date() },
    { fromCurrency: "AUD", rate: 82.4, effectiveDate: new Date() },
  ];

  for (const r of rates) {
    await prisma.exchangeRate.create({
      data: {
        ...r,
        toCurrency: "BDT",
        isActive: true,
        source: "TREASURY_SYNC",
      },
    });
  }

  // 3. Setup University Commission Agreements
  const universities = await prisma.university.findMany({ take: 3 });
  if (universities.length > 0) {
    for (const uni of universities) {
      await prisma.commissionAgreement.create({
        data: {
          code: `AGR-${uni.code}-${Math.floor(Math.random() * 9000) + 1000}`,
          universityId: uni.id,
          effectiveFrom: new Date("2025-01-01"),
          status: AgreementStatus.ACTIVE,
          commissionType: CommissionType.PERCENTAGE,
          commissionRate: 15.0, // 15% Standard Commission
          currency: "GBP",
          invoiceTrigger: InvoiceTrigger.ON_ENROLLMENT,
          notes: "Standard Tier 1 University Agreement.",
        },
      });
    }
  }

  // 4. Setup Agent Commission Tiers
  const agents = await prisma.agentProfile.findMany({ take: 2 });
  if (agents.length > 0) {
    for (const agent of agents) {
      await prisma.agentCommissionTier.create({
        data: {
          agentId: agent.id,
          label: "Gold Partner (Standard)",
          priority: 0,
          commissionType: CommissionType.PERCENTAGE,
          commissionRate: 70.0, // Agent gets 70% of Unireach yield
          isActive: true,
        },
      });
    }
  }

  // 5. Generate some Fee Collections (Applicant Side)
  const applicants = await prisma.applicantProfile.findMany({ take: 5 });
  if (applicants.length > 0) {
    for (const app of applicants) {
      await prisma.feeCollection.create({
        data: {
          code: `FEE-${Math.floor(Math.random() * 90000) + 10000}`,
          applicantId: app.id,
          feeType: "SERVICE_FEE",
          amount: 5000,
          currency: "BDT",
          status: Math.random() > 0.5 ? "PAID" : "PENDING",
          dueDate: new Date("2026-03-15"),
          description: "Professional counseling and documentation service fee.",
        },
      });
    }
  }

  console.log("✅ Financial Seeding Complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
