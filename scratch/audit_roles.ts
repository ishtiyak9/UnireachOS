import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const roles = await p.systemRole.findMany();
  console.log("System Roles:");
  roles.forEach(r => console.log(`- ${r.name} (${r.code}) [Category: ${r.category}]`));
  await p.$disconnect();
}
main();
