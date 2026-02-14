import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };
  const body = await readBody(event);

  const level = await prisma.programLevel.update({
    where: { id },
    data: {
      name: body.name,
      code: body.code,
      rank: parseInt(body.rank),
      category: body.category,
      isActive: body.isActive,
      updatedById: session.user.id,
    },
  });

  return level;
});
