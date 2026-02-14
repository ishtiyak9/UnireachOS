export default defineNuxtPlugin((nuxtApp) => {
  const { clear } = useUserSession();

  // Intercept Vue Errors (including those from useFetch/useAsyncData)
  nuxtApp.vueApp.config.errorHandler = (error: any, instance, info) => {
    if (
      error.statusCode === 401 ||
      error.status === 401 ||
      error.data?.statusCode === 401
    ) {
      console.error(
        "Institutional Session Broken. Emergency Rerouting Initiated."
      );
      clear().then(() => navigateTo("/login"));
    } else {
      // Fallback to default error handling
      console.error("Unhandleable Tactical Error:", error);
    }
  };

  // Also handle global fetch errors if they escape the Vue handler
  nuxtApp.hooks.hook("app:error", async (error) => {
    if ((error as any).statusCode === 401) {
      await clear();
      return navigateTo("/login");
    }
  });
});
