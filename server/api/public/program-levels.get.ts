import { prisma } from "../../utils/db";

export default defineEventHandler(async () => {
  const levels = await prisma.programLevel.findMany({
    orderBy: { rank: "asc" },
  });
  return { data: levels };
});
