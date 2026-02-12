import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany();
  console.log("TEAMS IN DB:", JSON.stringify(teams, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
