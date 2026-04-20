import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkData() {
  console.log("--- DATABASE CONSISTENCY CHECK ---");
  
  const applicants = await prisma.applicantProfile.count();
  const applications = await prisma.application.count();
  const users = await prisma.user.count();
  const roles = await prisma.systemRole.findMany({ select: { name: true, code: true } });
  
  console.log(`Users: ${users}`);
  console.log(`Applicants: ${applicants}`);
  console.log(`Applications: ${applications}`);
  console.log("Roles Found:", roles.map(r => r.code).join(", "));

  if (applicants > 0) {
    const firstApplicant = await prisma.applicantProfile.findFirst({
      include: { user: true, applications: true }
    });
    console.log("Sample Applicant Data:", JSON.stringify(firstApplicant, null, 2));
  }

  await prisma.$disconnect();
}

checkData().catch(console.error);
