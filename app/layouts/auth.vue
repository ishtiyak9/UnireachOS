<template>
  <div
    class="min-h-screen bg-surface-950 flex flex-col items-center justify-center relative overflow-hidden"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"
      />
      <div
        class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-500/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"
      />
    </div>

    <!-- Back to Home Button -->
    <NuxtLink
      to="/"
      class="absolute top-6 left-6 z-50 flex items-center gap-2 text-surface-400 hover:text-white transition-colors group"
    >
      <div
        class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-300"
      >
        <i
          class="pi pi-arrow-left text-xs group-hover:text-black transition-colors"
        />
      </div>
      <span
        class="text-xs font-bold uppercase tracking-wider opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
        >Back to Home</span
      >
    </NuxtLink>

    <!-- Main Content -->
    <div class="relative z-10 w-full max-w-md px-4">
      <slot />
    </div>
  </div>
</template>
