import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };

  try {
    await prisma.course.delete({
      where: { id },
    });
    return { success: true, message: "Asset excised from registry." };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Excision failure: Asset may have dependencies or is missing.",
    });
  }
});
