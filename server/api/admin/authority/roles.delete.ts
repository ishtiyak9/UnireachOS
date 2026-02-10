import { prisma } from "../../../utils/db";
import { z } from "zod";

const deleteRoleSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const query = getQuery(event);
  const result = deleteRoleSchema.safeParse(query);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid role identifier.",
    });
  }

  const { id } = result.data;

  try {
    // Check if role is a system role
    const role = await prisma.systemRole.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw createError({ statusCode: 404, message: "Role not found." });
    }

    if (role.isSystem) {
      throw createError({
        statusCode: 400,
        message: "Cannot delete a protected System Core role.",
      });
    }

    if (role._count.users > 0) {
      throw createError({
        statusCode: 400,
        message: `Cannot delete role. It is currently assigned to ${role._count.users} users.`,
      });
    }

    await prisma.systemRole.delete({
      where: { id },
    });

    return { success: true, message: "Identity Archetype eliminated." };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to delete role.",
    });
  }
});
