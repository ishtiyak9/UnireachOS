export default defineEventHandler(async (event) => {
  // TODO: Add permission check (Admin only)
  try {
    const body = await readBody(event);

    const story = await prisma.successStory.create({
      data: {
        type: body.type || "image",
        category: body.category || "student",
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
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
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
