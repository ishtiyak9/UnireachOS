import { prisma } from "../../../utils/db";
import { z } from "zod";

const deleteGroupSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const body = await readBody(event);
    const { id } = deleteGroupSchema.parse(body);

    // Check if the group is being used by any roles
    const group = await prisma.permissionGroup.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!group) {
      throw createError({ statusCode: 404, message: "Cluster not found." });
    }

    if (group.roles.length > 0) {
      throw createError({
        statusCode: 400,
        message:
          "Cannot dismantle this cluster as it is currently assigned to one or more active roles.",
      });
    }

    // Proceed with deletion
    await prisma.permissionGroup.delete({
      where: { id },
    });

    return { success: true, message: "Cluster successfully dismantled." };
  } catch (error: any) {
    console.error("Group Deletion Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to dismantle permission cluster.",
    });
  }
});
