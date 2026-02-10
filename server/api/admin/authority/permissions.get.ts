import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied.",
    });
  }

  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ group: "asc" }, { name: "asc" }],
    });

    return permissions;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to retrieve permission registry.",
    });
  }
});
