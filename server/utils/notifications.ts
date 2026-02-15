import { prisma } from "./db";
import { NotificationType, NotificationChannel } from "@prisma/client";
import { notify } from "./notify";

interface NotifyOptions {
  applicantId: string;
  updaterId: string;
  updaterName: string;
  type: "PROFILE_UPDATE" | "DOCUMENT_UPLOAD";
  details?: string;
}

/**
 * High-Level Notification Dispatcher
 * Abstracts complex multi-party notification logic into simple, semantic calls.
 */
export const dispatcher = {
  /**
   * Send a direct notification to a user via the Unified Notification Engine.
   */
  async notifyUser(userId: string, payload: any) {
    return await notify.send({
      userId,
      ...payload,
    });
  },

  /**
   * Handle application-specific events, typically notifying the applicant.
   */
  async notifyApplicationEvent(applicationId: string, payload: any) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { applicant: { select: { userId: true } } },
    });

    if (application?.applicant?.userId) {
      return await this.notifyUser(application.applicant.userId, {
        ...payload,
        metadata: { ...payload.metadata, applicationId },
        category: "APPLICANT",
      });
    }
  },

  /**
   * Complex logic for notifying counselor/team/admin when an agent updates a profile.
   */
  async notifyApplicantChange(options: NotifyOptions) {
    const { applicantId, updaterId, updaterName, type, details } = options;

    const applicant = await prisma.applicantProfile.findUnique({
      where: { userId: applicantId },
      select: {
        firstName: true,
        lastName: true,
        assignedStaffId: true,
        assignedStaff: {
          select: {
            teamId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!applicant) return;

    const applicantName = `${applicant.firstName} ${applicant.lastName}`;
    const title =
      type === "PROFILE_UPDATE"
        ? `Profile Updated: ${applicantName}`
        : `New Document: ${applicantName}`;
    const message =
      type === "PROFILE_UPDATE"
        ? `Agent ${updaterName} updated the profile information for ${applicantName}. ${
            details || ""
          }`
        : `Agent ${updaterName} uploaded a new document for ${applicantName}. ${
            details || ""
          }`;

    const recipientIds = new Set<string>();

    if (applicant.assignedStaffId) {
      const counselorUser = await prisma.staffProfile.findUnique({
        where: { id: applicant.assignedStaffId },
        select: { userId: true },
      });
      if (counselorUser) recipientIds.add(counselorUser.userId);
    }

    if (applicant.assignedStaff?.teamId) {
      const teamMembers = await prisma.staffProfile.findMany({
        where: { teamId: applicant.assignedStaff.teamId },
        select: { userId: true },
      });
      teamMembers.forEach((m) => recipientIds.add(m.userId));
    }

    const systemUsers = await prisma.user.findMany({
      where: {
        OR: [
          { role: { code: "super_admin" } },
          {
            groups: {
              some: {
                group: {
                  permissions: {
                    some: { permission: { code: "notification:view_system" } },
                  },
                },
              },
            },
          },
          {
            role: {
              permissions: {
                some: { permission: { code: "notification:view_system" } },
              },
            },
          },
        ],
      },
      select: { id: true },
    });
    systemUsers.forEach((u) => recipientIds.add(u.id));

    for (const recipientId of recipientIds) {
      if (recipientId === updaterId) continue;

      const isSystemAlert = systemUsers.some((u) => u.id === recipientId);

      await notify.send({
        userId: recipientId,
        title,
        message,
        type: "INFO",
        category: isSystemAlert ? "SYSTEM" : "APPLICANT",
        metadata: {
          applicantId,
          updaterId,
          type,
        },
      });
    }
  },
};

// Aliased export for compatibility with existing imports
export const notifyApplicantChange =
  dispatcher.notifyApplicantChange.bind(dispatcher);
