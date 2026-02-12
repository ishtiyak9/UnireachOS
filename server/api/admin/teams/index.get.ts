import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const teams = await prisma.team.findMany({
    include: {
      members: {
        include: {
          user: {
            include: {
              role: true,
            },
          },
        },
      },
      _count: {
        select: { members: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: teams,
  };
});
