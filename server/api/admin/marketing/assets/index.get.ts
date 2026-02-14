import { prisma } from "../../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  try {
    const assets = await prisma.marketingAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return assets;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch tactical assets.",
    });
  }
});
