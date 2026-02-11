import { prisma } from "../../../utils/db";
import { z } from "zod";

const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  code: z.string().min(2),
  category: z.enum(["SYSTEM", "AGENT", "APPLICANT"]),
  description: z.string().optional(),
  groupIds: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const body = await readBody(event);
    const data = roleSchema.parse(body);

    if (data.id) {
      // Guard: Super Admin is Immutable
      const roleToEdit = await prisma.systemRole.findUnique({
        where: { id: data.id },
      });
      if (roleToEdit?.code === "super_admin") {
        throw createError({
          statusCode: 403,
          message: "IMMUNITY ACTIVE: Neural Core Archetype is immutable.",
        });
      }

      // Update with transaction to sync groups
      return await prisma.$transaction(async (tx) => {
        const updated = await tx.systemRole.update({
          where: { id: data.id },
          data: {
            name: data.name,
            code: data.code,
            category: data.category,
            description: data.description,
          },
        });

        if (data.groupIds) {
          // Clear existing group links
          await tx.rolePermissionGroup.deleteMany({
            where: { roleId: data.id },
          });

          // Create new ones
          if (data.groupIds.length > 0) {
            await tx.rolePermissionGroup.createMany({
              data: data.groupIds.map((gid) => ({
                roleId: data.id!,
                groupId: gid,
              })),
            });
          }
        }

        return updated;
      });
    } else {
      // Create
      const created = await prisma.systemRole.create({
        data: {
          name: data.name,
          code: data.code,
          category: data.category,
          description: data.description,
          isSystem: false,
        },
      });

      if (data.groupIds && data.groupIds.length > 0) {
        await prisma.rolePermissionGroup.createMany({
          data: data.groupIds.map((gid) => ({
            roleId: created.id,
            groupId: gid,
          })),
        });
      }

      return created;
    }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to sync authority node.",
    });
  }
});
