import { prisma } from "../utils/db";

// Global cache to avoid heavy DB hits on every request
let cachedMaintenance: any = null;
let lastCheck = 0;
const CACHE_TTL = 5000; // 5 seconds

export default defineEventHandler(async (event) => {
  // 1. Skip for public assets/internal h3 routes
  if (
    event.path.startsWith("/_nuxt") ||
    event.path.startsWith("/api/_") ||
    event.path.startsWith("/__") ||
    event.path.startsWith("/icon.png") ||
    event.path.startsWith("/logo.png")
  ) {
    return;
  }

  // 3. Check for active maintenance (with cache)
  let activeMaintenance = null;
  const now = Date.now();

  if (cachedMaintenance && now - lastCheck < CACHE_TTL) {
    activeMaintenance = cachedMaintenance;
  } else {
    const dbStart = Date.now();
    activeMaintenance = await prisma.maintenanceWindow.findFirst({
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
    cachedMaintenance = activeMaintenance;
    lastCheck = now;
  }

  if (activeMaintenance) {
    // 4. Bypass: Super Admin
    const session = await getUserSession(event);
    if (session?.user?.roleCode === "super_admin") return;

    // 5. Bypass: Whitelisted IP
    const ip = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";
    // We don't cache whitelist checks as much because they are IP-specific,
    // but in a team environment, we could.
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
