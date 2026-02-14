export default defineEventHandler(async (event) => {
  const path = event.path;

  // 1. Define Protected API Segments
  const isDashboardApi =
    path.startsWith("/api/dashboard") || path.startsWith("/api/admin");
  const isPartnerApi =
    path.startsWith("/api/partners") || path.startsWith("/api/agent");
  const isApplicantApi =
    path.startsWith("/api/applicant") &&
    !path.startsWith("/api/applicant/auth"); // Allow auth endpoints

  if (!isDashboardApi && !isPartnerApi && !isApplicantApi) {
    return;
  }

  // 2. Validate Session Identity
  const session = await getUserSession(event);
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Session Synchronized Interrupted",
      message:
        "The institutional node requires a valid session signature for this operation.",
    });
  }

  const category = (session.user as any).roleCategory;

  // 3. Strategic Access Control (Server-Side Enforcement)

  // Dashboard/Admin Enforcement: STAFF/SYSTEM Only
  if (isDashboardApi) {
    if (category !== "SYSTEM" && category !== "STAFF") {
      throw createError({
        statusCode: 403,
        statusMessage: "Access Forbidden",
        message:
          "Your current clearance level is insufficient for high-level administration.",
      });
    }
  }

  // Partner Enforcement: STAFF/SYSTEM/AGENT Only
  if (isPartnerApi) {
    if (category !== "AGENT" && category !== "SYSTEM" && category !== "STAFF") {
      throw createError({
        statusCode: 403,
        statusMessage: "Access Forbidden",
        message:
          "Agent or Administrative credentials required for this intelligence node.",
      });
    }
  }

  // Applicant Enforcement: Everyone authenticated is allowed to the segment;
  // Individual handlers MUST enforce isSelf, isAdmin, or isAssignedAgent
  if (isApplicantApi) {
    // No-op at segment level to allow cross-portal access (Admins/Agents viewing applicants)
    // Individual API handlers enforce ownership.
  }
});
