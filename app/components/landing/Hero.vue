<script setup lang="ts">
const infoMetrics = [
  { value: "22+", label: "Destinations" },
  { value: "350+", label: "Verified Universities" },
  { value: "200+", label: "Scholarships Secured" },
  { value: "24/7", label: "Expert Guidance" },
  { value: "1h", label: "Response Time" },
];

const europeanUnis = [
  "Technical University of Munich",
  "Sorbonne University",
  "University of Amsterdam",
  "KTH Royal Institute",
  "Heidelberg University",
  "Politecnico di Milano",
  "University of Barcelona",
  "KU Leuven",
  "University of Copenhagen",
  "TU Delft",
];
</script>

<template>
  <section
    class="relative min-h-[70vh] lg:min-h-[80vh] flex items-start justify-center pt-4 lg:pt-8 pb-12 overflow-hidden bg-white dark:bg-surface-950"
  >
    <!-- Sophisticated Background Architecture -->
    <div class="absolute inset-0 z-0 select-none pointer-events-none">
      <!-- High-End Mesh Gradient -->
      <div
        class="absolute top-[-5%] right-[-5%] w-160 h-160 bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-[140px] animate-pulse"
      />
      <div
        class="absolute bottom-[-5%] left-[-5%] w-160 h-160 bg-primary-600/5 dark:bg-primary-500/10 rounded-full blur-[140px]"
      />

      <!-- Architectural Grid -->
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--p-primary-500-rgb),0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(var(--p-primary-400-rgb),0.03)_1px,transparent_1px)] bg-size-[40px_40px]"
      />
    </div>

    <div
      class="max-w-7xl mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-12 gap-0 items-start"
    >
      <!-- Left Content: The High-End Proposition -->
      <div
        class="lg:col-span-7 space-y-6 md:space-y-10 animate-fade-in text-left py-4"
      >
        <div class="space-y-4 md:space-y-6">
          <!-- Compact Status Indicator -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/3 dark:bg-primary-500/5 border border-primary-500/20 dark:border-primary-500/20 shadow-sm"
          >
            <span class="relative flex h-1.5 w-1.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
              />
              <span
                class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"
              />
            </span>
            <span
              class="text-[8px] font-black uppercase tracking-[0.25em] text-primary-700 dark:text-primary-400 leading-none"
              >Global Intake Live</span
            >
          </div>

          <h1
            class="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-surface-900 dark:text-surface-0 tracking-[-0.02em] leading-[1.1]"
          >
            <div class="overflow-hidden pb-2">
              <span class="block animate-reveal">Global Education,</span>
            </div>
            <div class="overflow-hidden pb-4 -mt-2">
              <span
                class="block italic font-light text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-primary-700 dark:from-primary-300 dark:to-primary-500 animate-reveal delay-200"
              >
                Perfectly Guided.
              </span>
            </div>
          </h1>

          <p
            class="text-sm md:text-lg text-surface-500 dark:text-surface-400 font-medium max-w-xl leading-relaxed lg:mx-0 tracking-tight"
          >
            Unireach unifies the journey to Europe. A surgical platform for
            aspirants to match Schengen universities, secure scholarships, and
            map their professional future.
          </p>
        </div>

        <!-- Compact High-End Command Search -->
        <div class="group relative max-w-lg lg:mx-0">
          <div
            class="absolute -inset-1 bg-linear-to-r from-primary-500 to-primary-700 rounded-2xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-1000"
          />
          <div
            class="relative flex flex-col sm:flex-row gap-1 p-1 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-xl dark:shadow-none overflow-hidden"
          >
            <div class="flex-1 relative flex items-center h-12 px-4">
              <span
                class="pi pi-search text-primary-500/70 mr-3 text-sm"
              />
              <input
                type="text"
                placeholder="Destination or Course..."
                class="w-full bg-transparent outline-none text-xs sm:text-sm font-bold text-surface-900 dark:text-surface-0 placeholder:text-surface-300 placeholder:font-medium uppercase tracking-widest"
              >
            </div>
            <BaseButton
              label="Launch Journey"
              class="h-12 sm:h-auto px-8 rounded-xl! bg-linear-to-r from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 border-none! text-white! font-black uppercase tracking-widest text-[9px] italic"
              to="/destinations"
            />
          </div>
        </div>

        <!-- High-Density Metrics Row -->
        <div
          class="flex flex-wrap items-center gap-x-8 md:gap-x-12 gap-y-6 md:gap-y-8 pt-4 md:pt-8 animate-fade-in delay-500"
        >
          <div
            v-for="metric in infoMetrics"
            :key="metric.label"
            class="flex flex-col text-left group/metric"
          >
            <span
              class="text-2xl md:text-3xl font-black text-surface-900 dark:text-surface-0 tabular-nums italic leading-none group-hover/metric:text-primary-600 transition-colors"
              >{{ metric.value }}</span
            >
            <span
              class="text-[7px] md:text-[8px] font-black text-surface-400 uppercase tracking-widest pt-1"
              >{{ metric.label }}</span
            >
          </div>
        </div>

        <!-- Institutional Marquee (Infinite Scroll) -->
        <div class="pt-8 md:pt-12 animate-fade-in delay-700">
          <p
            class="text-[7px] md:text-[8px] font-black text-surface-400 uppercase tracking-[0.3em] mb-4 md:mb-6"
          >
            Institutional Network Across Schengen
          </p>
          <div class="relative w-full overflow-hidden mask-fade-edges">
            <div
              class="flex items-center gap-10 md:gap-12 animate-marquee whitespace-nowrap py-2"
            >
              <span
                v-for="uni in europeanUnis"
                :key="uni"
                class="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-surface-400/60 transition-colors hover:text-primary-500 cursor-default"
              >
                {{ uni }}
              </span>
              <!-- Infinite Loop Duplicate -->
              <span
                v-for="uni in europeanUnis"
                :key="uni + '-clone'"
                class="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-surface-400/60 transition-colors hover:text-primary-500 cursor-default"
              >
                {{ uni }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Visual: High-Density Journey Card -->
      <div
        class="lg:col-span-5 relative hidden lg:flex flex-col items-end py-6"
      >
        <div
          class="relative z-10 space-y-3 animate-float w-full max-w-sm ml-auto"
        >
          <!-- Focused Destination Highlight (More Compact) -->
          <div
            class="group/dest p-px rounded-3xl bg-linear-to-br from-primary-500/30 via-primary-500/10 to-transparent shadow-xl"
          >
            <div
              class="p-6 rounded-[1.4rem] bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border border-white dark:border-surface-800 space-y-6"
            >
              <div class="flex justify-between items-start">
                <div class="space-y-1">
                  <div
                    class="text-[9px] font-black text-primary-500 uppercase tracking-widest"
                  >
                    Aspirant Insight
                  </div>
                  <h3
                    class="text-xl font-black italic tracking-tighter text-surface-900 dark:text-surface-0"
                  >
                    Germany
                  </h3>
                </div>
                <div
                  class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center"
                >
                  <i class="pi pi-clock text-primary-600 text-sm"/>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div
                  class="p-3 rounded-xl bg-surface-50 dark:bg-surface-950/50 border border-surface-100 dark:border-surface-800/30"
                >
                  <p
                    class="text-[8px] font-black text-surface-400 uppercase tracking-widest"
                  >
                    Next Intake
                  </p>
                  <div
                    class="text-lg font-black tabular-nums text-primary-600 dark:text-primary-400"
                  >
                    SEPT 2026
                  </div>
                </div>
                <div
                  class="p-3 rounded-xl bg-surface-50 dark:bg-surface-950/50 border border-surface-100 dark:border-surface-800/30"
                >
                  <p
                    class="text-[8px] font-black text-surface-400 uppercase tracking-widest"
                  >
                    Visa Window
                  </p>
                  <div
                    class="text-lg font-black italic text-primary-600 dark:text-primary-400"
                  >
                    4-8 WEEKS
                  </div>
                </div>
              </div>

              <div
                class="pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between"
              >
                <div class="flex -space-x-2">
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="w-7 h-7 rounded-full border-2 border-white dark:border-surface-900 bg-surface-200"
                  />
                </div>
                <div
                  class="text-[8px] font-bold text-surface-400 uppercase tracking-widest"
                >
                  Active Alumni across Schengen
                </div>
              </div>
            </div>
          </div>

          <!-- Floating Benefit Card (Slick Glassmorphic) -->
          <div
            class="group/scholar p-4 rounded-2xl bg-white/40 dark:bg-surface-900/40 backdrop-blur-xl border border-primary-500/20 dark:border-primary-400/20 shadow-xl flex items-center gap-4 transform hover:scale-[1.02] transition-all duration-500"
          >
            <div
              class="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
            >
              <i class="pi pi-award text-white text-xl"/>
            </div>
            <div class="flex-1">
              <h5
                class="text-[9px] font-black uppercase tracking-[0.2em] text-surface-900 dark:text-surface-0"
              >
                Scholarship Matcher
              </h5>
              <p
                class="text-[8px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-tighter italic"
              >
                Complimentary Review Active
              </p>
            </div>
            <i
              class="pi pi-chevron-right text-surface-400 text-[10px] group-hover/scholar:translate-x-1 transition-transform"
            />
          </div>

          <!-- Live Success Feed (Micro-Notification) -->
          <div
            class="group/success p-4 rounded-2xl bg-surface-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-4 transform hover:scale-[1.02] transition-all duration-500 w-[90%] ml-auto translate-x-4"
          >
            <div
              class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/30"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Student"
                class="w-full h-full object-cover"
              >
              <div
                class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface-900 animate-pulse"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="text-[8px] font-black uppercase tracking-widest text-emerald-400"
                  >Just Accepted</span
                >
                <span class="text-[8px] text-surface-500">• 2m ago</span>
              </div>
              <p
                class="text-[10px] text-white font-medium leading-tight max-w-[180px]"
              >
                <span class="font-bold text-emerald-200">Arjun M.</span> secured
                <span class="font-bold text-white">Full Scholarship</span> at
                TVS Munich.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes reveal {
  from {
    transform: translateY(110%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-reveal {
  animation: reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-200 {
  animation-delay: 0.2s;
}
.delay-500 {
  animation-delay: 0.5s;
}
.delay-700 {
  animation-delay: 0.7s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

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

.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}

.mask-fade-edges {
  mask-image: linear-gradient(
    to right,
    transparent,
    black 15%,
    black 85%,
    transparent
  );
}
</style>
