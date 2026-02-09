<template>
  <NuxtLink
    to="/"
    class="flex items-center gap-3 group transition-all duration-300"
  >
    <!-- Premium Logo Icon -->
    <!-- Icon Container -->
    <div
      class="relative flex items-center justify-center w-12 h-12 group-hover:scale-105 transition-all duration-300"
    >
      <!-- Monolithic Icon -->
      <img
        src="/icon.png"
        alt="Unireach Logo"
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Logo Text with Perfect Alignment -->
    <div class="flex flex-col">
      <!-- Main Brand Name -->
      <span
        class="text-lg font-black text-[#9651fe] dark:text-[#9651fe] tracking-tight leading-none uppercase"
      >
        UNIREACH
      </span>

      <!-- Tagline - Perfectly Aligned -->
      <span
        class="text-[0.35rem] font-bold text-primary-500 dark:text-primary-400 uppercase tracking-[0.02em] leading-none mt-1 opacity-80 whitespace-nowrap"
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
