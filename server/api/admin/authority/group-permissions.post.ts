import { prisma } from "../../../utils/db";
import { z } from "zod";

const syncSchema = z.object({
  groupId: z.string(),
  permissionIds: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const body = await readBody(event);
    const { groupId, permissionIds } = syncSchema.parse(body);

    await prisma.$transaction(async (tx) => {
      await tx.groupPermission.deleteMany({ where: { groupId } });
      if (permissionIds.length > 0) {
        await tx.groupPermission.createMany({
          data: permissionIds.map((pId) => ({
            groupId,
            permissionId: pId,
          })),
        });
      }
    });

    return { success: true };
  } catch (error: any) {
    throw createError({ statusCode: 400, message: "Sync Failure." });
  }
});
