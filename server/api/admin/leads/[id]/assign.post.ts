import { leadRouter } from "../../../../utils/leads";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const leadId = getRouterParam(event, "id");
  const body = await readBody(event);
  const { counselorId, type } = body;

  if (!leadId || !counselorId) {
    throw createError({
      statusCode: 400,
      message: "Missing target ID",
    });
  }

  const performerId = (session.user as any).id;

  if (type === "TEAM") {
    await leadRouter.forwardToTeam(leadId, counselorId, performerId);
  } else {
    await leadRouter.manualAssign(leadId, counselorId, performerId);
  }

  return {
    success: true,
    message:
      type === "TEAM" ? "Forwarded to Team" : "Lead manually reassigned.",
  };
});
