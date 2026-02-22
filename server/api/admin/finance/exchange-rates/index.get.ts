import { prisma } from "../../../../utils/db";

/**
 * FX Benchmark Registry
 * Fetches all active and historical exchange rates.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || (session.user as any).roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Unauthorized Treasury Registry",
    });
  }

  const rates = await prisma.exchangeRate.findMany({
    orderBy: { effectiveDate: "desc" },
    take: 50,
  });

  return { success: true, rates };
});
