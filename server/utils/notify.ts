import { prisma } from "./db";

// Types matching Schema (Defined locally until Prisma Client regenerates)
export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "SYSTEM";
export type NotificationChannel =
  | "IN_APP"
  | "EMAIL"
  | "WHATSAPP"
  | "SMS"
  | "PUSH";

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  channel?: NotificationChannel;
  metadata?: any;
}

/**
 * Unified Notification Engine (UNE)
 * Single entry point for dispatching messages across all channels.
 */
export const notify = {
  /**
   * Send a notification to a single user.
   * Prioritizes the user's preferences if set.
   *
   * @example
   * await notify.send({
   *   userId: user.id,
   *   title: "Application Submitted",
   *   message: "Your application to Oxford has been received.",
   *   type: "SUCCESS"
   * });
   */
  async send(payload: NotificationPayload) {
    const {
      userId,
      title,
      message,
      type = "INFO",
      channel = "IN_APP",
      metadata,
    } = payload;

    try {
      // 1. Check Preferences (Optional Phase 1: Skip if blocked)
      // const prefs = await prisma.notificationPreference.findUnique({ where: { userId } });
      // if (channel === 'EMAIL' && !prefs?.emailEnabled) return false;

      // 2. Log to Database (The Source of Truth)
      // We cast type/channel to any because Prisma Client types might not be generated yet
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type: type as any,
          channel: channel as any,
          metadata: metadata ?? {},
          isRead: false,
        },
      });

      // 3. Dispatch to External Channel (Async)
      await this.dispatchExternal(
        channel,
        userId,
        title,
        message,
        type,
        metadata,
        notification.id
      );

      return notification;
    } catch (error) {
      console.error("❌ Notification Engine Failure:", error);
      // We don't throw here to prevent crashing the main transaction
      return null;
    }
  },

  /**
   * Internal dispatcher for external providers (Email, SMS, etc.)
   */
  async dispatchExternal(
    channel: NotificationChannel,
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "INFO",
    metadata?: any,
    notificationId?: string
  ) {
    // TODO: Integrate Queue (BullMQ) here for high scale

    switch (channel) {
      case "EMAIL":
        // await emailProvider.send(...)
        console.log(`📧 [Mock Email] To ${userId}: ${title}`);
        break;

      case "WHATSAPP":
        console.log(`💬 [Mock WhatsApp] To ${userId}: ${title}`);
        break;

      case "IN_APP":
        // Realtime Push via WebSocket
        try {
          (useNitroApp() as any).hooks.callHook(
            "ws:broadcast",
            `user:${userId}`,
            {
              type: "notification",
              data: {
                id: notificationId,
                title,
                message,
                notificationType: type,
                metadata,
              },
            }
          );
        } catch (e) {
          console.warn(
            "[WS] Global broadcast hook failed (might be in non-nitro env):",
            e
          );
        }
        break;
    }
  },

  /**
   * Mark a notification as read
   */
  async markRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },
};
