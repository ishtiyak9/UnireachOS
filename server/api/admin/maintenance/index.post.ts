import { z } from "zod";
import { MaintenanceStatus } from "@prisma/client";

const maintenanceSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  description: z.string().optional(),
  startTime: z.string().datetime(), // ISO String
  endTime: z.string().datetime().optional(), // ISO String or missing (indefinite)
  status: z.nativeEnum(MaintenanceStatus).optional().default("SCHEDULED"),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // Ensure user ID exists (redundant if role check passes, but strictness helps)
  if (!session.user.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const data = await maintenanceSchema.parseAsync(body);

  // 2. Validate End Time
  if (data.endTime && new Date(data.endTime) <= new Date(data.startTime)) {
    throw createError({
      statusCode: 400,
      message: "End time must be after start time.",
    });
  }

  // 3. Create Maintenance Window
  const window = await prisma.maintenanceWindow.create({
    data: {
      reason: data.reason,
      description: data.description,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : null,
      status: data.status,
      createdById: session.user.id,
    },
  });

  return window;
});
