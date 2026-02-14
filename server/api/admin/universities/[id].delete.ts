import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const id = event.context.params?.id;

  try {
    await prisma.university.delete({
      where: { id },
    });

    return { success: true, message: "University asset purged from registry." };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to excise university asset from the registry.",
    });
  }
});
