import { z } from "zod";
import { MaintenanceStatus } from "@prisma/client";

const maintenanceUpdateSchema = z.object({
  status: z.nativeEnum(MaintenanceStatus).optional(),
  description: z.string().optional(),
  endTime: z.string().datetime().optional(), // Extend/Shorten
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Invalid ID" });
  }

  const body = await readBody(event);
  const data = await maintenanceUpdateSchema.parseAsync(body);

  // 2. Fetch Existing Window
  const window = await prisma.maintenanceWindow.findUnique({
    where: { id },
  });

  if (!window) {
    throw createError({
      statusCode: 404,
      message: "Maintenance Window not found",
    });
  }

  // 3. Update
  const updatedWindow = await prisma.maintenanceWindow.update({
    where: { id },
    data: {
      status: data.status,
      description: data.description,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    },
  });

  return updatedWindow;
});
