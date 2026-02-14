import { prisma } from "../../utils/db";

export default defineEventHandler(async () => {
  const areas = await prisma.studyArea.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  return { data: areas };
});
