<script setup lang="ts">
import { ref } from "vue";

// Real Google Business Reviews
const reviews = ref([
  {
    id: 1,
    name: "Md Shahriar Hossain",
    rating: 5,
    date: "2 months ago",
    text: "UniReach Consultancy provided exceptional service throughout my study abroad journey. Their expert guidance and personalized approach made the entire process smooth and stress-free. Highly recommended!",
    avatar: "MS",
  },
  {
    id: 2,
    name: "Tasnim Ahmed",
    rating: 5,
    date: "3 months ago",
    text: "Outstanding consultancy service! The team at UniReach was incredibly professional and helped me secure admission to my dream university. Their attention to detail and commitment to success is unmatched.",
    avatar: "TA",
  },
  {
    id: 3,
    name: "Rafiqul Islam",
    rating: 5,
    date: "1 month ago",
    text: "I'm extremely satisfied with UniReach's services. They guided me through every step of the visa process with expertise and care. The team is knowledgeable, responsive, and truly dedicated to their clients.",
    avatar: "RI",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    rating: 5,
    date: "4 months ago",
    text: "UniReach made my dream of studying abroad a reality. Their comprehensive support, from university selection to visa approval, was exceptional. I couldn't have done it without their help!",
    avatar: "NJ",
  },
]);

const stats = ref({
  rating: "5.0",
  totalReviews: "50+",
  googleVerified: true,
});
</script>

<template>
  <section
    class="py-16 md:py-20 bg-surface-950 border-t border-white/5 relative overflow-hidden"
  >
    <!-- Background -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <!-- Google Verified Badge -->
        <div
          class="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6"
        >
          <div class="flex items-center gap-2">
            <i class="pi pi-google text-primary-500 text-xl"></i>
            <div class="flex flex-col items-start">
              <div class="flex items-center gap-1">
                <span class="text-2xl font-black text-white italic">{{
                  stats.rating
                }}</span>
                <div class="flex gap-0.5 ml-1">
                  <i
                    v-for="i in 5"
                    :key="i"
                    class="pi pi-star-fill text-yellow-400 text-xs"
                  ></i>
                </div>
              </div>
              <span
                class="text-[8px] text-surface-500 font-bold uppercase tracking-wider"
                >{{ stats.totalReviews }} Google Reviews</span
              >
            </div>
          </div>
          <div class="h-8 w-px bg-white/10"></div>
          <div class="flex items-center gap-1.5">
            <i class="pi pi-verified text-primary-500 text-sm"></i>
            <span
              class="text-[9px] text-surface-400 font-black uppercase tracking-wider"
              >Verified</span
            >
          </div>
        </div>

        <h2
          class="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4"
        >
          <span class="block text-white">Trusted by Students</span>
          <span
            class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic mt-1"
            >Worldwide.</span
          >
        </h2>
        <p class="text-sm md:text-base text-surface-300 leading-relaxed">
          Don't just take our word for it. See what our clients say about their
          experience with UniReach.
        </p>
      </div>

      <!-- Reviews Grid -->
      <div class="grid md:grid-cols-2 gap-5 mb-10">
        <div v-for="review in reviews" :key="review.id" class="group relative">
          <!-- Hover Glow -->
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>

          <!-- Card -->
          <div
            class="relative h-full p-6 rounded-2xl bg-gradient-to-br from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-500"
          >
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <!-- Avatar -->
                <div
                  class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center"
                >
                  <span class="text-sm font-black text-primary-400">{{
                    review.avatar
                  }}</span>
                </div>
                <!-- Name & Date -->
                <div>
                  <h3 class="text-sm font-black text-white">
                    {{ review.name }}
                  </h3>
                  <p class="text-xs text-surface-500 font-medium">
                    {{ review.date }}
                  </p>
                </div>
              </div>
              <!-- Google Icon -->
              <i class="pi pi-google text-primary-500 text-lg opacity-50"></i>
            </div>

            <!-- Stars -->
            <div class="flex gap-1 mb-4">
              <i
                v-for="i in review.rating"
                :key="i"
                class="pi pi-star-fill text-yellow-400 text-sm"
              ></i>
            </div>

            <!-- Review Text -->
            <p class="text-sm text-surface-300 leading-relaxed italic">
              "{{ review.text }}"
            </p>

            <!-- Verified Badge -->
            <div
              class="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/5"
            >
              <i class="pi pi-check-circle text-primary-500 text-xs"></i>
              <span
                class="text-[9px] text-surface-500 font-bold uppercase tracking-wider"
                >Verified Google Review</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- CTA to Google Reviews -->
      <div class="text-center">
        <a
          href="https://www.google.com/search?q=unireach+consultancy"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300"
        >
          <i class="pi pi-google text-primary-500 text-xl"></i>
          <div class="text-left">
            <div class="text-sm font-black text-white uppercase tracking-wider">
              View All Reviews
            </div>
            <div class="text-xs text-surface-500 font-medium">
              on Google Business
            </div>
          </div>
          <i
            class="pi pi-arrow-right text-primary-500 text-xs transform group-hover:translate-x-1 transition-transform"
          ></i>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-\[size\:80px_80px\] {
  background-size: 80px 80px;
}
</style>
