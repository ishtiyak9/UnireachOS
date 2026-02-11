export default defineEventHandler(async (event) => {
  await checkSystemAccess(event, "ACCESS", "STUDENT");

  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const userId = session.user.id;

  // 1. Verify profile exists and is not already locked
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: "No profile found to submit. Please save your data first.",
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
    where: { userId },
    data: {
      isLocked: true,
      submittedAt: new Date(),
    },
  });

  return {
    success: true,
    message:
      "Identity data finalized. Profile is now locked for institutional review.",
    data: updated,
  };
});
