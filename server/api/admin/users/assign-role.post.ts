import { z } from "zod";
import { prisma } from "../../../utils/db";

const assignRoleSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Guard: Only Super Admin can re-assign roles
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const body = await readBody(event);
  const { userId, roleId } = await assignRoleSchema.parseAsync(body);

  // Check if role exists
  const role = await prisma.systemRole.findUnique({
    where: { id: roleId },
  });

  if (!role) {
    throw createError({ statusCode: 404, message: "Archetype not found." });
  }

  // Guard: Cannot re-assign someone to be a Super Admin
  // Guard: Cannot re-assign someone to be a Super Admin
  if (role.code === "super_admin") {
    throw createError({
      statusCode: 403,
      message:
        "GOD MODE VIOLATION: There can be only one. The Architect cannot be replicated.",
    });
  }

  // Check if target user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw createError({ statusCode: 404, message: "Node not found." });
  }

  // Guard: Cannot change the role of a Super Admin (Immunity)
  if (user.role.code === "super_admin") {
    throw createError({
      statusCode: 403,
      message: "IMMUNITY ACTIVE: The Architect's role is immutable.",
    });
  }

  // Update user role
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { roleId: roleId },
    include: { role: true },
  });

  // Log Action
  await prisma.auditLog.create({
    data: {
      performedById: session.user.id,
      action: "ASSIGN_ROLE",
      entityType: "User",
      entityId: userId,
      oldValue: { roleId: user.roleId },
      newValue: { roleId: roleId, roleName: role.name },
    },
  });

  return {
    success: true,
    message: "Identity Archetype synchronized.",
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role.name,
    },
  };
});
