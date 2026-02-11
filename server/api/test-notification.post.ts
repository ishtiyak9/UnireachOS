import { notify } from "../utils/notify";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  // Dispatch a high-fidelity luxury notification
  await notify.send({
    userId: session.user.id,
    title: "Intelligence Handshake Successful",
    message:
      "Your secure connection to the UniReach Intelligence Node is active. Academic synchronization is fully operational.",
    type: "SUCCESS",
    channel: "IN_APP",
  });

  return {
    success: true,
    message: "Test notification dispatched to your local instance.",
  };
});
