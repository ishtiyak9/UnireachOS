import { prisma } from "../utils/db";

export default defineEventHandler(async (event) => {
  // 1. Skip for public assets/internal h3 routes
  if (
    event.path.startsWith("/_nuxt") ||
    event.path.startsWith("/api/_") ||
    event.path.startsWith("/__")
  ) {
    return;
  }

  // 2. Skip for non-API routes if you want to allow the frontend to load (Nuxt will handle error.vue)
  // But wait, server middleware runs for everything.
  // We only want to block if maintenance is ACTIVE.

  // 3. Check for active maintenance
  const activeMaintenance = await prisma.maintenanceWindow.findFirst({
    where: {
      OR: [
        { status: "ACTIVE" },
        {
          status: "SCHEDULED",
          startTime: { lte: new Date() },
          OR: [{ endTime: { gte: new Date() } }, { endTime: null }],
        },
      ],
    },
  });

  if (activeMaintenance) {
    // 4. Bypass: Super Admin
    const session = await getUserSession(event);
    if (session?.user?.roleCode === "super_admin") return;

    // 5. Bypass: Whitelisted IP
    const ip = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";
    const isWhitelisted = await prisma.systemAccessControl.findFirst({
      where: {
        ipAddress: ip,
        type: "ALLOW",
      },
    });

    if (isWhitelisted) return;

    // 6. Block access with 503
    throw createError({
      statusCode: 503,
      statusMessage: "System Maintenance",
      message:
        activeMaintenance.description ||
        "The system is currently undergoing scheduled maintenance to improve our neural infrastructure. Please check back later.",
      data: {
        reason: activeMaintenance.reason,
        endTime: activeMaintenance.endTime,
      },
    });
  }
});
