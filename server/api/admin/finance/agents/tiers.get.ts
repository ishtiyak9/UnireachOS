import { prisma } from "../../../../utils/db";

/**
 * Agent Commission Override Registry
 * Fetches all dynamic commission tiers/rules for partners.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user || (session.user as any).roleCode !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Unauthorized Registry Access",
    });
  }

  const query = getQuery(event);
  const { agentId } = query;

  const tiers = await prisma.agentCommissionTier.findMany({
    where: {
      ...(agentId && { agentId: agentId as string }),
    },
    include: {
      agent: { select: { agencyName: true, agentCode: true } },
      university: { select: { name: true } },
    },
    orderBy: [{ agentId: "asc" }, { priority: "desc" }],
  });

  return { success: true, count: tiers.length, data: tiers };
});
