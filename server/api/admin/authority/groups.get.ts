import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const groups = await prisma.permissionGroup.findMany({
      include: {
        _count: {
          select: {
            permissions: true,
            roles: true,
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return groups;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to retrieve permission clusters.",
    });
  }
});
