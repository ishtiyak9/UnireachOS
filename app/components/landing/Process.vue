<script setup lang="ts">
import { ref } from "vue";
const steps = ref([
  {
    order: "01",
    phase: "Precision Assessment",
    title: "Surgical Discovery",
    description:
      "Our proprietary evaluation engine analyzes your academic blueprint, professional trajectory, and financial capacity with total transparency.",
    insight: "48h Turnaround",
    icon: "pi pi-search",
    probability: "100%",
  },
  {
    order: "02",
    phase: "Institutional Mapping",
    title: "Strategic Selection",
    description:
      "Direct matching with 350+ premium Schengen institutions based on global rankings, scholarship availability, and post-study success rates.",
    insight: "Tier-1 Unis Only",
    icon: "pi pi-map",
    probability: "98.4%",
  },
  {
    order: "03",
    phase: "Document Engineering",
    title: "Dossier Perfection",
    description:
      "Every SOP, recommendation, and financial document is surgically refined by specialists to exceed institutional and embassy standards.",
    insight: "99% Audit Success",
    icon: "pi pi-file-edit",
    probability: "99.2%",
  },
  {
    order: "04",
    phase: "The Launch Sequence",
    title: "Sovereign Submission",
    description:
      "Priority processing through our institutional partnerships, ensuring minimized visa windows and direct diplomatic communication.",
    insight: "4-8 Week Target",
    icon: "pi pi-send",
    probability: "96.8%",
  },
  {
    order: "05",
    phase: "Landing & Integration",
    title: "Professional Future",
    description:
      "Post-arrival support featuring professional networking, career mapping, and permanent residency pathways in your chosen region.",
    insight: "Life-long Network",
    icon: "pi pi-briefcase",
    probability: "100%",
  },
]);
</script>

<template>
  <section class="py-24 bg-surface-950 overflow-hidden relative">
    <!-- Architectural Background elements -->
    <div class="absolute inset-0 z-0 pointer-events-none opacity-20">
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[150px] rounded-full"
      />
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-900/10 blur-[150px] rounded-full"
      />
      <!-- Grid Overlay -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px)] bg-size-[60px_60px]"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Section Header -->
      <div class="max-w-3xl mb-24 space-y-4">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 border border-primary-500/20"
        >
          <span
            class="text-[8px] font-black uppercase tracking-[0.3em] text-primary-400 leading-none"
            >The Success Protocol</span
          >
        </div>
        <h2
          class="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none"
        >
          From Aspiration to <br >
          <span class="text-primary-500 not-italic font-light"
            >Sovereign Arrival.</span
          >
        </h2>
        <p class="text-surface-400 text-sm md:text-lg font-medium max-w-xl">
          Move beyond guesswork. Follow our surgical five-phase protocol
          engineered for one specific outcome: your permanent success in Europe.
        </p>
      </div>

      <!-- The Sovereign Path Visualization -->
      <div class="relative mt-20">
        <!-- Connecting Vertical SVG Path -->
        <div
          class="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-4 hidden md:block z-0"
        >
          <svg width="16" height="100%" class="h-full w-full">
            <line
              x1="8"
              y1="0"
              x2="8"
              y2="100%"
              stroke="rgba(var(--p-primary-500-rgb), 0.15)"
              stroke-width="1"
              stroke-dasharray="8 12"
            />
          </svg>
          <!-- Continuous Success Pulse -->
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-48 bg-linear-to-b from-transparent via-primary-500 to-transparent animate-success-flow"
          />
        </div>

        <div class="space-y-40 relative z-10">
          <div
            v-for="(step, index) in steps"
            :key="step.order"
            class="flex flex-col md:flex-row items-center gap-12 md:gap-32 relative group"
            :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
          >
            <!-- Surgical Node Marker -->
            <div
              class="absolute left-6 md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <div class="relative w-16 h-16 flex items-center justify-center">
                <!-- Multi-layer Glow -->
                <div
                  class="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                />
                <!-- Geometric Core -->
                <div
                  class="relative w-12 h-12 rounded-2xl bg-surface-950 border border-primary-500/20 flex flex-col items-center justify-center transform group-hover:rotate-135 transition-all duration-1000 shadow-[0_0_30px_rgba(var(--p-primary-500-rgb),0.05)] overflow-hidden"
                >
                  <div
                    class="absolute inset-0 bg-linear-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <span
                    class="text-[10px] font-black italic text-primary-500 group-hover:-rotate-135 transition-transform duration-1000 relative z-10"
                    >{{ step.order }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Descriptive Insight Block -->
            <div
              class="w-full md:w-1/2 pl-16 md:pl-0"
              :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'"
            >
              <div class="space-y-6">
                <div class="space-y-2">
                  <div
                    class="flex items-center gap-3 opacity-60"
                    :class="index % 2 === 0 ? 'justify-end' : 'justify-start'"
                  >
                    <span class="w-8 h-px bg-primary-500/40"/>
                    <span
                      class="text-[9px] font-black uppercase tracking-[0.4em] text-primary-500"
                      >{{ step.phase }}</span
                    >
                    <span class="w-8 h-px bg-primary-500/40 md:hidden"/>
                  </div>
                  <h3
                    class="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-tight"
                  >
                    {{ step.title }}
                  </h3>
                </div>
                <p
                  class="text-surface-400 text-sm md:text-base leading-relaxed max-w-md font-medium"
                  :class="index % 2 === 0 ? 'md:ml-auto' : ''"
                >
                  {{ step.description }}
                </p>
              </div>
            </div>

            <!-- Floating Architectural Sidecar -->
            <div
              class="w-full md:w-1/2 relative flex"
              :class="
                index % 2 === 0
                  ? 'justify-start md:pl-0 pl-16'
                  : 'justify-end md:pr-0 pr-16'
              "
            >
              <div
                class="relative p-7 rounded-4xl bg-surface-900/30 backdrop-blur-xl border border-white/5 dark:border-surface-800/50 group-hover:border-primary-500/20 transition-all duration-700 min-w-[240px] shadow-3xl group-hover:-translate-y-2"
              >
                <!-- Interactive Corner Accents -->
                <div
                  class="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary-500/0 group-hover:border-primary-500/40 transition-all duration-700 rounded-tr-3xl"
                />
                <div
                  class="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary-500/0 group-hover:border-primary-500/40 transition-all duration-700 rounded-bl-3xl"
                />
                <div class="flex items-start gap-5 relative z-10">
                  <div
                    class="w-12 h-12 rounded-2xl bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shadow-inner group-hover:bg-primary-500 transition-colors duration-700 group-hover:shadow-[0_0_20px_rgba(var(--p-primary-500-rgb),0.4)]"
                  >
                    <i
                      :class="[
                        step.icon,
                        'text-primary-500 text-xl group-hover:text-white transition-colors duration-700',
                      ]"
                    />
                  </div>
                  <div class="flex flex-col pt-1">
                    <div class="flex justify-between items-center mb-1">
                      <span
                        class="text-[8px] font-bold text-surface-500 uppercase tracking-widest"
                        >Protocol Insight</span
                      >
                      <span
                        class="text-[8px] font-black text-primary-500 group-hover:animate-pulse"
                        >{{ step.probability }}</span
                      >
                    </div>
                    <span
                      class="text-base font-black text-white italic tracking-tight uppercase group-hover:text-primary-500 transition-colors"
                      >{{ step.insight }}</span
                    >
                    <div class="flex gap-1 mt-2">
                      <div
                        v-for="i in 5"
                        :key="i"
                        class="w-3 h-[2px] rounded-full transition-all duration-500"
                        :class="
                          i <= 4
                            ? 'bg-primary-500/60 group-hover:bg-primary-500'
                            : 'bg-surface-800'
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes success-flow {
  0% {
    top: 0%;
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    top: 100%;
    transform: translate(-50%, 0%);
    opacity: 0;
  }
}
.animate-success-flow {
  animation: success-flow 6s cubic-bezier(0.1, 0, 0.9, 1) infinite;
}
.shadow-3xl {
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
}
</style>
