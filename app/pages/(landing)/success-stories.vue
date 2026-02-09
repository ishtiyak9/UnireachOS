<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const activeFilter = ref<string>("all");

const successStories = ref([
  {
    id: 1,
    type: "image",
    category: "student",
    name: "Sarah Ahmed",
    destination: "Canada",
    university: "University of Toronto",
    program: "Computer Science",
    year: "2025",
    thumbnail:
      "https://via.placeholder.com/800x600/1a1a1a/d4af37?text=Student+Success",
    image:
      "https://via.placeholder.com/1200x900/1a1a1a/d4af37?text=Student+Success",
    quote:
      "UniReach made my dream of studying in Canada a reality. Their guidance was exceptional.",
  },
  {
    id: 2,
    type: "video",
    category: "business",
    name: "Mohammad Rahman",
    destination: "Australia",
    visaType: "Business Visa",
    year: "2024",
    thumbnail:
      "https://via.placeholder.com/800x600/1a1a1a/d4af37?text=Business+Immigration",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quote:
      "The business immigration process was seamless thanks to UniReach's expertise.",
  },
  {
    id: 3,
    type: "image",
    category: "student",
    name: "Fatima Khan",
    destination: "UK",
    university: "Oxford University",
    program: "Medicine",
    year: "2025",
    thumbnail:
      "https://via.placeholder.com/800x600/1a1a1a/d4af37?text=UK+Student+Visa",
    image:
      "https://via.placeholder.com/1200x900/1a1a1a/d4af37?text=UK+Student+Visa",
    quote:
      "From application to visa approval, UniReach was with me every step of the way.",
  },
  {
    id: 4,
    type: "video",
    category: "job",
    name: "Ahmed Hassan",
    destination: "USA",
    visaType: "H1B Visa",
    year: "2024",
    thumbnail:
      "https://via.placeholder.com/800x600/1a1a1a/d4af37?text=H1B+Success",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quote:
      "Secured my dream job in Silicon Valley with UniReach's immigration support.",
  },
  {
    id: 5,
    type: "image",
    category: "student",
    name: "Nusrat Jahan",
    destination: "Germany",
    university: "TU Munich",
    program: "Engineering",
    year: "2025",
    thumbnail:
      "https://via.placeholder.com/800x600/1a1a1a/d4af37?text=Germany+Student",
    image:
      "https://via.placeholder.com/1200x900/1a1a1a/d4af37?text=Germany+Student",
    quote:
      "Studying in Germany was a dream come true, thanks to UniReach's meticulous planning.",
  },
  {
    id: 6,
    type: "image",
    category: "business",
    name: "Karim Abdullah",
    destination: "Canada",
    visaType: "Investor Visa",
    year: "2024",
    thumbnail:
      "https://via.placeholder.com/800x600/1a1a1a/d4af37?text=Investor+Visa",
    image:
      "https://via.placeholder.com/1200x900/1a1a1a/d4af37?text=Investor+Visa",
    quote:
      "Expanded my business to Canada with UniReach's professional immigration services.",
  },
]);

const filters = ref([
  { label: "All Stories", value: "all", icon: "pi pi-th-large" },
  { label: "Students", value: "student", icon: "pi pi-graduation-cap" },
  { label: "Business", value: "business", icon: "pi pi-briefcase" },
  { label: "Job Seekers", value: "job", icon: "pi pi-user" },
]);

const filteredStories = computed(() => {
  if (activeFilter.value === "all") {
    return successStories.value;
  }
  return successStories.value.filter(
    (story) => story.category === activeFilter.value
  );
});

const selectedStory = ref<any>(null);
const lightboxOpen = ref(false);

const openLightbox = (story: any) => {
  selectedStory.value = story;
  lightboxOpen.value = true;
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  selectedStory.value = null;
};

const stats = ref([
  { label: "Success Stories", value: "3,500+" },
  { label: "Countries", value: "22+" },
  { label: "Success Rate", value: "83%" },
  { label: "Happy Clients", value: "5,000+" },
]);
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Unique Premium Hero -->
    <section
      class="relative pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-surface-950"
    >
      <!-- Advanced Background -->
      <div class="absolute inset-0 z-0">
        <!-- Gradient Mesh -->
        <div class="absolute inset-0 opacity-30">
          <div
            class="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[150px] animate-pulse"
          />
          <div
            class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[180px]"
          />
          <div
            class="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-primary-400/15 rounded-full blur-[120px]"
          />
        </div>
        <!-- Animated Grid -->
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px)] bg-size-[80px_80px] opacity-20"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Content -->
          <div class="space-y-6">
            <!-- Animated Counter Badge -->
            <div
              class="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 backdrop-blur-xl"
            >
              <div class="relative">
                <div
                  class="absolute inset-0 bg-primary-500 rounded-full blur-md opacity-50"
                />
                <div
                  class="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center"
                >
                  <i class="pi pi-check text-white text-sm font-black"/>
                </div>
              </div>
              <div class="flex flex-col">
                <span
                  class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 italic leading-none"
                  >3,500+</span
                >
                <span
                  class="text-[8px] font-black uppercase tracking-[0.3em] text-primary-400"
                  >Success Stories</span
                >
              </div>
            </div>

            <!-- Headline -->
            <div class="space-y-4">
              <h1
                class="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]"
              >
                <span class="block text-white">Where</span>
                <span class="block text-white">Dreams Meet</span>
                <span
                  class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic mt-2"
                  >Destinations.</span
                >
              </h1>
              <div
                class="w-20 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              />
            </div>

            <!-- Description -->
            <p
              class="text-base md:text-lg text-surface-300 leading-relaxed max-w-xl"
            >
              Every visa is a victory. Every approval, a dream realized. Explore
              real stories from real people who trusted UniReach to navigate
              their journey to success.
            </p>

            <!-- Quick Stats -->
            <div class="flex flex-wrap gap-6 pt-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
                >
                  <i class="pi pi-globe text-primary-500 text-lg"/>
                </div>
                <div>
                  <div class="text-xl font-black text-white">22+</div>
                  <div
                    class="text-xs text-surface-500 font-bold uppercase tracking-wider"
                  >
                    Countries
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
                >
                  <i class="pi pi-chart-line text-primary-500 text-lg"/>
                </div>
                <div>
                  <div class="text-xl font-black text-white">83%</div>
                  <div
                    class="text-xs text-surface-500 font-bold uppercase tracking-wider"
                  >
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Featured Story Preview -->
          <div class="relative hidden lg:block">
            <!-- Floating Elements -->
            <div
              class="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-primary-500/10 border border-primary-500/20 backdrop-blur-xl rotate-12 animate-float"
            />
            <div
              class="absolute -bottom-6 -left-6 w-20 h-20 rounded-xl bg-primary-600/10 border border-primary-600/20 backdrop-blur-xl -rotate-12 animate-float delay-150"
            />

            <!-- Main Featured Card -->
            <div class="relative">
              <!-- Animated Gradient Border -->
              <div
                class="absolute -inset-1 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-3xl blur-lg opacity-50 animate-pulse"
              />

              <!-- Card Content -->
              <div
                class="relative rounded-3xl bg-surface-900/90 border border-white/10 backdrop-blur-2xl overflow-hidden"
              >
                <!-- Image -->
                <div class="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://via.placeholder.com/800x600/1a1a1a/d4af37?text=Featured+Success+Story"
                    alt="Featured Success Story"
                    class="w-full h-full object-cover"
                  >
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/50 to-transparent"
                  />

                  <!-- Play Button -->
                  <div
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      class="w-20 h-20 rounded-full bg-primary-500/20 backdrop-blur-xl border-2 border-primary-500 flex items-center justify-center animate-pulse"
                    >
                      <i class="pi pi-play text-primary-500 text-2xl ml-1"/>
                    </div>
                  </div>

                  <!-- Badge -->
                  <div class="absolute top-4 left-4">
                    <div
                      class="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10"
                    >
                      <span
                        class="text-xs font-black text-white uppercase tracking-wider"
                        >Featured Story</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Info -->
                <div class="p-6 space-y-3">
                  <div>
                    <h3 class="text-xl font-black text-white mb-1">
                      Sarah Ahmed
                    </h3>
                    <div
                      class="flex items-center gap-2 text-sm text-surface-400"
                    >
                      <i class="pi pi-map-marker text-primary-500"/>
                      <span class="font-bold"
                        >University of Toronto, Canada</span
                      >
                    </div>
                  </div>
                  <p class="text-sm text-surface-400 italic">
                    "UniReach made my dream of studying in Canada a reality..."
                  </p>
                </div>
              </div>
            </div>

            <!-- Floating Testimonial Cards -->
            <div
              class="absolute -left-12 top-1/4 w-48 p-4 rounded-2xl bg-surface-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl animate-float delay-75"
            >
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center"
                >
                  <i class="pi pi-star-fill text-primary-500 text-xs"/>
                </div>
                <div>
                  <div class="text-xs font-black text-white">5.0 Rating</div>
                  <div
                    class="text-[8px] text-surface-500 uppercase tracking-wider"
                  >
                    Client Reviews
                  </div>
                </div>
              </div>
            </div>

            <div
              class="absolute -right-8 bottom-1/4 w-44 p-4 rounded-2xl bg-surface-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl animate-float delay-100"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center"
                >
                  <i class="pi pi-check-circle text-primary-500 text-xs"/>
                </div>
                <div>
                  <div class="text-xs font-black text-white">100% Verified</div>
                  <div
                    class="text-[8px] text-surface-500 uppercase tracking-wider"
                  >
                    Real Stories
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section
      class="py-10 bg-surface-950 border-y border-white/5 relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5"
      />
      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="group relative">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"
            />
            <div
              class="relative p-5 rounded-2xl bg-surface-900/30 border border-white/5 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-500 text-center"
            >
              <div
                class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 italic mb-1"
              >
                {{ stat.value }}
              </div>
              <div
                class="text-[8px] font-bold text-surface-500 uppercase tracking-[0.3em]"
              >
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section
      class="py-8 bg-surface-950 border-b border-white/5 sticky top-14 md:top-12 z-40 backdrop-blur-2xl bg-surface-950/95"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="filter in filters"
            :key="filter.value"
            :class="[
              'group relative px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300',
              activeFilter === filter.value
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-black shadow-lg shadow-primary-500/30'
                : 'bg-white/5 text-surface-400 hover:text-white border border-white/10 hover:border-primary-500/30',
            ]"
            @click="activeFilter = filter.value"
          >
            <span class="relative z-10 flex items-center gap-2">
              <i :class="[filter.icon, 'text-xs']"/>
              {{ filter.label }}
            </span>
            <div
              v-if="activeFilter !== filter.value"
              class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- Success Stories Grid -->
    <section class="py-16 md:py-20 bg-surface-950">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="story in filteredStories"
            :key="story.id"
            class="group relative cursor-pointer"
            @click="openLightbox(story)"
          >
            <!-- Glow Effect -->
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <!-- Card -->
            <div
              class="relative h-full rounded-2xl bg-gradient-to-br from-surface-900/40 to-surface-900/20 border border-white/10 backdrop-blur-3xl overflow-hidden hover:border-primary-500/30 transition-all duration-500"
            >
              <!-- Thumbnail -->
              <div class="relative aspect-[4/3] overflow-hidden">
                <img
                  :src="story.thumbnail"
                  :alt="story.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                >
                <!-- Overlay Gradient -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent"
                />

                <!-- Type Badge -->
                <div class="absolute top-3 right-3">
                  <div
                    class="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10"
                  >
                    <i
                      :class="[
                        story.type === 'video' ? 'pi pi-play' : 'pi pi-image',
                        'text-primary-500 text-xs',
                      ]"
                    />
                  </div>
                </div>

                <!-- Year Badge -->
                <div class="absolute top-3 left-3">
                  <div
                    class="px-3 py-1 rounded-full bg-primary-500/20 backdrop-blur-xl border border-primary-500/30"
                  >
                    <span
                      class="text-[9px] font-black text-primary-400 uppercase tracking-widest"
                      >{{ story.year }}</span
                    >
                  </div>
                </div>

                <!-- Play Button for Videos -->
                <div
                  v-if="story.type === 'video'"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    class="w-16 h-16 rounded-full bg-primary-500/20 backdrop-blur-xl border-2 border-primary-500 flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <i class="pi pi-play text-primary-500 text-xl ml-1"/>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="p-5 space-y-3">
                <!-- Name & Destination -->
                <div>
                  <h3
                    class="text-lg font-black text-white mb-1 group-hover:text-primary-500 transition-colors"
                  >
                    {{ story.name }}
                  </h3>
                  <div class="flex items-center gap-2 text-xs text-surface-400">
                    <i class="pi pi-map-marker text-primary-500"/>
                    <span class="font-bold">{{ story.destination }}</span>
                  </div>
                </div>

                <!-- Details -->
                <div class="text-xs text-surface-500 font-medium">
                  <span v-if="story.university">{{ story.university }}</span>
                  <span v-else>{{ story.visaType }}</span>
                  <span v-if="story.program"> • {{ story.program }}</span>
                </div>

                <!-- Quote -->
                <p
                  class="text-sm text-surface-400 leading-relaxed italic line-clamp-2"
                >
                  "{{ story.quote }}"
                </p>

                <!-- View More -->
                <div
                  class="pt-2 flex items-center gap-2 text-primary-500 text-xs font-black uppercase tracking-wider"
                >
                  <span
                    >View
                    {{ story.type === "video" ? "Video" : "Details" }}</span
                  >
                  <i
                    class="pi pi-arrow-right text-[8px] transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredStories.length === 0" class="text-center py-20">
          <div
            class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
          >
            <i class="pi pi-inbox text-3xl text-primary-500"/>
          </div>
          <h3 class="text-xl font-black text-white mb-2">No Stories Found</h3>
          <p class="text-sm text-surface-400">
            Try selecting a different filter
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-20 md:py-24 bg-surface-950 border-t border-white/5 relative overflow-hidden"
    >
      <div class="absolute inset-0">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary-500/10 via-primary-600/10 to-primary-500/10 blur-[150px] rounded-full animate-pulse"
        />
      </div>

      <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div class="text-center space-y-8">
          <div class="space-y-5">
            <h2
              class="text-4xl md:text-6xl font-black tracking-tight leading-tight"
            >
              <span class="block text-white">Ready to Write</span>
              <span
                class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic"
                >Your Success Story?</span
              >
            </h2>
            <p
              class="text-sm md:text-base text-surface-300 max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of successful clients who trusted UniReach to turn
              their dreams into reality.
            </p>
          </div>

          <div class="pt-4">
            <NuxtLink
              to="/contact"
              class="group inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105"
            >
              <span>Start Your Journey</span>
              <i
                class="pi pi-arrow-right transform group-hover:translate-x-2 transition-transform"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightboxOpen && selectedStory"
        class="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
        @click="closeLightbox"
      >
        <div
          class="relative max-w-5xl w-full bg-surface-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          @click.stop
        >
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
            @click="closeLightbox"
          >
            <i class="pi pi-times text-white"/>
          </button>

          <!-- Content -->
          <div class="grid md:grid-cols-2">
            <!-- Media -->
            <div class="relative aspect-square md:aspect-auto">
              <img
                v-if="selectedStory.type === 'image'"
                :src="selectedStory.image"
                :alt="selectedStory.name"
                class="w-full h-full object-cover"
              >
              <iframe
                v-else
                :src="selectedStory.videoUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>

            <!-- Details -->
            <div class="p-8 md:p-10 space-y-6">
              <div>
                <div
                  class="inline-block px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 mb-4"
                >
                  <span
                    class="text-[9px] font-black text-primary-400 uppercase tracking-widest"
                    >{{ selectedStory.year }}</span
                  >
                </div>
                <h2
                  class="text-3xl md:text-4xl font-black text-white mb-3 italic"
                >
                  {{ selectedStory.name }}
                </h2>
                <div class="flex items-center gap-2 text-sm text-surface-400">
                  <i class="pi pi-map-marker text-primary-500"/>
                  <span class="font-bold">{{ selectedStory.destination }}</span>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-if="selectedStory.university"
                  class="flex items-start gap-3"
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="pi pi-building text-primary-500"/>
                  </div>
                  <div>
                    <div
                      class="text-xs text-surface-500 font-bold uppercase tracking-wider mb-1"
                    >
                      University
                    </div>
                    <div class="text-sm text-white font-bold">
                      {{ selectedStory.university }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="selectedStory.program"
                  class="flex items-start gap-3"
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="pi pi-book text-primary-500"/>
                  </div>
                  <div>
                    <div
                      class="text-xs text-surface-500 font-bold uppercase tracking-wider mb-1"
                    >
                      Program
                    </div>
                    <div class="text-sm text-white font-bold">
                      {{ selectedStory.program }}
                    </div>
                  </div>
                </div>

                <div
                  v-if="selectedStory.visaType"
                  class="flex items-start gap-3"
                >
                  <div
                    class="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="pi pi-id-card text-primary-500"/>
                  </div>
                  <div>
                    <div
                      class="text-xs text-surface-500 font-bold uppercase tracking-wider mb-1"
                    >
                      Visa Type
                    </div>
                    <div class="text-sm text-white font-bold">
                      {{ selectedStory.visaType }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-5 rounded-2xl bg-white/5 border border-white/10">
                <i
                  class="pi pi-quote-right text-2xl text-primary-500/30 mb-3 block"
                />
                <p class="text-base text-surface-200 leading-relaxed italic">
                  "{{ selectedStory.quote }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </NuxtLayout>
</template>

<style scoped>
.bg-size-\[60px_60px\] {
  background-size: 60px 60px;
}

.bg-size-\[80px_80px\] {
  background-size: 80px 80px;
}

.delay-75 {
  animation-delay: 75ms;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-150 {
  animation-delay: 150ms;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
