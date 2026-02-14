import { prisma } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 403, message: "Neural Access Denied." });
  }

  const roleCategory = (session.user as any).roleCategory;

  const visibilityFilter: string[] = ["ALL"];
  if (roleCategory === "AGENT" || roleCategory === "STAFF") {
    visibilityFilter.push("PARTNERS");
  }
  if (roleCategory === "STAFF") {
    visibilityFilter.push("INTERNAL");
  }

  try {
    const assets = await prisma.marketingAsset.findMany({
      where: {
        visibility: { in: visibilityFilter as any },
      },
      orderBy: { createdAt: "desc" },
    });
    return assets;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch marketing resources.",
    });
  }
});
