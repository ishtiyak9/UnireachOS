import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const body = await readBody(event);
  const { name, country, code, description, website, logo } = body;

  if (!name || !country || !code) {
    throw createError({
      statusCode: 400,
      message:
        "Required biological data missing: name, country, and code are essential.",
    });
  }

  try {
    const university = await prisma.university.create({
      data: {
        name,
        country,
        code,
        description,
        website,
        logo,

        // Partnership Intelligence
        strategicRank: parseInt(body.strategicRank) || 0,
        commissionSpeed: parseInt(body.commissionSpeed) || 3,
        offerTATIndex: parseInt(body.offerTATIndex) || 3,
        visaSuccessRate: parseFloat(body.visaSuccessRate) || 0,
        isPremiumPartner: body.isPremiumPartner ?? false,
        hasDirectContract: body.hasDirectContract ?? true,
        bannerImage: body.bannerImage,
        strategicTags: body.strategicTags || [],
      },
    });

    return university;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw createError({
        statusCode: 409,
        message:
          "A university with this identity code or name already exists in the registry.",
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to propagate university asset to the registry.",
    });
  }
});
