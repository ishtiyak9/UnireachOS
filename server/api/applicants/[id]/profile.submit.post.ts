export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing Identifier in route",
    });
  }

  // --- PERMISSIONS ---
  const isSelf = session.user.id === id;
  const isAdmin = ["super_admin", "admin", "official"].includes(
    (session.user as any).roleCode || (session.user as any).role || ""
  );

  let isAssignedAgent = false;
  if (!isSelf && !isAdmin) {
    // Basic Agent Check
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

  // 1. Verify profile exists and is not already locked
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: id },
  });

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: "No profile found to submit.",
    });
  }

  if (profile.isLocked) {
    throw createError({
      statusCode: 400,
      message: "Profile is already finalized.",
    });
  }

  // 2. Lock the profile
  const updated = await prisma.applicantProfile.update({
    where: { userId: id },
    data: {
      isLocked: true,
      submittedAt: new Date(),
    },
  });

  return {
    success: true,
    message: "Identity data finalized. Profile is now locked.",
    data: updated,
  };
});
