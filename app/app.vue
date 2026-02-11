<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 font-sans">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BaseToast />
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup>
// Root app component
useHead({
  htmlAttrs: {
    class: "dark",
  },
});

// Initialize Realtime Notification Engine
if (process.client) {
  useNotifications();
}
</script>

<style>
/* Critical CSS to prevent FOUC/Skeleton flash during SSR/Hydration */
html,
body {
  background-color: var(--p-surface-50);
  color: var(--p-surface-900);
  margin: 0;
}

.dark html,
.dark body {
  background-color: var(--p-surface-950);
  color: var(--p-surface-0);
}

/* Ensure the root container is ready */
#main-content {
  opacity: 1;
  transition: opacity 0.3s ease;
}
</style>
