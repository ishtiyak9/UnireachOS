export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, fetch } = useUserSession();

  // Fetch session if not already loaded
  if (!user.value) {
    await fetch();
  }

  // If no user session, redirect to login
  if (!user.value) {
    return navigateTo("/login");
  }

  // Check if user has high-authority clearance for dashboard routes
  if (
    to.path.startsWith("/dashboard") &&
    user.value.roleCategory !== "SYSTEM"
  ) {
    return navigateTo("/");
  }
});
