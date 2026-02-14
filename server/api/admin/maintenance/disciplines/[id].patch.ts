import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = event.context.params as { id: string };
  const body = await readBody(event);

  const discipline = await prisma.discipline.update({
    where: { id },
    data: {
      name: body.name,
      studyAreaId: body.studyAreaId,
      isActive: body.isActive,
    },
  });

  return discipline;
});
