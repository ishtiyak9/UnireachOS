import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const apps = await p.applicantProfile.findMany({
    include: { user: { include: { role: true } } }
  });
  console.log("Applicants Data:");
  apps.forEach(a => {
    console.log(`- ${a.firstName} ${a.lastName} | Role: ${a.user.role.name} | Cat: ${a.user.role.category}`);
  });
  await p.$disconnect();
}
main();
