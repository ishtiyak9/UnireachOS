import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user)
    return createError({ statusCode: 401, statusMessage: "Unauthorized" });

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return { success: true };
});
