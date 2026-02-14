import { hash } from "argon2";
import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Guard: Super Admin OR users with password reset permission
  const user = session?.user as any;
  const hasPermission = user?.permissions?.includes("user:manage");
  const isSuperAdmin = user?.roleCode === "super_admin";

  if (!user || (!isSuperAdmin && !hasPermission)) {
    throw createError({
      statusCode: 403,
      message: "Restricted Access. Sufficient authority protocols required.",
    });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing user ID" });
  }

  const body = await readBody(event);
  const { password } = body;

  if (!password || password.length < 8) {
    throw createError({
      statusCode: 400,
      message: "Password must be at least 8 characters long.",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found." });
    }

    // Protection for other Super Admins
    if (
      user.role.code === "super_admin" &&
      user.id !== (session.user as any).id
    ) {
      throw createError({
        statusCode: 403,
        message: "You cannot reset the password of another Super Admin.",
      });
    }

    const hashedPassword = await hash(password);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    // Log Action
    await prisma.auditLog.create({
      data: {
        performedById: (session.user as any).id,
        action: "RESET_PASSWORD",
        entityType: "User",
        entityId: id,
        newValue: { reason: "Admin Reset" },
      },
    });

    return {
      success: true,
      message: "Password has been successfully updated.",
    };
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to reset password",
      statusMessage: error.message,
    });
  }
});
