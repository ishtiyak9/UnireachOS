import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);

  if (!body.name || !body.code) {
    throw createError({
      statusCode: 400,
      message: "Name and Code are required",
    });
  }

  const level = await prisma.programLevel.create({
    data: {
      name: body.name,
      code: body.code,
      rank: parseInt(body.rank) || 0,
      category: body.category || "GENERAL",
      isActive: body.isActive ?? true,
      createdById: session.user.id,
    },
  });

  return level;
});
