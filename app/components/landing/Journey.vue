<script setup lang="ts">
const services = [
  {
    title: "Admission Support",
    icon: "lucide:school",
    description:
      "Verified expert guidance for complex university applications and direct matching.",
  },
  {
    title: "Health Insurance",
    icon: "lucide:heart-pulse",
    description:
      "Schengen-compliant health coverages tailored for visas and student safety.",
  },
  {
    title: "Scholarship Guidance",
    icon: "lucide:graduation-cap",
    description:
      "Unlock institutional and governmental funding with real-time matching.",
  },
  {
    title: "Student Accommodation",
    icon: "lucide:home",
    description:
      "Secure safe, vetted living spaces near your campus before you land.",
  },
  {
    title: "Visa Services",
    icon: "lucide:file-check",
    description:
      "End-to-end documentation and interview prep for high-success processing.",
  },
  {
    title: "Migration & Careers",
    icon: "lucide:briefcase",
    description:
      "Seamless pathways to entrepreneurship or professional job placements.",
  },
];
</script>

<template>
  <section
    class="py-12 md:py-16 lg:py-24 bg-white dark:bg-surface-950 overflow-hidden border-t border-surface-100 dark:border-surface-900"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <!-- Section Header: Compact & Premium -->
      <div
        class="flex flex-col lg:flex-row lg:items-end justify-between mb-8 md:mb-12 gap-6 animate-fade-in"
      >
        <div class="space-y-3">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 border border-primary-500/10"
          >
            <span
              class="text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 leading-none"
              >The Support Ecosystem</span
            >
          </div>
          <h2
            class="text-2xl sm:text-3xl md:text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tight leading-[1.1]"
          >
            Simplifying Your <br />
            <span
              class="italic font-light text-primary-600 dark:text-primary-400"
              >Study Abroad Journey.</span
            >
          </h2>
        </div>
        <p
          class="max-w-md text-[11px] sm:text-xs md:text-sm text-surface-500 dark:text-surface-400 font-medium leading-relaxed"
        >
          A surgical platform designed to remove friction from global migration.
          From matching to integration, we guide every step.
        </p>
      </div>

      <!-- High-Density Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="service in services"
          :key="service.title"
          class="group relative p-6 rounded-2xl bg-surface-50 dark:bg-surface-900/40 border border-surface-100 dark:border-surface-800/50 transition-all duration-500 hover:scale-[1.01] hover:bg-white dark:hover:bg-surface-900 hover:shadow-[0_20px_40px_-15px_rgba(var(--p-primary-500-rgb),0.1)]"
        >
          <!-- Premium Inner Glow -->
          <div
            class="absolute inset-0 bg-linear-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          ></div>

          <div class="relative z-10 flex gap-5 items-start">
            <div
              class="shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-surface-800 flex items-center justify-center shadow-xs border border-surface-100 dark:border-surface-700 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:shadow-lg group-hover:shadow-primary-600/20 transition-all duration-500"
            >
              <Icon
                :name="service.icon"
                class="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-500"
              />
            </div>

            <div class="space-y-1.5 flex-1 pt-1">
              <h3
                class="text-sm font-black text-surface-900 dark:text-surface-0 tracking-tight flex items-center justify-between group/h"
              >
                {{ service.title }}
                <Icon
                  name="lucide:arrow-up-right"
                  class="w-3 h-3 text-surface-300 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100"
                />
              </h3>
              <p
                class="text-[11px] text-surface-500 dark:text-surface-400 font-medium leading-normal"
              >
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
