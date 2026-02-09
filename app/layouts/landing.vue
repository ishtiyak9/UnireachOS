<template>
  <div
    class="landing-layout min-h-screen bg-surface-0 dark:bg-surface-950 selection:bg-primary-500/30 selection:text-primary-900 dark:selection:text-primary-100"
  >
    <!-- Skip to content for Accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-primary-600"
    >
      Skip to main content
    </a>

    <!-- Top Navigation Layer -->
    <div id="landing-nav-container" class="sticky top-0 z-50 w-full">
      <slot name="navbar">
        <LandingNavbar />
      </slot>
    </div>

    <!-- Main Content Area -->
    <main id="main-content" class="relative isolate">
      <!-- Ambient Background Elements (Subtle Enterprise Aesthetic) -->
      <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        />
        <div
          class="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
        />
      </div>

      <slot />
    </main>

    <!-- Footer Layer -->
    <slot name="footer">
      <LandingFooter />
    </slot>

    <!-- Global Layout Components -->
    <BaseToast />
    <FloatingWhatsApp />
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
// Landing Layout Logic
// We can add scroll behavior or dynamic header state here later
</script>

<style>
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Custom Scrollbar for Enterprise Look (Standard CSS used to avoid PostCSS @apply resolution issues) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--p-surface-50);
}

.dark ::-webkit-scrollbar-track {
  background: var(--p-surface-900);
}

::-webkit-scrollbar-thumb {
  background: var(--p-surface-300);
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background-color 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--p-surface-400);
}

.dark ::-webkit-scrollbar-thumb {
  background: var(--p-surface-700);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: var(--p-surface-600);
}

/* Remove default blue focus rings for a cleaner UI if using custom focus states */
:focus-visible {
  outline: 2px solid var(--p-primary-500);
  outline-offset: 2px;
}
</style>
