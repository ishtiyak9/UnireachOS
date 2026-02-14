import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      university: true,
      level: true,
      studyArea: true,
      discipline: true,
    },
  });

  if (!course) {
    throw createError({
      statusCode: 404,
      message: "Academic Asset not found in the registry.",
    });
  }

  return course;
});
