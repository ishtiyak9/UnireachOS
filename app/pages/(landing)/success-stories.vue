<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: false,
});

const activeFilter = ref<string>("all");
const selectedStory = ref<any>(null);
const lightboxOpen = ref(false);

const { data: dbStories, pending } = useFetch("/api/success-stories", {
  lazy: true,
  server: true,
});

const defaultStories = [
  {
    id: "seed-1",
    type: "image",
    category: "student",
    name: "Sarah Ahmed",
    destination: "Canada",
    university: "University of Toronto",
    year: "2025",
    thumbnail:
      "https://images.unsplash.com/photo-1523240715639-963c6a0279ee?auto=format&fit=crop&q=80&w=400",
    image:
      "https://images.unsplash.com/photo-1523240715639-963c6a0279ee?auto=format&fit=crop&q=80&w=1200",
    quote: "Exceptional guidance throughout my Canadian study permit process.",
    isFeatured: true,
  },
  {
    id: "seed-2",
    type: "video",
    category: "business",
    name: "Mohammad Rahman",
    destination: "Australia",
    visaType: "Business Alpha",
    year: "2024",
    thumbnail:
      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=400",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quote: "Seamless transition to Australian business landscape.",
    isFeatured: false,
  },
  {
    id: "seed-3",
    type: "image",
    category: "student",
    name: "Fatima Khan",
    destination: "UK",
    university: "Oxford University",
    year: "2025",
    thumbnail:
      "https://images.unsplash.com/photo-1525921429624-479b6a29d84c?auto=format&fit=crop&q=80&w=400",
    image:
      "https://images.unsplash.com/photo-1525921429624-479b6a29d84c?auto=format&fit=crop&q=80&w=1200",
    quote: "Flawless execution of my Oxford admission mission.",
    isFeatured: false,
  },
];

const successStories = computed(() => {
  if (dbStories.value && dbStories.value.length > 0) return dbStories.value;
  return defaultStories;
});

const filters = [
  { label: "All Records", value: "all" },
  { label: "Students", value: "student" },
  { label: "Business", value: "business" },
  { label: "Migration", value: "job" },
];

const filteredStories = computed(() => {
  if (activeFilter.value === "all") return successStories.value;
  return successStories.value.filter(
    (story: any) => story.category === activeFilter.value
  );
});

const openLightbox = (story: any) => {
  selectedStory.value = story;
  lightboxOpen.value = true;
};
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Minimalist Slick Header -->
    <section
      class="pt-32 pb-16 bg-surface-950 font-outfit border-b border-white/5"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div class="space-y-4">
            <div
              class="flex items-center gap-2 text-primary-500 font-bold text-[10px] uppercase tracking-[0.4em]"
            >
              <span class="w-8 h-[1px] bg-primary-500"></span>
              Victory Archive
            </div>
            <h1
              class="text-5xl md:text-6xl font-black text-white tracking-tighter"
            >
              SUCCESS <span class="text-surface-600 italic">LOGS.</span>
            </h1>
            <p
              class="text-surface-400 text-sm max-w-md font-medium leading-relaxed"
            >
              A curated directory of global transitions successfully managed by
              Unireach. Minimal friction, maximal results.
            </p>
          </div>

          <!-- Slick Compact Filters -->
          <div
            class="flex bg-surface-900/50 p-1.5 rounded-xl border border-white/5 backdrop-blur-xl"
          >
            <button
              v-for="f in filters"
              :key="f.value"
              @click="activeFilter = f.value"
              :class="[
                'px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300',
                activeFilter === f.value
                  ? 'bg-white text-black shadow-lg'
                  : 'text-surface-500 hover:text-white',
              ]"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- High-Density Slick Grid -->
    <section class="py-20 bg-surface-950 min-h-[600px]">
      <div class="max-w-7xl mx-auto px-6">
        <div
          v-if="pending"
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <div
            v-for="i in 10"
            :key="i"
            class="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse"
          />
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="story in filteredStories"
            :key="story.id"
            @click="openLightbox(story)"
            class="group relative aspect-[3/4] cursor-pointer"
          >
            <!-- Card -->
            <div
              class="absolute inset-0 rounded-2xl overflow-hidden border border-white/5 bg-surface-900 transition-all duration-500 group-hover:border-primary-500/50 group-hover:shadow-[0_0_40px_rgba(var(--p-primary-500-rgb),0.2)]"
            >
              <img
                :src="story.thumbnail"
                class="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"
              />

              <!-- Content Overlay -->
              <div class="absolute inset-0 p-6 flex flex-col justify-end">
                <div
                  class="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                >
                  <div
                    class="text-[9px] font-black text-primary-500 uppercase tracking-widest"
                  >
                    {{ story.destination }}
                  </div>
                  <h3
                    class="text-xl font-black text-white tracking-tighter italic"
                  >
                    {{ story.name }}
                  </h3>
                  <div
                    class="text-[9px] text-surface-400 font-bold uppercase tracking-wider pb-2"
                  >
                    {{ story.university || story.visaType }} • {{ story.year }}
                  </div>
                  <p
                    class="text-[11px] text-surface-300 font-medium italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2"
                  >
                    "{{ story.quote }}"
                  </p>
                </div>
              </div>

              <!-- Media Indicator -->
              <div
                class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center"
                >
                  <i
                    :class="[
                      story.type === 'video' ? 'pi pi-play' : 'pi pi-plus',
                      'text-primary-500 text-[10px]',
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredStories.length === 0" class="py-32 text-center">
          <p
            class="text-surface-600 font-black uppercase tracking-[0.3em] text-[10px]"
          >
            Registry Empty for this Sector
          </p>
        </div>
      </div>
    </section>

    <!-- Slick CTA -->
    <section class="py-32 bg-surface-950 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2
          class="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8"
        >
          INITIATE YOUR <span class="text-primary-500 italic">VICTORY.</span>
        </h2>
        <NuxtLink
          to="/apply"
          class="inline-flex h-14 items-center px-12 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-primary-500 transition-colors"
        >
          Start Mission
        </NuxtLink>
      </div>
    </section>

    <!-- Minimal Lightbox -->
    <Transition name="slick-fade">
      <div
        v-if="lightboxOpen && selectedStory"
        class="fixed inset-0 z-50 bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
        @click="lightboxOpen = false"
      >
        <div
          class="relative max-w-4xl w-full bg-surface-900/40 rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row aspect-video"
          @click.stop
        >
          <div class="flex-1 bg-black">
            <img
              v-if="selectedStory.type === 'image'"
              :src="selectedStory.image"
              class="w-full h-full object-contain"
            />
            <iframe
              v-else
              :src="selectedStory.videoUrl"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
          <div
            class="w-full md:w-80 p-10 flex flex-col justify-between bg-surface-900 border-l border-white/5"
          >
            <div class="space-y-6">
              <div class="space-y-1">
                <div
                  class="text-[9px] font-black text-primary-500 uppercase tracking-widest"
                >
                  {{ selectedStory.destination }}
                </div>
                <h2
                  class="text-3xl font-black text-white italic tracking-tighter leading-none"
                >
                  {{ selectedStory.name }}
                </h2>
              </div>
              <div class="space-y-4">
                <div
                  class="text-xs text-white border-l-2 border-primary-500 pl-4 py-1"
                >
                  <div
                    class="text-surface-500 font-bold uppercase text-[8px] tracking-widest mb-1"
                  >
                    Target
                  </div>
                  {{ selectedStory.university || selectedStory.visaType }}
                </div>
                <p class="text-sm text-surface-400 font-medium italic">
                  "{{ selectedStory.quote }}"
                </p>
              </div>
            </div>
            <button
              @click="lightboxOpen = false"
              class="w-full py-4 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white border border-white/10 rounded-xl transition-all"
            >
              Close Record
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </NuxtLayout>
</template>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
.slick-fade-enter-active,
.slick-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slick-fade-enter-from,
.slick-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
