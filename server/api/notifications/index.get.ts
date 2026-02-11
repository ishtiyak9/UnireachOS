import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user)
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 20;
  const cursor = query.cursor as string;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    take: limit,
    ...(cursor && {
      skip: 1, // Skip the cursor itself
      cursor: {
        id: cursor,
      },
    }),
    orderBy: {
      createdAt: "desc",
    },
  });

  const nextCursor =
    notifications.length === limit
      ? notifications[notifications.length - 1].id
      : null;

  return {
    notifications,
    nextCursor,
  };
});
