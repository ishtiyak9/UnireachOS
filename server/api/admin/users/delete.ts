import { prisma } from "../../../utils/db";
import { z } from "zod";

const deleteUserSchema = z.object({
  id: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const query = getQuery(event);
  const result = deleteUserSchema.safeParse(query);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: "Invalid neural identifier.",
    });
  }

  const { id } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "Node not found." });
    }

    // IMMUNITY PROTOCOL:
    // 1. Cannot delete a Super Admin (even by another Super Admin)
    // 2. Cannot delete yourself (Suicide Prevention)
    if (user.role.code === "super_admin") {
      throw createError({
        statusCode: 403,
        message: "IMMUNITY PROTOCOL ACTIVE: Neural Core cannot be dismantled.",
      });
    }

    if (user.id === session.user.id) {
      throw createError({
        statusCode: 400,
        message: "Self-termination protocol is disabled.",
      });
    }

    // Proceed with deletion (Cascading deletes handles profiles)
    await prisma.user.delete({
      where: { id },
    });

    return { success: true, message: "Node eliminated from the matrix." };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to eliminate node.",
    });
  }
});
