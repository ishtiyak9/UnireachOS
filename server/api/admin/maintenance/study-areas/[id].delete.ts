import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };

  try {
    await prisma.studyArea.delete({
      where: { id },
    });
    return { message: "Study Area excised successfully" };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message:
        "Cannot delete Study Area. It may have associated disciplines or courses.",
    });
  }
});
