export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetch, loggedIn } = useUserSession();

  // 1. If at login page and already logged in, redirect to respective portals
  if (to.path === "/login") {
    if (loggedIn.value && user.value) {
      const category = user.value.roleCategory;
      if (category === "SYSTEM") return navigateTo("/dashboard");
      if (category === "AGENT") return navigateTo("/agent/dashboard");
      if (category === "APPLICANT") return navigateTo("/applicant-portal");
      return navigateTo("/");
    }
    return;
  }

  // 2. Protect all internal routes
  const protectedRoutes = [
    "/dashboard",
    "/applicant-portal",
    "/agent",
    "/profile",
  ];
  const isProtected = protectedRoutes.some((route) =>
    to.path.startsWith(route)
  );

  if (isProtected) {
    if (!loggedIn.value) {
      await fetch();
      if (!loggedIn.value) {
        return navigateTo("/login");
      }
    }

    // 3. Portal Isolation Enforcement
    const category = user.value?.roleCategory;

    // System Dashboard Protection
    if (to.path.startsWith("/dashboard") && category !== "SYSTEM") {
      return navigateTo("/");
    }

    // Applicant Portal Protection
    if (
      to.path.startsWith("/applicant-portal") &&
      category !== "APPLICANT" &&
      category !== "SYSTEM"
    ) {
      return navigateTo("/");
    }

    // Agent Portal Protection
    if (
      to.path.startsWith("/agent") &&
      category !== "AGENT" &&
      category !== "SYSTEM"
    ) {
      return navigateTo("/");
    }
  }
});
