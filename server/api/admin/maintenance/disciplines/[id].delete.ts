import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };

  try {
    await prisma.discipline.delete({
      where: { id },
    });
    return { message: "Discipline excised successfully" };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: "Cannot delete Discipline. It may have associated courses.",
    });
  }
});
