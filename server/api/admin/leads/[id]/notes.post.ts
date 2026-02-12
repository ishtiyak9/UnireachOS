import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const leadId = getRouterParam(event, "id");
  const body = await readBody(event);
  const { note } = body;

  if (!note) {
    throw createError({ statusCode: 400, message: "Note content is required" });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { staffProfile: true },
  });

  const leadEvent = await prisma.leadEvent.create({
    data: {
      leadId: leadId!,
      type: "NOTE",
      performerId: dbUser?.staffProfile?.id,
      metadata: { note },
    },
  });

  return {
    success: true,
    data: leadEvent,
  };
});
