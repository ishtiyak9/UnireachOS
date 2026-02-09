<script setup lang="ts">
const destinations = [
  {
    country: "Australia",
    flag: "🇦🇺",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1200",
    tuition: "20k - 45k AUD / Year",
    success: "High (SVP Stream)",
    postStudy: "2 - 4 Years",
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    image:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1200",
    tuition: "0€ Nominal / Year",
    success: "Extremely High",
    postStudy: "18 Months",
  },
  {
    country: "France",
    flag: "🇫🇷",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200",
    tuition: "Affordable / Low",
    success: "Very Competitive",
    postStudy: "12-24 Months",
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=1200",
    tuition: "Mid-Range / Selective",
    success: "High (University Bound)",
    postStudy: "12 Months",
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200",
    tuition: "Income Based / 0-3k€",
    success: "Strong (Public Unis)",
    postStudy: "12 Months",
  },
  {
    country: "Greece",
    flag: "🇬🇷",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
    tuition: "Affordable / Low",
    success: "Rising Success",
    postStudy: "EU Residency Path",
  },
];
</script>

<template>
  <section
    class="py-12 md:py-16 lg:py-24 bg-surface-50 dark:bg-surface-950/50 overflow-hidden border-t border-surface-100 dark:border-surface-900"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <!-- Section Header -->
      <div
        class="flex flex-col lg:flex-row lg:items-end justify-between mb-8 md:mb-12 gap-6 animate-fade-in"
      >
        <div class="space-y-3">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 border border-primary-500/10"
          >
            <span
              class="text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 leading-none"
              >Global Reach</span
            >
          </div>
          <h2
            class="text-2xl sm:text-3xl md:text-4xl font-black text-surface-900 dark:text-surface-0 tracking-tight leading-[1.1]"
          >
            Best Study Abroad <br >
            <span
              class="italic font-light text-primary-600 dark:text-primary-400"
              >Destinations from Bangladesh.</span
            >
          </h2>
        </div>
        <p
          class="max-w-md text-[11px] sm:text-xs md:text-sm text-surface-500 dark:text-surface-400 font-medium leading-relaxed"
        >
          Surgically mapped pathways for Bangladeshi aspirants. We focus on high
          visa success rates and sustainable professional integration in Europe.
        </p>
      </div>

      <!-- High-Density Destination Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="dest in destinations"
          :key="dest.country"
          class="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(var(--p-primary-500-rgb),0.1)]"
        >
          <!-- Premium Cinematic Visual Header -->
          <div class="h-32 relative overflow-hidden">
            <!-- Unsplash Image with Overlay -->
            <img
              :src="dest.image"
              :alt="dest.country"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            >
            <div
              class="absolute inset-0 bg-linear-to-t from-surface-900 via-surface-900/40 to-transparent opacity-80"
            />
            <div
              class="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
            />

            <div class="absolute bottom-4 left-6 flex items-center gap-3">
              <span class="text-2xl drop-shadow-lg">{{ dest.flag }}</span>
              <h3
                class="text-lg font-black text-white italic tracking-tighter drop-shadow-md"
              >
                {{ dest.country }}
              </h3>
            </div>
          </div>

          <!-- Data Grid -->
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <p
                  class="text-[8px] font-black uppercase tracking-widest text-surface-400"
                >
                  Tuition Fees
                </p>
                <p
                  class="text-xs font-bold text-surface-900 dark:text-surface-0"
                >
                  {{ dest.tuition }}
                </p>
              </div>
              <div class="space-y-1">
                <p
                  class="text-[8px] font-black uppercase tracking-widest text-surface-400"
                >
                  Visa Success
                </p>
                <p
                  class="text-xs font-bold text-primary-600 dark:text-primary-400"
                >
                  {{ dest.success }}
                </p>
              </div>
            </div>

            <div
              class="pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between"
            >
              <div class="space-y-1">
                <p
                  class="text-[8px] font-black uppercase tracking-widest text-surface-400"
                >
                  Job Search Visa
                </p>
                <p class="text-[10px] font-black italic text-primary-600">
                  {{ dest.postStudy }}
                </p>
              </div>
              <BaseButton
                icon="pi pi-arrow-right"
                severity="secondary"
                variant="text"
                rounded
                class="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- View All CTA -->
      <div class="mt-20 relative flex justify-center animate-fade-in delay-500">
        <!-- Decorative Background Glow -->
        <div
          class="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-primary-500/10 dark:bg-primary-500/5 blur-3xl rounded-full pointer-events-none"
        />

        <NuxtLink
          to="/destinations"
          class="group relative inline-flex items-center gap-4 px-10 h-14 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-xl shadow-primary-500/5 hover:shadow-primary-500/10 hover:border-primary-500/30 transition-all duration-500 overflow-hidden"
        >
          <!-- Internal Hover Glow & Shimmer -->
          <div
            class="absolute inset-0 bg-linear-to-tr from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div
              class="absolute inset-0 bg-linear-to-r from-transparent via-primary-500/10 to-transparent w-full animate-shimmer"
            />
          </div>

          <span
            class="relative z-10 text-[11px] font-black uppercase tracking-[0.2em] text-surface-900 dark:text-surface-0 italic"
          >
            Explore All 23 Destinations
          </span>

          <div
            class="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-500/20 group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-500"
          >
            <i
              class="pi pi-arrow-right text-[10px] text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-500"
            />
          </div>
        </NuxtLink>
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
@keyframes shimmer {
  0% {
    transform: translateX(-150%) skewX(-15deg);
  }
  100% {
    transform: translateX(150%) skewX(-15deg);
  }
}
.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-shimmer {
  animation: shimmer 3s infinite;
}
</style>
