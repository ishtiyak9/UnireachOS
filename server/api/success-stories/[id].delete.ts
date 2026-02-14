export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    await prisma.successStory.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
