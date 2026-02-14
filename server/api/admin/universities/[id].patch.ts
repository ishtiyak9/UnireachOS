import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const id = event.context.params?.id;
  const body = await readBody(event);
  const { name, country, code, description, website, logo } = body;

  try {
    const university = await prisma.university.update({
      where: { id },
      data: {
        name,
        country,
        code,
        description,
        website,
        logo,

        // Partnership Intelligence
        strategicRank:
          body.strategicRank !== undefined
            ? parseInt(body.strategicRank)
            : undefined,
        commissionSpeed:
          body.commissionSpeed !== undefined
            ? parseInt(body.commissionSpeed)
            : undefined,
        offerTATIndex:
          body.offerTATIndex !== undefined
            ? parseInt(body.offerTATIndex)
            : undefined,
        visaSuccessRate:
          body.visaSuccessRate !== undefined
            ? parseFloat(body.visaSuccessRate)
            : undefined,
        isPremiumPartner: body.isPremiumPartner,
        hasDirectContract: body.hasDirectContract,
        bannerImage: body.bannerImage,
        strategicTags: body.strategicTags,
      },
    });

    return university;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw createError({
        statusCode: 409,
        message:
          "Identity conflict: This name or code is already assigned to another asset.",
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to update university intelligence.",
    });
  }
});
