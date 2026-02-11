import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Restricted Access." });
  }

  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { status } = body;

  const validStatuses = ["ACTIVE", "SUSPENDED", "DEACTIVATED"];
  if (!validStatuses.includes(status)) {
    throw createError({ statusCode: 400, message: "Invalid status." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found." });
    }

    // Protection: Cannot suspend yourself
    if (user.id === session.user.id) {
      throw createError({
        statusCode: 400,
        message: "You cannot suspend your own account.",
      });
    }

    await prisma.user.update({
      where: { id },
      data: { status },
    });

    // Log Action
    await prisma.auditLog.create({
      data: {
        performedById: session.user.id,
        action: "UPDATE_STATUS",
        entityType: "User",
        entityId: id,
        oldValue: { status: user.status },
        newValue: { status },
      },
    });

    return { success: true, message: `User status set to ${status}.` };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to update status",
      statusMessage: error.message,
    });
  }
});
