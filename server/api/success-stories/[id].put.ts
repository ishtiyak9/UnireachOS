export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  try {
    const body = await readBody(event);

    const story = await prisma.successStory.update({
      where: { id },
      data: {
        type: body.type,
        category: body.category,
        name: body.name,
        destination: body.destination,
        university: body.university,
        program: body.program,
        visaType: body.visaType,
        year: body.year,
        thumbnail: body.thumbnail,
        image: body.image,
        videoUrl: body.videoUrl,
        quote: body.quote,
        isFeatured: body.isFeatured,
        isActive: body.isActive,
      },
    });

    return story;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});
