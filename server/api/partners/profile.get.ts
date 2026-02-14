import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user || (session.user as any).roleCategory !== "AGENT") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied.",
    });
  }

  const userId = session.user.id;

  try {
    const profile = await prisma.agentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!profile) {
      throw createError({
        statusCode: 404,
        message: "Agent Profile not found.",
      });
    }

    return profile;
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      message: "Failed to retrieve executive profile.",
    });
  }
});
