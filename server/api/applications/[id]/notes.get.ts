import { prisma } from "../../../utils/db";

/**
 * Application Thread: Fetch Notes
 * Enforces strict visibility protocols based on the requester's role.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const applicationId = getRouterParam(event, "id");
  if (!applicationId) {
    throw createError({
      statusCode: 400,
      message: "Missing application identifier",
    });
  }

  // Define visibility filters based on Neural Role
  let allowedVisibilities: string[] = ["PUBLIC"];

  if (session.user.roleCategory === "AGENT") {
    allowedVisibilities.push("PARTNER");
  } else if (
    session.user.roleCategory === "STAFF" ||
    session.user.roleCategory === "SYSTEM"
  ) {
    allowedVisibilities.push("PARTNER", "INTERNAL");
  }

  const notes = await prisma.applicationNote.findMany({
    where: {
      applicationId,
      visibility: { in: allowedVisibilities as any },
    },
    orderBy: { createdAt: "asc" },
  });

  return { success: true, notes };
});
