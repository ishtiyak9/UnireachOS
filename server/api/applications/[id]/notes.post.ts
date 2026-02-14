import { prisma } from "../../../utils/db";
import { dispatcher } from "../../../utils/notifications";

/**
 * Application Thread: Post Note/Comment
 * Dynamically handles visibility (PUBLIC, PARTNER, INTERNAL) and
 * triggers precise notifications to the relevant parties.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const applicationId = getRouterParam(event, "id");
  const body = await readBody(event);
  const { content, visibility = "INTERNAL" } = body;

  if (!applicationId || !content) {
    throw createError({
      statusCode: 400,
      message: "Missing required comment data",
    });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      applicant: { include: { agent: true } },
      assignedStaff: true,
    },
  });

  if (!application) {
    throw createError({
      statusCode: 404,
      message: "Application node not found",
    });
  }

  // 1. Create the Note entry
  const note = await prisma.applicationNote.create({
    data: {
      applicationId,
      content,
      visibility: visibility as any,
      createdBy: session.user.id as string,
    },
  });

  // 2. Multi-Party Notification Logic (Targeted Dispatch)
  const notificationTitle = `New Comment on ${application.code}`;

  // A. Internal Staff notification (Always if not posted by staff themselves)
  if (
    session.user.roleCategory !== "STAFF" &&
    session.user.roleCategory !== "SYSTEM"
  ) {
    if (application.assignedStaffId) {
      await dispatcher.notifyUser(application.assignedStaff.userId, {
        title: notificationTitle,
        message: `Applicant/Agent posted a new comment: "${content.substring(
          0,
          50
        )}..."`,
        metadata: { applicationId, noteId: note.id },
      });
    }
  }

  // B. Partner/Agent notification (If visibility is PARTNER or PUBLIC)
  if (
    ["PARTNER", "PUBLIC"].includes(visibility) &&
    application.applicant.agent
  ) {
    if (session.user.id !== application.applicant.agent.userId) {
      await dispatcher.notifyUser(application.applicant.agent.userId, {
        title: notificationTitle,
        message: `UniReach Staff posted a comment: "${content.substring(
          0,
          50
        )}..."`,
        metadata: { applicationId, noteId: note.id },
      });
    }
  }

  // C. Applicant notification (Only if visibility is PUBLIC)
  if (
    visibility === "PUBLIC" &&
    session.user.id !== application.applicant.userId
  ) {
    await dispatcher.notifyUser(application.applicant.userId, {
      title: notificationTitle,
      message: `A new update has been posted to your application thread.`,
      metadata: { applicationId, noteId: note.id },
    });
  }

  return { success: true, note };
});
