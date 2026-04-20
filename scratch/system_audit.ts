import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const applicants = await p.applicantProfile.count();
  const applications = await p.application.count();
  const leads = await p.lead.count();
  const financeAudit = await p.financialAuditLog.count();
  const earrings = await p.commissionEarning.count();
  const universities = await p.university.count();
  const courses = await p.course.count();

  console.log("--- SYSTEM DATA AUDIT ---");
  console.log(`Applicants (Profiles): ${applicants}`);
  console.log(`Applications (Course Requests): ${applications}`);
  console.log(`Leads (Inquiries): ${leads}`);
  console.log(`Financial Audit Logs: ${financeAudit}`);
  console.log(`Commission Earnings: ${earrings}`);
  console.log(`Universities: ${universities}`);
  console.log(`Courses: ${courses}`);

  if (applicants > 0) {
    const first = await p.applicantProfile.findFirst({ include: { user: true } });
    console.log("\nSample Applicant:");
    console.log(`Name: ${first?.firstName} ${first?.lastName}`);
    console.log(`Email: ${first?.user.email}`);
  }

  await p.$disconnect();
}
main();
