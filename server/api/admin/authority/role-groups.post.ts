import { prisma } from "../../../utils/db";
import { z } from "zod";

const syncSchema = z.object({
  roleId: z.string(),
  groupIds: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const body = await readBody(event);
    const { roleId, groupIds } = syncSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      await tx.rolePermissionGroup.deleteMany({ where: { roleId } });
      if (groupIds.length > 0) {
        await tx.rolePermissionGroup.createMany({
          data: groupIds.map((gId) => ({
            roleId,
            groupId: gId,
          })),
        });
      }
    });

    return { success: true };
  } catch (error: any) {
    throw createError({ statusCode: 400, message: "Sync Failure." });
  }
});
