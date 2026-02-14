import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const query = getQuery(event);
  const { country, isPremium } = query;

  const where: any = {};
  if (country) {
    where.country = country as string;
  }

  if (isPremium !== undefined && isPremium !== "" && isPremium !== "null") {
    where.isPremiumPartner = isPremium === "true";
  }

  try {
    const universities = await prisma.university.findMany({
      where,
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return universities;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch university population.",
    });
  }
});
