<template>
  <NuxtLink
    to="/"
    class="flex items-center gap-3 group transition-all duration-300"
  >
    <!-- Premium Logo Icon -->
    <div class="relative">
      <!-- Glow Effect -->
      <div
        class="absolute inset-0 bg-primary-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"
      ></div>

      <!-- Icon Container -->
      <div
        class="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-xl shadow-primary-500/30 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300"
      >
        <!-- Monolithic Icon: Three Paths to Success -->
        <svg
          class="w-7 h-7 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Left Path: Study Migration -->
          <path
            d="M3 20L3 16L6 16L6 12L9 12L9 8L12 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.7"
          />

          <!-- Center Path: Business Migration -->
          <path
            d="M12 20L12 14L12 8"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            opacity="0.85"
          />

          <!-- Right Path: Job Migration -->
          <path
            d="M21 20L21 16L18 16L18 12L15 12L15 8L12 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.7"
          />

          <!-- Unified Peak (All paths converge) -->
          <path
            d="M12 8L12 4"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.95"
          />

          <!-- Success Crown -->
          <circle cx="12" cy="3" r="2" fill="white" opacity="0.95" />

          <!-- Base Points (Three Starting Points) -->
          <circle cx="3" cy="20" r="1.2" fill="currentColor" opacity="0.6" />
          <circle cx="12" cy="20" r="1.2" fill="currentColor" opacity="0.6" />
          <circle cx="21" cy="20" r="1.2" fill="currentColor" opacity="0.6" />

          <!-- Connection Points at Convergence -->
          <circle cx="12" cy="8" r="1.5" fill="white" opacity="0.8" />
        </svg>

        <!-- Accent Dot -->
        <div
          class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-lg animate-pulse-slow"
        ></div>
      </div>
    </div>

    <!-- Logo Text with Perfect Alignment -->
    <div class="flex flex-col">
      <!-- Main Brand Name -->
      <span
        class="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-surface-900 via-surface-800 to-surface-900 dark:from-white dark:via-primary-100 dark:to-white tracking-tight leading-none uppercase"
      >
        UNIREACH
      </span>

      <!-- Tagline - Perfectly Aligned -->
      <span
        class="text-[0.35rem] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.02em] leading-none mt-1 opacity-80 whitespace-nowrap"
        style="letter-spacing: 0.05em"
      >
        Guidance, Strategy, Success
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
// Premium Unireach Logo Component
// Icon represents: Education (Graduation Cap) + Global Reach (Globe) + Success (Upward Arrow)
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.15);
  }
}
</style>
