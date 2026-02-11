import { prisma } from "../../utils/db";
import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing Document ID" });
  }

  const doc = await prisma.document.findUnique({
    where: { id },
    include: { applicant: true },
  });

  if (!doc) {
    throw createError({ statusCode: 404, message: "Document not found" });
  }

  // Permission Logic
  const isOwner = doc.uploaderId === session.user.id;
  const isAdmin = ["super_admin", "admin", "official"].includes(
    session.user.roleCode || session.user.role || ""
  );

  if (doc.isLocked && !isAdmin) {
    throw createError({
      statusCode: 403,
      message: "Document is locked and cannot be deleted.",
    });
  }

  if (!isOwner && !isAdmin) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  // Delete physical file if it exists
  const filePath = path.resolve(process.cwd(), "local_docs", doc.fileKey);
  try {
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete physical file: ${filePath}`, err);
    // We continue deleting the DB record even if file deletion fails
  }

  await prisma.document.delete({ where: { id } });

  return { success: true };
});
