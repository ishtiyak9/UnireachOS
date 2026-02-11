import { prisma } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const userId = getRouterParam(event, "userId");
  if (!userId) {
    throw createError({ statusCode: 400, message: "Missing User ID" });
  }

  // Permission Check (Self or Staff)
  const isSelf = session.user.id === userId;
  const isAdmin = ["super_admin", "admin", "official"].includes(
    session.user.roleCode || session.user.role || ""
  );

  if (!isSelf && !isAdmin) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  const applicant = await prisma.applicantProfile.findUnique({
    where: { userId },
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
