<script setup lang="ts">
const mentors = [
  {
    name: "Dr. Elena Weber",
    role: "Strategic Advisor",
    university: "Technical University of Munich",
    credential: "PhD in Data Science",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    bio: "Former admissions committee member at TUM. Specialized in scholarship negotiation and PhD placements.",
    socials: { linkedin: "#" },
  },
  {
    name: "Kwame Osei",
    role: "Lead Mentor (France)",
    university: "HEC Paris",
    credential: "MBA",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame",
    bio: "Successfully guided 500+ students to top French business schools. Expert in visa compliance and housing.",
    socials: { linkedin: "#" },
  },
  {
    name: "Sofia Rossi",
    role: "Senior Consultant (Italy)",
    university: "Politecnico di Milano",
    credential: "MSc Architecture",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    bio: "Architect turned education consultant. Helps creative portfolios stand out to Italian design institutes.",
    socials: { linkedin: "#" },
  },
  {
    name: "Arjun Mehta",
    role: "Founding Partner",
    university: "KTH Royal Institute",
    credential: "MSc Engineering",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    bio: "Unireach founder. Built the 'Velocity-First' application system to eliminate delays for Asian applicants.",
    socials: { linkedin: "#" },
  },
];
</script>

<template>
  <section class="py-24 bg-white dark:bg-surface-950 relative overflow-hidden">
    <!-- Subtle Grid Background -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
    />

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-20">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 mb-6"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
          />
          <span
            class="text-[10px] uppercase font-black tracking-widest text-surface-500"
            >Alumni-Led Guidance</span
          >
        </div>
        <h2
          class="text-4xl md:text-5xl font-black text-surface-900 dark:text-surface-0 mb-6 tracking-tight"
        >
          Meet the
          <span class="text-primary-600 dark:text-primary-400">Mentors </span>
        </h2>
        <p
          class="text-lg text-surface-600 dark:text-surface-400 font-medium leading-relaxed"
        >
          We aren't sales agents. We are alumni. Our team has walked the halls
          of the universities you aspire to join.
        </p>
      </div>

      <!-- Mentors Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="mentor in mentors"
          :key="mentor.name"
          class="group relative"
        >
          <!-- Image Card -->
          <div
            class="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-100 dark:bg-surface-900 mb-6"
          >
            <img
              :src="mentor.image"
              :alt="mentor.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            >
            <!-- Overlay Info -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
            >
              <div
                class="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
              >
                <p
                  class="text-[10px] text-white/80 font-medium mb-1 uppercase tracking-wider"
                >
                  Alma Mater
                </p>
                <p class="text-xs font-bold text-white leading-tight">
                  {{ mentor.university }}
                </p>
              </div>
            </div>
          </div>

          <!-- Text Details -->
          <div
            class="text-center group-hover:-translate-y-2 transition-transform duration-300"
          >
            <h3
              class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-1"
            >
              {{ mentor.name }}
            </h3>
            <p
              class="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-wide"
            >
              {{ mentor.role }}
            </p>
            <p
              class="text-sm text-surface-500 dark:text-surface-400 leading-relaxed px-2"
            >
              {{ mentor.bio }}
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-20 text-center">
        <BaseButton
          label="Book a Strategy Session"
          class="px-8 py-4 rounded-full bg-surface-900 dark:bg-surface-0 text-white dark:text-surface-900 font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl"
          trailing-icon="pi pi-arrow-right"
        />
      </div>
    </div>
  </section>
</template>
