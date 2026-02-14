import { prisma } from "../../../../../utils/db";
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
  const docId = getRouterParam(event, "docId");
  const body = await readBody(event);

  // 1. Validate Input
  const result = unlockRequestSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues[0].message,
    });
  }

  // 2. Security Check
  const applicant = await prisma.applicantProfile.findUnique({
    where: { userId },
    select: { id: true, userId: true },
  });

  if (!applicant || applicant.userId !== session.user.id) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // 3. Verify Document
  const doc = await prisma.document.findUnique({
    where: { id: docId },
    select: { id: true, applicantId: true, isLocked: true },
  });

  if (!doc || doc.applicantId !== applicant.id) {
    throw createError({ statusCode: 404, message: "Document not found" });
  }

  if (!doc.isLocked) {
    throw createError({
      statusCode: 400,
      message:
        "This document is already unlocked. You can replace it directly.",
    });
  }

  // 4. Check for existing PENDING request for THIS document
  const existingRequest = await prisma.documentUnlockRequest.findFirst({
    where: {
      documentId: doc.id,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    throw createError({
      statusCode: 400,
      message: "You already have a pending unlock request for this document.",
    });
  }

  // 5. Create Request
  const request = await prisma.documentUnlockRequest.create({
    data: {
      applicantId: applicant.id,
      documentId: doc.id,
      reason: result.data.reason,
      status: "PENDING",
    },
  });

  return {
    success: true,
    message: "Document unlock request submitted successfully.",
    data: request,
  };
});
