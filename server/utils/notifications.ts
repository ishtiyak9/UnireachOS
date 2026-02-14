import { prisma } from "./db";

type NotificationPayload = {
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "SYSTEM";
  metadata?: any;
};

/**
 * Institutional Notification Dispatcher (IND)
 * Handles multi-party notification routing for the Application Engine.
 */
export const dispatcher = {
  /**
   * Dispatches notifications to all relevant parties of an application
   */
  async notifyApplicationEvent(
    applicationId: string,
    payload: NotificationPayload
  ) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        applicant: { include: { agent: true } },
        assignedStaff: true,
      },
    });

    if (!application) return;

    const targets = new Set<string>();

    // 1. Always notify the Applicant
    targets.add(application.applicant.userId);

    // 2. Notify the Agent (if exists)
    if (application.applicant.agent) {
      targets.add(application.applicant.agent.userId);
    }

    // 3. Notify the Assigned Counselor
    if (application.assignedStaff) {
      targets.add(application.assignedStaff.userId);
    }

    // 4. Create Notification Records
    const notifications = Array.from(targets).map((userId) => ({
      userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || "INFO",
      metadata: {
        ...payload.metadata,
        applicationId,
        applicationCode: application.code,
      },
    }));

    await prisma.notification.createMany({
      data: notifications,
    });
  },

  /**
   * Precision Dispatcher for specific targets (e.g., individual comments)
   */
  async notifyUser(userId: string, payload: NotificationPayload) {
    await prisma.notification.create({
      data: {
        userId,
        title: payload.title,
        message: payload.message,
        type: payload.type || "INFO",
        metadata: payload.metadata,
      },
    });
  },
};
