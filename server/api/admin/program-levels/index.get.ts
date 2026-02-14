import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const levels = await prisma.programLevel.findMany({
    where: { isActive: true },
    orderBy: {
      rank: "asc",
    },
    include: {
      createdBy: {
        select: {
          email: true,
        },
      },
    },
  });

  return {
    data: levels,
  };
});
