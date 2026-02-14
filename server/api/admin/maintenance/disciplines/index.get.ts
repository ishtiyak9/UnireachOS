import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

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
