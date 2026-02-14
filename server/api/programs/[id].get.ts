import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized Intelligence Access.",
    });
  }

  const { id } = event.context.params as { id: string };

  try {
    const program = await prisma.course.findUnique({
      where: { id },
      include: {
        university: true,
        level: true,
        studyArea: true,
        discipline: true,
      },
    });

    if (!program) {
      throw createError({
        statusCode: 404,
        message: "Academic Asset not found in the global registry.",
      });
    }

    return {
      data: program,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to retrieve Neural Asset data.",
    });
  }
});
