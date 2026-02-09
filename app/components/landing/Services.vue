<script setup lang="ts">
const services = [
  {
    title: "Application Core",
    subtitle: "Strategic Execution",
    desc: "Targeted admissions strategy. We engineer the narrative; you secure the offer.",
    icon: "pi pi-building",
  },
  {
    title: "Visa Architecture",
    subtitle: "Compliance Protocol",
    desc: "End-to-end documentation audit. We eliminate risk from the equation.",
    icon: "pi pi-id-card",
  },
  {
    title: "Settlement Logistics",
    subtitle: "Seamless Integration",
    desc: "Housing, registration, and banking secured before your flight departs.",
    icon: "pi pi-home",
  },
];
</script>

<template>
  <section
    class="py-24 bg-surface-50 dark:bg-surface-950 relative overflow-hidden"
  >
    <!-- Background Accents -->
    <div
      class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none"
    />

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: The Philosophy -->
        <div class="space-y-8">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
            />
            <span
              class="text-[10px] uppercase font-black tracking-widest text-surface-500"
              >Service Architecture</span
            >
          </div>

          <h2
            class="text-4xl md:text-5xl font-black text-surface-900 dark:text-surface-0 tracking-tight leading-tight"
          >
            Precision <br >
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700"
              >Client Engagement.</span
            >
          </h2>

          <p
            class="text-lg text-surface-600 dark:text-surface-400 leading-relaxed"
          >
            We reject the industry standard of rigid, bundled packages.
            <strong>Our approach is bespoke.</strong> Your journey is unique,
            and your engagement model should reflect that precision.
          </p>

          <div class="pt-4">
            <NuxtLink to="/services">
              <BaseButton
                severity="primary"
                label="View Capabilities"
                class="px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl"
                trailing-icon="pi pi-arrow-right"
              />
            </NuxtLink>
            <p class="mt-4 text-xs text-surface-400 font-medium tracking-wide">
              *Strategic Modules Available
            </p>
          </div>
        </div>

        <!-- Right: The Visual Menu (Teaser Style) -->
        <div class="space-y-4">
          <div
            v-for="service in services"
            :key="service.title"
            class="group relative"
          >
            <div
              class="relative p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-primary-500/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-x-1"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors flex-shrink-0"
                >
                  <i
                    :class="[
                      service.icon,
                      'text-xl text-surface-600 dark:text-surface-400 group-hover:text-primary-500 transition-colors',
                    ]"
                  />
                </div>
                <div>
                  <h3
                    class="text-base font-bold text-surface-900 dark:text-surface-0"
                  >
                    {{ service.title }}
                  </h3>
                  <p class="text-xs text-surface-500 max-w-sm">
                    {{ service.desc }}
                  </p>
                </div>
                <div
                  class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i class="pi pi-arrow-right text-surface-400 text-xs"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
