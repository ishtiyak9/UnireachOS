import { prisma } from "../../../utils/db";
import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  const body = await readMultipartFormData(event);

  if (!body) {
    throw createError({ statusCode: 400, message: "Missing form data" });
  }

  // 1. Get Applicant Profile
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

  // 5.9. Security & Role Context
  const isStaff = ["super_admin", "admin", "official"].includes(
    session.user.roleCode || session.user.role || ""
  );

  // 6. Check for existing document in this category to handle specialized locking
  const existingDoc = await prisma.document.findFirst({
    where: {
      applicantId: applicant.id,
      category: category as any,
      uploadSource: isStaff ? "STAFF" : "APPLICANT",
    },
  });

  // Rule: If document is already locked (e.g. verified), applicant cannot replace it.
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
  const uploadSource = isStaff ? "STAFF" : "APPLICANT";

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
      uploaderId: session.user.id,
      status: isStaff ? "OFFICIAL" : "PENDING",
      isLocked: isStaff, // Staff uploads are usually official/locked by default
    },
  });

  return document;
});
