import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user)
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const id = getRouterParam(event, "id");

  const notification = await prisma.notification.update({
    where: {
      id,
      userId: session.user.id, // Security: ensure it belongs to the user
    },
    data: {
      isRead: true,
    },
  });

  return notification;
});
