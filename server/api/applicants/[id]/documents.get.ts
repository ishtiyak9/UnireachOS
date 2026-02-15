import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing Identifier" });
  }

  // --- PERMISSIONS ---
  const isSelf = session.user.id === id;
  const isAdmin = ["super_admin", "admin", "official"].includes(
    session.user.roleCode || session.user.role || ""
  );

  let isAssignedAgent = false;

  if (!isSelf && !isAdmin) {
    // Agent Check
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (agentProfile) {
      const applicant = await prisma.applicantProfile.findUnique({
        where: { userId: id },
        select: { agentId: true },
      });
      if (applicant?.agentId === agentProfile.id) {
        isAssignedAgent = true;
      }
    }
  }

  if (!isSelf && !isAdmin && !isAssignedAgent) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  const applicant = await prisma.applicantProfile.findUnique({
    where: { userId: id },
    select: { id: true },
  });

  if (!applicant) {
    throw createError({ statusCode: 404, message: "Applicant not found" });
  }

  const documents = await prisma.document.findMany({
    where: { applicantId: applicant.id },
    orderBy: { createdAt: "desc" },
  });

  return documents;
});
