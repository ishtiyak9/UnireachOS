import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const leadId = getRouterParam(event, "id");

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      assignedCounselor: true,
      events: {
        include: {
          performer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!lead) {
    throw createError({ statusCode: 404, message: "Lead not found" });
  }

  return {
    data: lead,
  };
});
