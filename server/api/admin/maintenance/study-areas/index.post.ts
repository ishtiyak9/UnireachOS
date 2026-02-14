import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);

  if (!body.name) {
    throw createError({ statusCode: 400, message: "Name is required" });
  }

  const area = await prisma.studyArea.create({
    data: {
      name: body.name,
      isActive: body.isActive ?? true,
    },
  });

  return area;
});
