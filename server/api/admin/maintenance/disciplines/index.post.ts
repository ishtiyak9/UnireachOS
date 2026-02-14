import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);

  if (!body.name || !body.studyAreaId) {
    throw createError({
      statusCode: 400,
      message: "Name and Study Area are required",
    });
  }

  const discipline = await prisma.discipline.create({
    data: {
      name: body.name,
      studyAreaId: body.studyAreaId,
      isActive: body.isActive ?? true,
    },
  });

  return discipline;
});
