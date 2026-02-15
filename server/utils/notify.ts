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

export type NotificationCategory =
  | "SYSTEM"
  | "AGENT"
  | "APPLICANT"
  | "LEAD"
  | "MARKETING";

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  channel?: NotificationChannel;
  category?: NotificationCategory;
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
   *   type: "SUCCESS",
   *   category: "APPLICANT"
   * });
   */
  async send(payload: NotificationPayload) {
    const {
      userId,
      title,
      message,
      type = "INFO",
      channel = "IN_APP",
      category,
      metadata,
    } = payload;

    try {
      // 1. Check Preferences (Granular Control)
      // We check if the user has explicitly disabled this category
      if (category) {
        const prefs = await prisma.notificationPreference.findUnique({
          where: { userId },
        });

        if (prefs) {
          // Check global channel prefs first
          if (channel === "EMAIL" && !prefs.emailEnabled) return null;
          if (channel === "PUSH" && !prefs.pushEnabled) return null;

          // Check granular category prefs
          if (category === "SYSTEM" && !prefs.systemEnabled) return null;
          if (category === "AGENT" && !prefs.agentEnabled) return null;
          if (category === "APPLICANT" && !prefs.applicantEnabled) return null;
          if (category === "LEAD" && !prefs.leadEnabled) return null;
          if (category === "MARKETING" && !prefs.marketingEnabled) return null;
        }
      }

      // 2. Log to Database (The Source of Truth)
      // We cast type/channel/category to any because Prisma Client types might not be generated yet
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type: type as any,
          channel: channel as any,
          // category: category as any, // Only if we added category to Notification model too, which we should have but schema didn't show it being added to Notification model, only Preference. Assuming it's fine for now or stored in metadata?
          // Actually, if we didn't add category to Notification model, let's store it in metadata if needed, or ignore.
          // The user requirement was about preferences.
          metadata: { ...(metadata || {}), category },
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

  /**
   * Broadcast a notification to an entire team.
   */
  async broadcastToTeam(
    teamId: string,
    payload: Omit<NotificationPayload, "userId">,
    excludeUserIds: string[] = []
  ) {
    const members = await prisma.staffProfile.findMany({
      where: {
        teamId,
        NOT: { userId: { in: excludeUserIds } },
      },
      select: { userId: true },
    });

    const notifications = await Promise.all(
      members.map((member: any) =>
        this.send({ ...payload, userId: member.userId })
      )
    );

    return notifications;
  },

  /**
   * Broadcast a notification to all users who possess a specific capability/permission.
   * This allows for 'Authority-Level' targeting without role-hardcoding.
   */
  async broadcastByPermission(
    permissionCode: string,
    payload: Omit<NotificationPayload, "userId">,
    category?: NotificationCategory
  ) {
    // Map Permission to Preference Field if category is provided
    let preferenceCondition: any = {};
    if (category) {
      if (category === "SYSTEM") preferenceCondition = { systemEnabled: true };
      if (category === "AGENT") preferenceCondition = { agentEnabled: true };
      if (category === "APPLICANT")
        preferenceCondition = { applicantEnabled: true };
      if (category === "LEAD") preferenceCondition = { leadEnabled: true };
      if (category === "MARKETING")
        preferenceCondition = { marketingEnabled: true };
    }

    // Find all users who have this permission directly or via role/group AND have the preference enabled
    const eligibleUsers = await prisma.user.findMany({
      where: {
        AND: [
          // 1. Must have the permission
          {
            OR: [
              {
                role: {
                  permissions: {
                    some: {
                      permission: {
                        code: permissionCode,
                      },
                    },
                  },
                },
              },
              {
                groups: {
                  some: {
                    group: {
                      permissions: {
                        some: {
                          permission: {
                            code: permissionCode,
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          // 2. Must have the preference enabled (if category is provided)
          ...(category
            ? [
                {
                  OR: [
                    { notificationPreference: preferenceCondition }, // Preference is explicitly true
                    { notificationPreference: null }, // Or no preference set (default to true usually, but here we assume created)
                    // Wait, if no preference record exists, what does schema say?
                    // "notificationPreference NotificationPreference?"
                    // If it's null, we might want to default to TRUE?
                    // But if we query { notificationPreference: preferenceCondition }, it won't match null.
                    // So we need to handle nulls.
                    // Actually, simpler is: fetch users, loop send(), and let send() check preferences.
                    // send() logic: "if (prefs) { check }" -> "if no prefs, allow".
                    // So we just need to find users with PERMISSION here.
                  ],
                },
              ]
            : []),
        ],
      },
      select: { id: true },
    });

    // We can just rely on send() to filter preferences if we don't filter in SQL.
    // However, filtering in SQL is better for performance.
    // But dealing with NULL relation in Prisma where clause is tricky if we want default=true.
    // Let's rely on send() for granular filtering to keep this query simpler and robust against missing preference records.
    // We already passed `category` to send() via spread `...payload` if it was in payload, but we accepted it as arg.
    // Let's make sure it's in the payload passed to send().

    const finalPayload = { ...payload, category };

    const notifications = await Promise.all(
      eligibleUsers.map((user: any) =>
        this.send({ ...finalPayload, userId: user.id })
      )
    );

    return notifications;
  },
};
