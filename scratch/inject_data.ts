import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  console.log("🚀 Initializing System Pulse Injection...");

  const applicant = await p.applicantProfile.findFirst();
  const course = await p.course.findFirst({ include: { university: true } });
  const admin = await p.user.findFirst(); // Just get any user

  if (!applicant || !course || !admin) {
    console.error("❌ Critical Failure: System tables are empty.");
    return;
  }

  const application = await p.application.upsert({
    where: {
      applicantId_courseId: {
        applicantId: applicant.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      id: "demo-app-001",
      code: "APP-DE-OXF-2026",
      applicantId: applicant.id,
      courseId: course.id,
      status: "ADMISSION_IN_PROGRESS",
      externalStatus: "Under Review",
      priority: "HIGH",
    },
  });
  console.log(`✅ Application Linked: ${application.code}`);

  const earning = await p.commissionEarning.upsert({
    where: { applicationId: application.id },
    update: {},
    create: {
      code: "CE-2026-0001",
      applicationId: application.id,
      universityId: course.universityId,
      trigger: "ON_ENROLLMENT",
      grossAmount: 1500,
      currency: "GBP",
      exchangeRate: 148.5,
      grossAmountBDT: 222750,
      status: "PENDING_INVOICE",
    },
  });
  console.log(`✅ Finance Record Generated: ${earning.code}`);

  try {
    await p.financialAuditLog.create({
      data: {
        action: "COMMISSION_GENERATED",
        entityType: "COMMISSION_EARNING",
        entityId: earning.id,
        entityCode: earning.code,
        amount: 1500,
        currency: "GBP",
        performedByName: "System Intelligence",
        performedById: admin.id,
      },
    });
    console.log("✅ Audit Trail Persistent.");
  } catch (e) {
    console.log("⚠️ Audit Log failed but data exists.");
  }

  await p.$disconnect();
  console.log("🎯 Injection Complete.");
}
main();
