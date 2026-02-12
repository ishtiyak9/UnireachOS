import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const leadId = getRouterParam(event, "id");
  const body = await readBody(event);
  const { date } = body;

  if (!date) {
    throw createError({
      statusCode: 400,
      message: "Follow-up date is required",
    });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { staffProfile: true },
  });

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      nextFollowUpAt: new Date(date),
      events: {
        create: {
          type: "NOTE",
          performerId: dbUser?.staffProfile?.id,
          metadata: { note: `Follow-up call scheduled for ${date}` },
        },
      },
    },
  });

  return {
    success: true,
    data: lead,
  };
});
