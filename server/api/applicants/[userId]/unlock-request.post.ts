import { prisma } from "../../../utils/db";
import { z } from "zod";

const unlockRequestSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters long"),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const userId = getRouterParam(event, "userId");
  const body = await readBody(event);

  // 1. Validate Input
  const result = unlockRequestSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.errors[0].message,
    });
  }

  // 2. Security Check (Only the applicant themselves can request unlock)
  if (session.user.id !== userId) {
    // Check if they are the owner of the profile
    const profile = await prisma.applicantProfile.findUnique({
      where: { userId },
      select: { userId: true, id: true, isLocked: true },
    });

    if (!profile || profile.userId !== session.user.id) {
      throw createError({ statusCode: 403, message: "Forbidden" });
    }
  }

  // 3. Get Applicant ID
  const applicant = await prisma.applicantProfile.findUnique({
    where: { userId },
    select: { id: true, isLocked: true },
  });

  if (!applicant) {
    throw createError({
      statusCode: 404,
      message: "Applicant profile not found",
    });
  }

  if (!applicant.isLocked) {
    throw createError({
      statusCode: 400,
      message: "The profile is not currently locked.",
    });
  }

  // 4. Check for existing PENDING request
  const existingRequest = await prisma.profileUnlockRequest.findFirst({
    where: {
      applicantId: applicant.id,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    throw createError({
      statusCode: 400,
      message:
        "You already have a pending unlock request. Please wait for the administrator to review it.",
    });
  }

  // 5. Create Request
  const request = await prisma.profileUnlockRequest.create({
    data: {
      applicantId: applicant.id,
      reason: result.data.reason,
      status: "PENDING",
    },
  });

  return {
    success: true,
    message: "Unlock request submitted successfully.",
    data: request,
  };
});
