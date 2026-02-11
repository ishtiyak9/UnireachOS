import { prisma } from "../../../utils/db";
import fs from "node:fs";
import path from "node:path";
import { createReadStream } from "node:fs";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing Document ID" });
  }

  // 1. Fetch Document metadata
  const doc = await prisma.document.findUnique({
    where: { id },
  });

  if (!doc) {
    throw createError({ statusCode: 404, message: "Document not found" });
  }

  // 2. Permission Check
  const isStaff = ["super_admin", "admin", "official"].includes(
    session.user.roleCode || session.user.role || ""
  );

  // Rule: Must be uploader (applicant) OR a staff member
  const isOwner = doc.uploaderId === session.user.id;

  if (!isOwner && !isStaff) {
    throw createError({
      statusCode: 403,
      message: "You don't have permission to view this document.",
    });
  }

  // 3. Construct File Path
  const filePath = path.resolve(process.cwd(), "local_docs", doc.fileKey);

  if (!fs.existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      message: "Physical file not found on server.",
    });
  }

  // 4. Set Headers
  setResponseHeaders(event, {
    "Content-Type": doc.mimeType,
    "Content-Disposition": `inline; filename="${doc.name}"`,
    "Cache-Control": "private, max-age=3600",
  });

  // 5. Stream the file
  return sendStream(event, createReadStream(filePath));
});
