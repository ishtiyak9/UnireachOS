import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const leadId = getRouterParam(event, "id");
  const body = await readBody(event);
  const { status } = body;

  if (!status) {
    throw createError({ statusCode: 400, message: "Status is required" });
  }

  // 1. Fetch current staff profile
  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { staffProfile: true },
  });

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status,
      events: {
        create: {
          type: "STATUS_CHANGE",
          performerId: dbUser?.staffProfile?.id,
          metadata: { to: status },
        },
      },
    },
  });

  return {
    success: true,
    data: lead,
  };
});
