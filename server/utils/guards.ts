import { prisma } from "./db";
import type { H3Event } from "h3";

export const checkSystemAccess = async (
  event: H3Event,
  action: "LOGIN" | "REGISTER" | "ACCESS" = "ACCESS",
  role?: string
) => {
  // 1. Fetch Config (Cached ideally, but DB for now)
  const config = await prisma.systemConfig.findUnique({
    where: { id: "global" },
  });

  if (!config) return; // Should exist if seeded/initialized

  // 2. CHECK MAINTENANCE MODE
  const activeMaintenance = await prisma.maintenanceWindow.findFirst({
    where: {
      OR: [
        { status: "ACTIVE" }, // Manual Override
        {
          status: "SCHEDULED",
          startTime: { lte: new Date() },
          OR: [{ endTime: { gte: new Date() } }, { endTime: null }],
        },
      ],
    },
  });

  if (activeMaintenance) {
    // Bypass: Super Admin
    const session = await getUserSession(event);
    if (session?.user?.roleCode === "super_admin") return;

    // Bypass: Whitelisted IP
    const ip = getRequestIP(event, { xForwardedFor: true }) || "127.0.0.1";
    // Check if IP is explicitly ALLOWED in Access Control
    // (Note: We usually check this anyway, but here we specifically check if it BYPASSES maintenance)
    // Actually, usually Maintenace blocks EVERYONE except Admins.
    // But let's allow Whitelisted IPs (Devs/QA) to access.

    const isWhitelisted = await prisma.systemAccessControl.findFirst({
      where: {
        ipAddress: ip,
        type: "ALLOW",
      },
    });

    if (!isWhitelisted) {
      throw createError({
        statusCode: 503,
        message:
          activeMaintenance.description || "System is under maintenance.",
      });
    }
  }

  // 3. CHECK FIREWALL (BLACKLIST)
  const ip = getRequestIP(event, { xForwardedFor: true });
  if (ip) {
    const blocked = await prisma.systemAccessControl.findFirst({
      where: { ipAddress: ip, type: "BLOCK" },
    });
    if (blocked) {
      throw createError({
        statusCode: 403,
        message: "Access Denied by Firewall.",
      });
    }
  }

  // 4. CHECK GATE SWITCHES
  if (action === "REGISTER") {
    if (role === "AGENT") {
      if (!config.allowAgentRegister) {
        throw createError({
          statusCode: 403,
          message: "Partner registrations are currently paused.",
        });
      }
    } else {
      // Default / Public as Applicant
      if (!config.allowPublicRegister) {
        throw createError({
          statusCode: 403,
          message: "New student registrations are currently closed.",
        });
      }
    }
  }

  if (action === "LOGIN") {
    // Map APPLICANT to allowStudentLogin switch
    if (
      (role === "APPLICANT" || role === "STUDENT") &&
      !config.allowStudentLogin
    ) {
      throw createError({
        statusCode: 503,
        message: "Student portal is temporarily unavailable.",
      });
    }
    if (role === "AGENT" && !config.allowAgentLogin) {
      throw createError({
        statusCode: 503,
        message: "Agent portal is temporarily unavailable.",
      });
    }
  }
};
