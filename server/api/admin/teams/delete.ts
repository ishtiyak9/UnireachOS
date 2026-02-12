import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const query = getQuery(event);
  const id = query.id as string;

  if (!id) {
    throw createError({ statusCode: 400, message: "Team ID is required" });
  }

  // Check if team has members
  const memberCount = await prisma.staffProfile.count({
    where: { teamId: id },
  });

  if (memberCount > 0) {
    throw createError({
      statusCode: 400,
      message:
        "Neural Safety Lock: Cannot dismantle a cell with active personnel. Transfer members first.",
    });
  }

  await prisma.team.delete({
    where: { id },
  });

  return {
    success: true,
    message: "Cell dismantled successfully.",
  };
});
