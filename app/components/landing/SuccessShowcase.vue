<script setup lang="ts">
import { ref } from "vue";

// Featured success stories with visa approvals
// TO ADD YOUR AUSTRALIA E-VISA IMAGES:
// 1. Upload visa images to: app/public/images/success-stories/
// 2. Name them like: australia-evisa-1.jpg, australia-evisa-2.jpg, etc.
// 3. Update the image paths below to: /images/success-stories/australia-evisa-1.jpg
const successStories = ref([
  {
    id: 1,
    name: "Anika Rahman",
    destination: "Australia",
    university: "University of Melbourne",
    program: "Business Administration",
    year: "2025",
    // Replace with: /images/success-stories/australia-evisa-1.jpg
    image:
      "https://via.placeholder.com/400x500/1a1a1a/d4af37?text=Australia+E-Visa+1",
    type: "student",
  },
  {
    id: 2,
    name: "Fahim Ahmed",
    destination: "Australia",
    university: "Monash University",
    program: "Engineering",
    year: "2025",
    // Replace with: /images/success-stories/australia-evisa-2.jpg
    image:
      "https://via.placeholder.com/400x500/1a1a1a/d4af37?text=Australia+E-Visa+2",
    type: "student",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    destination: "Australia",
    university: "RMIT University",
    program: "Computer Science",
    year: "2024",
    // Replace with: /images/success-stories/australia-evisa-3.jpg
    image:
      "https://via.placeholder.com/400x500/1a1a1a/d4af37?text=Australia+E-Visa+3",
    type: "student",
  },
  {
    id: 4,
    name: "Karim Hassan",
    destination: "Canada",
    university: "University of Toronto",
    program: "MBA",
    year: "2024",
    // Replace with: /images/success-stories/canada-visa-1.jpg
    image: "https://via.placeholder.com/400x500/1a1a1a/d4af37?text=Canada+Visa",
    type: "student",
  },
]);

const stats = ref([
  { value: "350+", label: "Success Stories" },
  { value: "22+", label: "Countries" },
  { value: "83%", label: "Success Rate" },
]);
</script>

<template>
  <section class="py-16 md:py-20 bg-surface-950 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"
      />
      <div
        class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Compact Header -->
      <div
        class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
      >
        <div class="max-w-2xl">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-xl mb-4"
          >
            <div
              class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
            />
            <span
              class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-400"
              >Real Success Stories</span
            >
          </div>
          <h2
            class="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]"
          >
            <span class="block text-white">Dreams Approved,</span>
            <span
              class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic mt-1"
              >Futures Secured.</span
            >
          </h2>
        </div>

        <!-- Stats Mini Bar -->
        <div class="flex gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div
              class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 italic"
            >
              {{ stat.value }}
            </div>
            <div
              class="text-[8px] text-surface-500 font-bold uppercase tracking-wider"
            >
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Success Stories Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          v-for="story in successStories"
          :key="story.id"
          class="group relative"
        >
          <!-- Glow Effect -->
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          <!-- Card -->
          <div
            class="relative rounded-2xl bg-gradient-to-br from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl overflow-hidden hover:border-primary-500/30 transition-all duration-500"
          >
            <!-- Image -->
            <div class="relative aspect-[4/5] overflow-hidden">
              <img
                :src="story.image"
                :alt="`${story.name} - ${story.destination}`"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              >
              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent"
              />

              <!-- Year Badge -->
              <div class="absolute top-3 right-3">
                <div
                  class="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-xl border border-white/10"
                >
                  <span
                    class="text-[9px] font-black text-primary-400 uppercase tracking-wider"
                    >{{ story.year }}</span
                  >
                </div>
              </div>

              <!-- Type Badge -->
              <div class="absolute top-3 left-3">
                <div
                  class="px-3 py-1 rounded-full bg-primary-500/20 backdrop-blur-xl border border-primary-500/30"
                >
                  <i
                    :class="[
                      story.type === 'student'
                        ? 'pi pi-graduation-cap'
                        : 'pi pi-briefcase',
                      'text-primary-500 text-xs',
                    ]"
                  />
                </div>
              </div>

              <!-- Info Overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <div class="flex items-center gap-2 mb-2">
                  <i class="pi pi-map-marker text-primary-500 text-xs"/>
                  <span
                    class="text-xs font-black text-white uppercase tracking-wider"
                    >{{ story.destination }}</span
                  >
                </div>
                <h3 class="text-sm font-black text-white mb-1">
                  {{ story.name }}
                </h3>
                <p class="text-xs text-surface-400 font-medium line-clamp-1">
                  {{ story.university || story.visaType }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Row -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/success-stories"
          class="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105"
        >
          <span>View All Success Stories</span>
          <i
            class="pi pi-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"
          />
        </NuxtLink>

        <a
          href="https://www.facebook.com/unireachbd/photos"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300"
        >
          <i class="pi pi-facebook text-primary-500"/>
          <span>More on Facebook</span>
          <i class="pi pi-external-link text-xs"/>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-\[size\:60px_60px\] {
  background-size: 60px 60px;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
