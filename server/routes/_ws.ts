/**
 * Realtime WebSocket Handler (Nitro Cross-WS)
 * Path: /_ws
 */
export default defineWebSocketHandler({
  open(peer) {
    console.log(`[WS] Connection opened: ${peer.id}`);
  },

  async message(peer, message) {
    const data = JSON.parse(message.toString());

    // Join Room (Private Channel for User)
    // Client sends: { type: 'join', userId: '...' }
    if (data.type === "join" && data.userId) {
      peer.subscribe(`user:${data.userId}`);
      console.log(`[WS] Peer ${peer.id} joined room: user:${data.userId}`);
      peer.send(
        JSON.stringify({ type: "joined", room: `user:${data.userId}` })
      );
    }
  },

  close(peer) {
    console.log(`[WS] Connection closed: ${peer.id}`);
  },

  error(peer, error) {
    console.error(`[WS] Error on peer ${peer.id}:`, error);
  },
});

// Register global hook for broadcasting from API routes
const nitroApp = useNitroApp();
nitroApp.hooks.hook("ws:broadcast", (room: string, message: any) => {
  nitroApp.publish(room, JSON.stringify(message));
});
