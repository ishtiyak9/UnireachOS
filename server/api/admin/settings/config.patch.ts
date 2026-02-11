import { z } from "zod";

const settingsSchema = z.object({
  allowPublicRegister: z.boolean().optional(),
  allowAgentRegister: z.boolean().optional(),
  allowStudentLogin: z.boolean().optional(),
  allowAgentLogin: z.boolean().optional(),
  systemBannerMessage: z.string().nullable().optional(),
  systemBannerType: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const user = session?.user as any;

    // Explicit role check (casted to avoid TS errors on dynamic properties)
    if (!user || user.roleCode !== "super_admin") {
      throw createError({ statusCode: 403, message: "Access Denied." });
    }

    const body = await readBody(event);
    const data = await settingsSchema.parseAsync(body);

    const config = await prisma.systemConfig.upsert({
      where: { id: "global" },
      update: data,
      create: {
        id: "global",
        allowPublicRegister: true,
        allowAgentRegister: true,
        allowStudentLogin: true,
        allowAgentLogin: true,
        ...data,
      },
    });

    // Log this critical action (Non-blocking)
    try {
      await prisma.auditLog.create({
        data: {
          performedById: user.id,
          action: "UPDATE_SYSTEM_CONFIG",
          entityType: "SystemConfig",
          entityId: "global",
          newValue: data,
        },
      });
    } catch (auditErr) {
      console.error("Audit Log Creation Failed:", auditErr);
      // We do not revert the config change just because audit failed,
      // but we log it for admin review.
    }

    return config;
  } catch (err: any) {
    console.error("Config Update Failed:", err);
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || "Internal Server Error",
      data: err,
    });
  }
});
