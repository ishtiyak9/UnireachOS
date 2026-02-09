<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const journey = ref([
  {
    year: "2023",
    title: "The Foundation",
    story:
      "Born from a vision to transform global mobility. We started with one mission: make every dream accessible through precision and care.",
    icon: "pi pi-flag",
    color: "from-primary-400 to-primary-500",
  },
  {
    year: "2024",
    title: "Rapid Growth",
    story:
      "From startup to trusted partner. 350+ university partnerships. 22+ countries. Every success story fueled our commitment to excellence.",
    icon: "pi pi-chart-line",
    color: "from-primary-500 to-primary-600",
  },
  {
    year: "2025",
    title: "Global Impact",
    story:
      "150+ dreams realized. Families reunited across continents. Businesses expanded globally. Each journey validated our approach.",
    icon: "pi pi-globe",
    color: "from-primary-600 to-primary-700",
  },
  {
    year: "2026",
    title: "Your Chapter",
    story:
      "Today, we're architects of possibility. Your story is the next one we'll help write. Let's begin.",
    icon: "pi pi-star",
    color: "from-primary-500 to-primary-400",
  },
]);

const values = ref([
  {
    title: "Precision",
    description:
      "Every detail matters. Every document perfect. Every timeline honored.",
    icon: "pi pi-check-circle",
  },
  {
    title: "Transparency",
    description:
      "No hidden fees. No false promises. Just honest guidance and clear pathways.",
    icon: "pi pi-eye",
  },
  {
    title: "Excellence",
    description:
      "83% success rate isn't luck—it's obsessive attention to your unique journey.",
    icon: "pi pi-star-fill",
  },
  {
    title: "Partnership",
    description:
      "Your success is our mission. We don't just advise—we walk beside you.",
    icon: "pi pi-users",
  },
]);

const team = ref([
  {
    role: "Immigration Experts",
    count: "15+",
    description: "Certified professionals with decades of combined experience",
  },
  {
    role: "Legal Advisors",
    count: "8+",
    description:
      "Specialized in international mobility law across 22 countries",
  },
  {
    role: "Student Counselors",
    count: "12+",
    description: "Dedicated to matching students with their dream institutions",
  },
]);

const impact = ref([
  { metric: "24/7", label: "Support" },
  { metric: "22+", label: "Countries Served" },
  { metric: "350+", label: "Partner Institutions" },
  { metric: "83%", label: "Success Rate" },
]);
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Story-Driven Hero -->
    <section
      class="relative pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden bg-surface-950"
    >
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30"
        />
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full animate-pulse"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <div
            class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 backdrop-blur-xl"
          >
            <span
              class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
            />
            <span
              class="text-[9px] font-black uppercase tracking-[0.5em] text-primary-400"
              >Our Story</span
            >
          </div>

          <h1
            class="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]"
          >
            <span class="block text-white">We Don't Just</span>
            <span class="block text-white">Move People.</span>
            <span
              class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic mt-2"
              >We Move Dreams.</span
            >
          </h1>

          <p
            class="text-base md:text-lg text-surface-300 max-w-2xl mx-auto leading-relaxed"
          >
            Every visa is a story. Every application, a leap of faith. Every
            approval, a life transformed. This is what drives us every single
            day.
          </p>
        </div>
      </div>
    </section>

    <!-- Brand Story - Visual Identity -->
    <section class="py-16 md:py-24 bg-surface-900 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div class="space-y-6">
            <span
              class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
              >Our Identity</span
            >
            <h2
              class="text-3xl md:text-5xl font-black text-white italic tracking-tight leading-tight"
            >
              A Symbol of <br >
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 not-italic font-light"
                >Unbroken Trust.</span
              >
            </h2>
            <p class="text-base text-surface-300 leading-relaxed">
              We redesigned our identity to reflect our deepest promise: to be
              the vital link between your ambition and your future.
            </p>
            <div class="space-y-4 pt-4">
              <div class="flex gap-4">
                <div
                  class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0 border border-primary-500/20"
                >
                  <i class="pi pi-link text-primary-500 text-xl"/>
                </div>
                <div>
                  <h3 class="text-white font-bold mb-1">The Unireach Link</h3>
                  <p class="text-sm text-surface-400">
                    Two distinct worlds—your home and your destination—unified
                    seamlessly by our expertise. No gaps, no uncertainty.
                  </p>
                </div>
              </div>
              <div class="flex gap-4">
                <div
                  class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20"
                >
                  <i class="pi pi-shield text-purple-400 text-xl"/>
                </div>
                <div>
                  <h3 class="text-white font-bold mb-1">The Trusted Core</h3>
                  <p class="text-sm text-surface-400">
                    The purple heart represents the wisdom and strategy we apply
                    to protect your journey, transforming a complex process into
                    a golden opportunity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Visual/Logo Presentation -->
          <div
            class="relative flex items-center justify-center h-full min-h-[400px]"
          >
            <!-- Background Glows -->
            <div
              class="absolute inset-0 bg-gradient-to-tr from-primary-500/20 via-purple-500/20 to-primary-500/20 blur-[100px] opacity-60 animate-pulse"
            />

            <!-- Logo Card -->
            <div
              class="relative p-12 rounded-3xl bg-surface-950/50 border border-white/10 backdrop-blur-xl shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700 group"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
              <div class="w-48 h-48 md:w-64 md:h-64 relative">
                <img
                  src="/icon.png"
                  alt="The Unireach Link"
                  class="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Journey - Compact Premium Timeline -->
    <section
      class="py-16 md:py-20 bg-surface-950 border-t border-white/5 relative overflow-hidden"
    >
      <div
        class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[200px] rounded-full"
      />

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="text-center mb-12 space-y-3">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
            >The Journey</span
          >
          <h2
            class="text-3xl md:text-5xl font-black text-white italic tracking-tight"
          >
            Our Story <br >
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 not-italic font-light"
              >In Motion.</span
            >
          </h2>
        </div>

        <!-- Compact Timeline Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="(chapter, index) in journey"
            :key="chapter.year"
            class="group relative"
          >
            <!-- Glow Effect -->
            <div
              :class="[
                'absolute -inset-1 bg-gradient-to-r',
                chapter.color,
                'rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500',
              ]"
            />

            <!-- Card -->
            <div
              class="relative h-full p-6 rounded-2xl bg-gradient-to-br from-surface-900/40 to-surface-900/20 border border-white/10 backdrop-blur-3xl hover:border-primary-500/30 transition-all duration-500 flex flex-col"
            >
              <!-- Year Badge -->
              <div class="absolute -top-3 left-6">
                <div
                  :class="[
                    'px-3 py-1 rounded-full bg-gradient-to-r',
                    chapter.color,
                    'border border-white/20 backdrop-blur-xl',
                  ]"
                >
                  <span
                    class="text-[10px] font-black text-white uppercase tracking-widest"
                    >{{ chapter.year }}</span
                  >
                </div>
              </div>

              <!-- Icon -->
              <div class="mt-4 mb-5">
                <div class="relative inline-block">
                  <div
                    :class="[
                      'absolute inset-0 bg-gradient-to-br',
                      chapter.color,
                      'rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity',
                    ]"
                  />
                  <div
                    :class="[
                      'relative w-14 h-14 rounded-xl bg-gradient-to-br',
                      chapter.color,
                      'border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500',
                    ]"
                  >
                    <i :class="[chapter.icon, 'text-white text-xl']"/>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 flex flex-col">
                <h3
                  class="text-xl font-black text-white mb-3 group-hover:text-primary-500 transition-colors"
                >
                  {{ chapter.title }}
                </h3>
                <p class="text-sm text-surface-400 leading-relaxed flex-1">
                  {{ chapter.story }}
                </p>
              </div>

              <!-- Progress Indicator -->
              <div class="mt-4 pt-4 border-t border-white/5">
                <div class="flex items-center gap-2">
                  <div
                    class="flex-1 h-1 bg-white/5 rounded-full overflow-hidden"
                  >
                    <div
                      :class="[
                        'h-full bg-gradient-to-r',
                        chapter.color,
                        'rounded-full',
                      ]"
                      :style="`width: ${(index + 1) * 25}%`"
                    />
                  </div>
                  <span class="text-[8px] font-black text-surface-600"
                    >{{ index + 1 }}/4</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Connector (Desktop) -->
        <div
          class="hidden lg:block relative -mt-[calc(50%+2rem)] mb-[calc(50%+2rem)] pointer-events-none"
        >
          <div
            class="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"
          />
        </div>
      </div>
    </section>

    <!-- Our Values - Compact Cards -->
    <section class="py-20 md:py-24 bg-surface-950 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-16 space-y-4">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
            >What Drives Us</span
          >
          <h2
            class="text-4xl md:text-6xl font-black text-white italic tracking-tight"
          >
            Our Core <br >
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 not-italic font-light"
              >Values.</span
            >
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="value in values"
            :key="value.title"
            class="group relative"
          >
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div
              class="relative h-full p-6 rounded-2xl bg-gradient-to-br from-surface-900/40 to-surface-900/20 border border-white/10 backdrop-blur-3xl hover:border-primary-500/30 transition-all duration-500"
            >
              <div
                class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              >
                <i :class="[value.icon, 'text-primary-500 text-xl']"/>
              </div>
              <h3
                class="text-xl font-black text-white mb-3 group-hover:text-primary-500 transition-colors"
              >
                {{ value.title }}
              </h3>
              <p class="text-sm text-surface-400 leading-relaxed">
                {{ value.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Team - Compact Stats -->
    <section class="py-20 md:py-24 bg-surface-950 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-16 space-y-4">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
            >The People</span
          >
          <h2
            class="text-4xl md:text-6xl font-black text-white italic tracking-tight"
          >
            Meet The <br >
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 not-italic font-light"
              >Dream Team.</span
            >
          </h2>
          <p class="text-base text-surface-300 max-w-2xl mx-auto">
            Behind every success story is a team of passionate experts who treat
            your journey as their own.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="member in team" :key="member.role" class="group relative">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"
            />
            <div
              class="relative p-8 rounded-2xl bg-surface-900/30 border border-white/5 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-500 text-center"
            >
              <div
                class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 italic mb-3"
              >
                {{ member.count }}
              </div>
              <h3 class="text-lg font-black text-white mb-2">
                {{ member.role }}
              </h3>
              <p class="text-xs text-surface-500 leading-relaxed">
                {{ member.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Numbers -->
    <section
      class="py-16 bg-surface-950 border-y border-white/5 relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5"
      />
      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="stat in impact" :key="stat.label" class="group relative">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"
            />
            <div
              class="relative p-6 rounded-2xl bg-surface-900/30 border border-white/5 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-500 text-center"
            >
              <div
                class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 italic mb-2"
              >
                {{ stat.metric }}
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

    <!-- The Promise - Emotional CTA -->
    <section class="py-24 md:py-32 bg-surface-950 relative overflow-hidden">
      <div class="absolute inset-0">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary-500/10 via-primary-600/10 to-primary-500/10 blur-[150px] rounded-full animate-pulse"
        />
      </div>

      <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div class="text-center space-y-8">
          <div class="space-y-6">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20"
            >
              <i class="pi pi-heart-fill text-primary-500 text-sm"/>
              <span
                class="text-[9px] font-black uppercase tracking-[0.5em] text-primary-400"
                >Our Promise</span
              >
            </div>

            <h2
              class="text-4xl md:text-6xl font-black tracking-tight leading-tight"
            >
              <span class="block text-white">Your Dream</span>
              <span class="block text-white">Is Our</span>
              <span
                class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic mt-2"
                >Responsibility.</span
              >
            </h2>

            <p
              class="text-base md:text-lg text-surface-300 max-w-2xl mx-auto leading-relaxed"
            >
              We don't measure success in approvals—we measure it in transformed
              lives, reunited families, and dreams that became reality. Let's
              make yours the next success story.
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

          <div
            class="pt-8 flex flex-wrap justify-center gap-6 text-xs text-surface-500"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-shield text-primary-500"/>
              <span>Trusted Partner</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-primary-500"/>
              <span>83% Success Rate</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-heart text-primary-500"/>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.bg-size-\[60px_60px\] {
  background-size: 60px 60px;
}
</style>
