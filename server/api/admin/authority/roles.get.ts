import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  // Security: Check if user is logged in and is a Super Admin
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied: Insufficient clearance level.",
    });
  }

  try {
    const roles = await prisma.systemRole.findMany({
      include: {
        _count: {
          select: {
            users: true,
            permissions: true,
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
        groups: {
          include: {
            group: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return roles;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message:
        "Database Synchronization Error: Failed to retrieve role matrix.",
    });
  }
});
