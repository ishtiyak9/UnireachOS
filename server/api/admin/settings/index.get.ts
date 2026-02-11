export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Guard: Only Super Admin
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied. Restricted to Supreme Administrator.",
    });
  }

  // Fetch Singleton Config (or init default)
  const config = await prisma.systemConfig.upsert({
    where: { id: "global" },
    update: {},
    create: {
      allowPublicRegister: true,
      allowAgentRegister: true,
      allowStudentLogin: true,
      allowAgentLogin: true,
      systemBannerMessage: null,
    },
  });

  // Fetch Access Control List
  const accessControl = await prisma.systemAccessControl.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      ipAddress: true,
      reason: true,
      expiresAt: true,
      addedBy: true,
      createdAt: true,
    },
  });

  // Fetch Maintenance Windows
  const maintenanceWindows = await prisma.maintenanceWindow.findMany({
    orderBy: { startTime: "desc" },
    include: {
      createdBy: {
        select: { email: true, role: { select: { name: true } } },
      },
    },
    take: 50,
  });

  return { config, accessControl, maintenanceWindows };
});
