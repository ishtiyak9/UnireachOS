import { prisma } from "../../../utils/db";
import { STATUS_VISIBILITY_MAP } from "../../../../shared/constants";
import { dispatcher } from "../../../utils/notifications";

/**
 * Tactical State Orchestrator: Application PATCH
 * Manages institutional state transitions, dual-track status mapping,
 * priority shifts, and clinical audit trail generation.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Authentication Required" });
  }

  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { status, priority, assignedStaffId, reason } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing application identifier",
    });
  }

  const previousApplication = await prisma.application.findUnique({
    where: { id },
  });

  if (!previousApplication) {
    throw createError({
      statusCode: 404,
      message: "Application node not found",
    });
  }

  // 1. Orchestrate the State Transition
  return await prisma.$transaction(async (tx) => {
    const updateData: any = {};

    // A. Strategic Status Logic
    if (status && status !== previousApplication.status) {
      updateData.status = status;
      // Dual-Track Mapping: Automatically derive external status
      updateData.externalStatus = STATUS_VISIBILITY_MAP[status] || "Processing";

      // Initialize Audit Log for history
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: id,
          fromStatus: previousApplication.status,
          toStatus: status,
          reason: reason || "Administrative state transition.",
          performedBy: session.user.id as string,
        },
      });
    }

    // B. Support Fields
    if (priority) updateData.priority = priority;
    if (assignedStaffId) updateData.assignedStaffId = assignedStaffId;

    const updatedApplication = await tx.application.update({
      where: { id },
      data: updateData,
      include: {
        applicant: true,
        course: { include: { university: true } },
      },
    });

    // 2. Dispatch Intelligence
    if (status && status !== previousApplication.status) {
      await dispatcher.notifyApplicationEvent(id, {
        title: "Application Status Updated",
        message: `Your application to ${updatedApplication.course.university.name} has moved to: ${updatedApplication.externalStatus}`,
        type: "SUCCESS",
        metadata: { status: updatedApplication.externalStatus },
      });
    }

    return { success: true, application: updatedApplication };
  });
});
