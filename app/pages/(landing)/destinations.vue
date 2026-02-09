<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: false,
});

const currentFilter = ref("All Regions");

const filters = [
  "All Regions",
  "Zero Tuition",
  "High Success",
  "Scandinavia",
  "Central Europe",
  "Southern Europe",
];

const allDestinations = [
  {
    country: "Australia",
    flag: "🇦🇺",
    tag: "Group of 8",
    category: "High Success",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    tag: "Zero Tuition",
    category: "Zero Tuition",
    image:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "France",
    flag: "🇫🇷",
    tag: "Elite Publique",
    category: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    tag: "Tech Focus",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    tag: "Scholarships",
    category: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Sweden",
    flag: "🇸🇪",
    tag: "Innovation",
    category: "Scandinavia",
    image:
      "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Denmark",
    flag: "🇩🇰",
    tag: "Sustainable",
    category: "Scandinavia",
    image:
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Norway",
    flag: "🇳🇴",
    tag: "Research",
    category: "Scandinavia",
    image:
      "https://images.unsplash.com/photo-1490718720475-399e223b113a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Finland",
    flag: "🇫🇮",
    tag: "Edu-Standard",
    category: "Scandinavia",
    image:
      "https://images.unsplash.com/photo-1527447816320-c08d9894e6da?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Austria",
    flag: "🇦🇹",
    tag: "Heritage",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Belgium",
    flag: "🇧🇪",
    tag: "Diplomacy",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1559113513-d5e09c88b9dd?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    tag: "Vibrant",
    category: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Portugal",
    flag: "🇵🇹",
    tag: "Lifestyle",
    category: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Switzerland",
    flag: "🇨🇭",
    tag: "Elite Tech",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Poland",
    flag: "🇵🇱",
    tag: "Growth Hub",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1607427299692-427749469141?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Hungary",
    flag: "🇭🇺",
    tag: "Low Cost",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Czech Republic",
    flag: "🇨🇿",
    tag: "Success-Rate",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1519677100203-ad03822efadd?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Estonia",
    flag: "🇪🇪",
    tag: "Digital Hub",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1594916885367-71708892d592?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Latvia",
    flag: "🇱🇻",
    tag: "Strategic",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1563829035-649033324d29?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Lithuania",
    flag: "🇱🇹",
    tag: "Academic",
    category: "Central Europe",
    image:
      "https://images.unsplash.com/photo-1533256671071-f92523295914?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Greece",
    flag: "🇬🇷",
    tag: "Affordable",
    category: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Malta",
    flag: "🇲🇹",
    tag: "English Prep",
    category: "Southern Europe",
    image:
      "https://images.unsplash.com/photo-1528657672283-75c3fd5a782a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    country: "Iceland",
    flag: "🇮🇸",
    tag: "Research",
    category: "Scandinavia",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=1200",
  },
];

const filteredDestinations = computed(() => {
  if (currentFilter.value === "All Regions") return allDestinations;
  return allDestinations.filter(
    (dest) => dest.category === currentFilter.value
  );
});
</script>

<template>
  <NuxtLayout name="landing">
    <section
      class="pt-10 md:pt-10 pb-16 md:pb-24 bg-white dark:bg-surface-950 overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <!-- Explorer Header -->
        <div class="max-w-3xl mb-12 md:mb-16 space-y-4 md:space-y-6">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 border border-primary-500/10"
          >
            <span
              class="text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400"
              >Global Coverage</span
            >
          </div>
          <h1
            class="text-3xl sm:text-5xl md:text-6xl font-black text-surface-900 dark:text-surface-0 tracking-tight leading-[1.05]"
          >
            Mapped for Success: <br />
            <NuxtLink
              to="/destinations"
              class="italic font-light text-primary-600 dark:text-primary-400"
              >All 23 Destinations.</NuxtLink
            >
          </h1>
          <p
            class="text-sm md:text-lg text-surface-500 dark:text-surface-400 font-medium leading-relaxed"
          >
            From the tech hubs of Scandinavia to the historic universities of
            Southern Europe. Unireach provides verified, surgical guidance for
            every Schengen border.
          </p>
        </div>

        <!-- Filter Bar -->
        <div
          class="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-12 animate-fade-in"
        >
          <BaseButton
            v-for="tag in filters"
            :key="tag"
            :label="tag"
            severity="secondary"
            :variant="currentFilter === tag ? 'solid' : 'outlined'"
            class="rounded-full! text-[8px] md:text-[9px] uppercase font-black tracking-widest px-4 md:px-6 h-8 md:h-10 transition-all duration-300"
            :class="{
              'border-primary-500! text-white! bg-primary-500!':
                currentFilter === tag,
              'border-surface-200 dark:border-surface-800 text-surface-500 hover:border-primary-500/50':
                currentFilter !== tag,
            }"
            @click="currentFilter = tag"
          />
        </div>

        <!-- All Destinations Grid (Higher Density) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="dest in filteredDestinations"
            :key="dest.country"
            class="group relative h-40 md:h-48 rounded-2xl overflow-hidden cursor-pointer"
          >
            <img
              :src="dest.image"
              :alt="dest.country"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-linear-to-t from-surface-950 via-surface-950/20 to-transparent opacity-80"
            ></div>

            <div
              class="absolute bottom-4 left-5 right-5 flex justify-between items-end"
            >
              <div class="space-y-1">
                <p
                  class="text-[9px] md:text-[10px] font-black italic text-primary-400 uppercase tracking-widest leading-none"
                >
                  {{ dest.tag }}
                </p>
                <h3
                  class="text-base md:text-lg font-black text-white italic tracking-tighter"
                >
                  {{ dest.country }}
                </h3>
              </div>
              <span
                class="text-lg md:text-xl opacity-80 group-hover:opacity-100 transition-opacity"
                >{{ dest.flag }}</span
              >
            </div>
          </div>
        </div>

        <!-- Bottom Narrative -->
        <div
          class="mt-16 md:mt-20 p-8 md:p-12 rounded-4xl bg-surface-50 dark:bg-surface-900/50 border border-surface-100 dark:border-surface-800 text-center space-y-4 md:space-y-6"
        >
          <h2
            class="text-xl md:text-2xl font-black text-surface-900 dark:text-surface-0 italic tracking-tight"
          >
            Don't see your desired country?
          </h2>
          <p
            class="max-w-xl mx-auto text-xs md:text-sm text-surface-500 font-medium"
          >
            Our network is expanding. We currently focus on these 23
            high-success regions to ensure every Unireach applicant secure a
            verified visa and sustainable future.
          </p>
          <BaseButton
            label="Request Custom Guidance"
            severity="primary"
            class="w-full sm:w-auto rounded-xl! font-black uppercase tracking-widest text-[10px] px-8 h-12"
          />
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
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
