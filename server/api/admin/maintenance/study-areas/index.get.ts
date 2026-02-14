import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const areas = await prisma.studyArea.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return { data: areas };
});
