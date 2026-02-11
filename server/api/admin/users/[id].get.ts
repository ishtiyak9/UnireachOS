import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing user ID" });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: true,
      applicantProfile: {
        include: {
          agent: true,
          addresses: true,
          emergencyContacts: true,
          educationHistory: true,
          workExperience: true,
          englishProficiency: true,
        },
      },
      agentProfile: true,
      staffProfile: true,
    },
  });

  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }

  // Fetch audit logs as status history
  const logs = await prisma.auditLog.findMany({
    where: {
      entityType: "User",
      entityId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const statusHistory = logs.map((log) => ({
    id: log.id,
    status: log.action, // e.g. "CREATE_USER", "UPDATE_STATUS"
    createdAt: log.createdAt,
    reason: (log.newValue as any)?.reason || "", // extracting reason if available
  }));

  return {
    ...user,
    statusHistory,
  };
});
