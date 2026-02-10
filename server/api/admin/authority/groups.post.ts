import { prisma } from "../../../utils/db";
import { z } from "zod";

const groupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  permissionIds: z.array(z.string()).optional(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const body = await readBody(event);
    const data = groupSchema.parse(body);

    if (data.id) {
      // For updates, we replace the permissions
      return await prisma.permissionGroup.update({
        where: { id: data.id },
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          permissions: data.permissionIds
            ? {
                deleteMany: {},
                create: data.permissionIds.map((id) => ({
                  permission: { connect: { id } },
                })),
              }
            : undefined,
        },
      });
    } else {
      return await prisma.permissionGroup.create({
        data: {
          name: data.name,
          code: data.code,
          description: data.description,
          permissions: data.permissionIds
            ? {
                create: data.permissionIds.map((id) => ({
                  permission: { connect: { id } },
                })),
              }
            : undefined,
        },
      });
    }
  } catch (error: any) {
    console.error("Group Sync Error:", error);
    if (error.code === "P2002") {
      throw createError({
        statusCode: 400,
        message: "A cluster with this code or name already exists.",
      });
    }
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to sync permission cluster.",
    });
  }
});
