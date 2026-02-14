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

  // --- FETCH DATA ---
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: id },
    include: {
      addresses: true,
      educationHistory: { orderBy: { endDate: "desc" } },
      workExperience: { orderBy: { startDate: "desc" } },
      englishProficiency: { orderBy: { examDate: "desc" } },
      emergencyContacts: true,

      // Relations
      agent: {
        select: {
          agencyName: true,
          phone: true,
          user: { select: { email: true } },
        },
      },
      assignedStaff: {
        select: {
          firstName: true,
          lastName: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  if (!profile) {
    // If accessing self, return structured null
    if (isSelf) return { exists: false, data: null };
    // If Admin/Agent accessing non-existent profile, 404
    throw createError({
      statusCode: 404,
      message: "Applicant Profile not found",
    });
  }

  return {
    exists: true,
    data: profile,
  };
});
