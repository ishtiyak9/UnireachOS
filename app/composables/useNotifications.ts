/**
 * Realtime Notification Composable
 * Handles WebSocket connection, automatic reconnection, and toast dispatch.
 */
export const useNotifications = () => {
  const { loggedIn, user } = useUserSession();
  const toast = useToast();

  const notifications = useState<any[]>("notifications_list", () => []);
  const nextCursor = useState<string | null>(
    "notifications_cursor",
    () => null
  );
  const loading = useState<boolean>("notifications_loading", () => false);
  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.isRead).length
  );

  const socket = useState<WebSocket | null>("notifications_socket", () => null);
  const reconnectAttempts = useState<number>(
    "notifications_reconnect_attempts",
    () => 0
  );
  const maxReconnectAttempts = 10;

  const fetchNotifications = async (isInitial = false) => {
    if (loading.value || (!isInitial && !nextCursor.value)) return;

    loading.value = true;
    try {
      const data: any = await $fetch("/api/notifications", {
        query: {
          cursor: isInitial ? undefined : nextCursor.value,
          limit: 20,
        },
      });

      if (isInitial) {
        notifications.value = data.notifications;
      } else {
        notifications.value.push(...data.notifications);
      }
      nextCursor.value = data.nextCursor;
    } catch (e) {
      console.error("[WS] Failed to fetch notifications:", e);
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await $fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      const index = notifications.value.findIndex((n) => n.id === id);
      if (index !== -1) notifications.value[index].isRead = true;
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await $fetch("/api/notifications/read-all", { method: "POST" });
      notifications.value.forEach((n) => (n.isRead = true));
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  const connect = () => {
    if (!process.client || !loggedIn.value || !user.value?.id) return;

    // Safety check for existing connection
    if (socket.value?.readyState === WebSocket.OPEN) return;

    // Initial fetch
    fetchNotifications(true);

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/_ws`;

    console.log(`[WS] Connecting to ${wsUrl}...`);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("[WS] Connected");
      reconnectAttempts.value = 0;

      // Join private user room
      ws.send(
        JSON.stringify({
          type: "join",
          userId: user.value?.id,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === "notification") {
          const { title, message, notificationType } = payload.data;

          // Add to local list immediately
          notifications.value.unshift({
            id: "temp-" + Date.now(),
            title,
            message,
            notificationType,
            isRead: false,
            createdAt: new Date().toISOString(),
          });

          // Dispatch Toast
          toast.add({
            severity: (notificationType?.toLowerCase() as any) || "info",
            summary: title,
            detail: message,
            life: 5000,
          });

          // Optional: Play sound or update a local store/ref
        }
      } catch (e) {
        console.error("[WS] Failed to parse message:", e);
      }
    };

    ws.onclose = () => {
      console.log("[WS] Disconnected");
      socket.value = null;

      // Automatic Reconnection with Exponential Backoff
      if (reconnectAttempts.value < maxReconnectAttempts) {
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttempts.value),
          30000
        );
        console.log(
          `[WS] Reconnecting in ${delay}ms... (Attempt ${
            reconnectAttempts.value + 1
          })`
        );

        setTimeout(() => {
          reconnectAttempts.value++;
          connect();
        }, delay);
      }
    };

    ws.onerror = (err) => {
      console.error("[WS] Socket Error:", err);
    };

    socket.value = ws;
  };

  // Watch for auth state changes
  watch(
    [loggedIn, user],
    () => {
      if (loggedIn.value && user.value) {
        connect();
      } else {
        socket.value?.close();
      }
    },
    { immediate: true }
  );

  return {
    socket,
    connect,
    notifications,
    unreadCount,
    loading,
    nextCursor,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
