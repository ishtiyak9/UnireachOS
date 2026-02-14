export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetch, loggedIn } = useUserSession();

  // 1. If at login page and already logged in, redirect to respective portals
  if (to.path === "/login") {
    if (loggedIn.value && user.value) {
      const category = user.value.roleCategory;
      if (category === "SYSTEM" || category === "STAFF")
        return navigateTo("/dashboard");
      if (category === "AGENT") return navigateTo("/partner-portal");
      if (category === "APPLICANT") return navigateTo("/applicant-portal");
      return navigateTo("/");
    }
    return;
  }

  // 2. Protect all internal routes (Expanded list for maximum security)
  const isProtectedRoute =
    to.path.startsWith("/dashboard") ||
    to.path.startsWith("/applicant-portal") ||
    to.path.startsWith("/partner-portal") ||
    to.path.startsWith("/profile");

  if (isProtectedRoute) {
    // ALWAYS force a refresh check on navigation to a protected route
    // This ensures if the session was killed on the server, the client knows immediately
    await fetch();

    if (!loggedIn.value || !user.value) {
      return navigateTo("/login");
    }

    // 3. Portal Isolation Enforcement (Strict Role Checks)
    const category = user.value?.roleCategory;

    // System Dashboard Protection: STAFF/SYSTEM Only
    if (to.path.startsWith("/dashboard")) {
      if (category !== "SYSTEM" && category !== "STAFF") {
        console.warn(
          "Unauthorized access attempt to Dashboard by:",
          user.value.id
        );
        return navigateTo("/login"); // Force login if attempting to jump roles
      }
    }

    // Applicant Portal Protection: APPLICANT/SYSTEM Only
    if (to.path.startsWith("/applicant-portal")) {
      if (category !== "APPLICANT" && category !== "SYSTEM") {
        console.warn(
          "Unauthorized access attempt to Applicant Portal by:",
          user.value.id
        );
        return navigateTo("/login");
      }
    }

    // Agent Portal Protection: AGENT/SYSTEM Only
    if (to.path.startsWith("/partner-portal")) {
      if (category !== "AGENT" && category !== "SYSTEM") {
        console.warn(
          "Unauthorized access attempt to Partner Portal by:",
          user.value.id
        );
        return navigateTo("/login");
      }
    }
  }
});
