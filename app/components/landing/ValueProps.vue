<template>
  <section
    class="py-12 md:py-16 lg:py-24 bg-white dark:bg-surface-950 overflow-hidden relative"
  >
    <!-- Subtle Background Decor -->
    <div
      class="absolute inset-0 z-0 opacity-30 dark:opacity-20 pointer-events-none"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,var(--p-primary-500-rgb),transparent_50%)] opacity-5 blur-3xl"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <div class="text-center space-y-4 mb-10 md:mb-16 animate-fade-in">
        <h2
          class="text-primary-600 dark:text-primary-400 font-bold uppercase text-[8px] md:text-xs tracking-[0.3em]"
        >
          Institutional Trust
        </h2>
        <p
          class="text-2xl sm:text-3xl md:text-5xl font-black text-surface-900 dark:text-surface-0 tracking-tight leading-tight"
        >
          Fueling growth for 500+ <br class="hidden md:block" />
          <span class="italic font-light text-primary-600 dark:text-primary-400"
            >Education Giants.</span
          >
        </p>
      </div>

      <!-- Moving Logo Cloud (Simulated) -->
      <div
        class="flex flex-wrap justify-center items-center gap-6 md:gap-16 lg:gap-24 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700"
      >
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center gap-2 md:gap-3 group/logo cursor-default transform hover:scale-110 transition-transform duration-500"
        >
          <div
            class="p-2 sm:p-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 transition-all group-hover/logo:bg-primary-500/10 group-hover/logo:border-primary-500/20"
          >
            <Icon
              name="lucide:landmark"
              class="w-5 h-5 sm:w-8 sm:h-8 text-surface-400 group-hover/logo:text-primary-500"
            />
          </div>
          <span
            class="font-black text-sm sm:text-xl text-surface-800 dark:text-surface-200 tracking-tighter group-hover/logo:text-primary-600 italic"
          >
            PARTNER_{{ i }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Value Props Component Logic
</script>
