import { z } from "zod";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || session.user.roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied. Restricted to Supreme Administrator.",
    });
  }

  // 2. Fetch Windows
  const windows = await prisma.maintenanceWindow.findMany({
    orderBy: { startTime: "desc" },
    include: {
      createdBy: {
        select: { email: true, role: { select: { name: true } } },
      },
    },
    take: 50, // Limit history
  });

  return windows;
});
