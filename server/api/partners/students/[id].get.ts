import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const id = event.context.params?.id;

  if (!session?.user || (session.user as any).roleCategory !== "AGENT") {
    throw createError({
      statusCode: 403,
      message: "Neural Access Denied.",
    });
  }

  const agentProfileId = (session.user as any).profile?.id;

  try {
    const student = await prisma.user.findFirst({
      where: {
        id,
        applicantProfile: {
          agentId: agentProfileId,
        },
      },
      include: {
        applicantProfile: true,
      },
    });

    if (!student) {
      throw createError({
        statusCode: 404,
        message: "Tactical Node not found.",
      });
    }

    return {
      data: student,
    };
  } catch (error) {
    throw error;
  }
});
