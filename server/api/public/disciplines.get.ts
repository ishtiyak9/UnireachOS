import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const { studyAreaId } = getQuery(event);

  const disciplines = await prisma.discipline.findMany({
    where: {
      isActive: true,
      ...(studyAreaId ? { studyAreaId: studyAreaId as string } : {}),
    },
    orderBy: { name: "asc" },
  });

  return { data: disciplines };
});
