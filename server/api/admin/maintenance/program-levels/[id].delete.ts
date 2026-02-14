import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };

  try {
    await prisma.programLevel.delete({
      where: { id },
    });
    return { message: "Program Level excised successfully" };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message:
        "Cannot delete Program Level. It may be associated with active courses.",
    });
  }
});
