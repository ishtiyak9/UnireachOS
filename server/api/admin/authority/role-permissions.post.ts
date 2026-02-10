import { prisma } from "../../../utils/db";
import { z } from "zod";

const updateRoleSchema = z.object({
  roleId: z.string(),
  permissionIds: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied.",
    });
  }

  try {
    const body = await readBody(event);
    const { roleId, permissionIds } = updateRoleSchema.parse(body);

    const role = await prisma.systemRole.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw createError({
        statusCode: 404,
        message: "System Role not found.",
      });
    }

    // Role safety: Protect system roles from critical corruption if needed
    // However, as Super Admin, we should allow full control.

    // Atomically reset and update permissions
    await prisma.$transaction(async (tx) => {
      // 1. Remove all current permissions
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      // 2. Add new permissions
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permId) => ({
            roleId,
            permissionId: permId,
          })),
        });
      }

      // 3. Log the audit event
      await tx.auditLog.create({
        data: {
          performedById: session.user.id,
          action: "ROLE_PERMISSION_SYNC",
          entityType: "SystemRole",
          entityId: roleId,
          newValue: { permissionIds },
        },
      });
    });

    return { success: true };
  } catch (error: any) {
    if (error.issues) {
      throw createError({
        statusCode: 400,
        message: "Invalid input synchronization.",
        data: error.issues,
      });
    }
    throw error;
  }
});
