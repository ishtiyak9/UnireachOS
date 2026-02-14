import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const query = getQuery(event);
  const { country, studyAreaId, disciplineId } = query;

  const where: any = {};

  if (country) {
    where.university = {
      country: country as string,
    };
  }

  if (studyAreaId) {
    where.studyAreaId = studyAreaId as string;
  }

  if (disciplineId) {
    where.disciplineId = disciplineId as string;
  }

  const courses = await prisma.course.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      university: {
        select: {
          id: true,
          name: true,
          logo: true,
          country: true,
        },
      },
      level: {
        select: {
          id: true,
          name: true,
        },
      },
      studyArea: {
        select: {
          id: true,
          name: true,
        },
      },
      discipline: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return courses;
});
