import { prisma } from "../../../utils/db";
import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { notifyApplicantChange } from "../../../utils/notifications";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const userSession = session.user as any;
  const id = getRouterParam(event, "id");
  const body = await readMultipartFormData(event);

  if (!body) {
    throw createError({ statusCode: 400, message: "Missing form data" });
  }

  // --- PERMISSIONS & CONTEXT ---
  const isSelf = userSession.id === id;
  const isStaff = ["super_admin", "admin", "official"].includes(
    userSession.roleCode || userSession.role || ""
  );

  let isAssignedAgent = false;
  let agentId: string | null = null;

  if (!isSelf && !isStaff) {
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { userId: userSession.id },
      select: { id: true },
    });
    if (agentProfile) {
      const applicant = await prisma.applicantProfile.findUnique({
        where: { userId: id },
        select: { agentId: true },
      });
      if (applicant?.agentId === agentProfile.id) {
        isAssignedAgent = true;
        agentId = agentProfile.id;
      }
    }
  }

  if (!isSelf && !isStaff && !isAssignedAgent) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // 1. Get Applicant Profile (Full)
  const applicant = await prisma.applicantProfile.findUnique({
    where: { userId: id },
    select: { id: true, isLocked: true },
  });

  if (!applicant) {
    throw createError({ statusCode: 404, message: "Applicant not found" });
  }

  // 2. Parse Fields
  const category = body.find((f) => f.name === "category")?.data.toString();
  const file = body.find((f) => f.name === "file");

  if (!category || !file) {
    throw createError({ statusCode: 400, message: "Missing category or file" });
  }

  // 4. File Size Check (500KB)
  const MAX_SIZE = 500 * 1024;
  if (file.data.length > MAX_SIZE) {
    throw createError({
      statusCode: 400,
      message: "File too large. Maximum size allowed is 500KB.",
    });
  }

  // 5. File Type Check (PDF, PNG, JPG)
  const allowedMimeTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  if (!file.type || !allowedMimeTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      message: "Invalid file type. Only PDF, PNG, and JPG/JPEG are allowed.",
    });
  }

  // 6. Check for existing document in this category
  const uploadSource = isStaff
    ? "STAFF"
    : isAssignedAgent
    ? "AGENT"
    : "APPLICANT";

  const existingDoc = await prisma.document.findFirst({
    where: {
      applicantId: applicant.id,
      category: category as any,
      uploadSource,
    },
  });

  // Rule: If document is already locked (verified), applicants/agents cannot replace it without unlock.
  if (!isStaff && existingDoc?.isLocked) {
    throw createError({
      statusCode: 403,
      message:
        "This document is verified and locked. Contact support to request a change.",
    });
  }

  // 7. Handle Cleanup of replaced file
  if (existingDoc) {
    const oldPath = path.resolve(
      process.cwd(),
      "local_docs",
      existingDoc.fileKey
    );
    try {
      if (existsSync(oldPath)) await fs.unlink(oldPath);
    } catch (e) {
      console.error("Cleanup failed for replaced file:", oldPath, e);
    }
    await prisma.document.delete({ where: { id: existingDoc.id } });
  }

  // 8. Handle File Storage (Local)
  const uploadDir = path.resolve(process.cwd(), "local_docs");
  const applicantDir = path.join(uploadDir, applicant.id);

  // Ensure directories exist
  if (!existsSync(uploadDir)) await fs.mkdir(uploadDir, { recursive: true });
  if (!existsSync(applicantDir))
    await fs.mkdir(applicantDir, { recursive: true });

  const fileName = `${Date.now()}-${file.filename}`;
  const filePath = path.join(applicantDir, fileName);
  await fs.writeFile(filePath, file.data);

  const fileKey = `${applicant.id}/${fileName}`; // Relative key for DB

  // 8. Database Entry
  const document = await prisma.document.create({
    data: {
      applicantId: applicant.id,
      name: file.filename || "unnamed_file",
      category: category as any,
      fileKey,
      fileSize: file.data.length,
      mimeType: file.type || "application/octet-stream",
      uploadSource,
      uploaderId: (session.user as any).id,
      status: isStaff ? "OFFICIAL" : "PENDING",
      isLocked: isStaff, // Staff uploads are usually official/locked by default
    },
  });

  // Create Initial Notification Trigger if Agent
  if (uploadSource === "AGENT") {
    const user = session.user as any;
    const updaterName =
      `${user.profile?.firstName || ""} ${
        user.profile?.lastName || ""
      }`.trim() || user.email;

    try {
      if (id) {
        await notifyApplicantChange({
          applicantId: id, // Router param id is the applicant's userId
          updaterId: (session.user as any).id,
          updaterName,
          type: "DOCUMENT_UPLOAD",
          details: `Category: ${category}`,
        });
      }
    } catch (e) {
      console.error("Failed to trigger document upload notification:", e);
    }
  }

  return document;
});
