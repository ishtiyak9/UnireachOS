import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };
  const body = await readBody(event);

  const area = await prisma.studyArea.update({
    where: { id },
    data: {
      name: body.name,
      isActive: body.isActive,
    },
  });

  return area;
});
