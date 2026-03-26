<script setup lang="ts">
const infoMetrics = [
  { value: "22+", label: "Destinations" },
  { value: "350+", label: "Universities" },
  { value: "200+", label: "Scholarships" },
  { value: "24/7", label: "Guidance" },
  { value: "1h", label: "Response" },
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
    class="relative min-h-svh w-full flex flex-col justify-center pt-20 sm:pt-24 lg:pt-12 pb-12 sm:pb-16 overflow-hidden bg-white dark:bg-surface-950"
  >
    <!-- Background Architecture -->
    <div class="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
      <div
        class="absolute top-[-5%] right-[-5%] w-72 sm:w-[40rem] h-72 sm:h-[40rem] bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-[80px] animate-pulse"
      />
      <div
        class="absolute bottom-[-5%] left-[-5%] w-72 sm:w-[40rem] h-72 sm:h-[40rem] bg-primary-600/5 dark:bg-primary-500/10 rounded-full blur-[80px]"
      />
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--p-primary-500-rgb),0.05)_1px,transparent_1px)] bg-[size:40px_40px]"
      />
    </div>

    <!-- Main content wrapper — must NOT be a flex row that can be widened by children -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-12 lg:gap-8 items-center">

        <!-- ─── Left / Main Content Column ─────────────────────── -->
        <!-- min-w-0 is critical: prevents flex item from growing beyond its container -->
        <div class="lg:col-span-7 min-w-0 flex flex-col gap-8 sm:gap-10">

          <!-- Status + Headline + Body -->
          <div class="flex flex-col gap-4 sm:gap-6">
            <!-- Live badge -->
            <div class="flex justify-center lg:justify-start">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/20 shadow-xs">
                <span class="relative flex h-1.5 w-1.5 shrink-0">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500" />
                </span>
                <span class="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] text-primary-700 dark:text-primary-400 leading-none whitespace-nowrap">
                  Global Intake Live
                </span>
              </div>
            </div>

            <!-- H1 -->
            <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-7xl font-black text-surface-900 dark:text-surface-0 tracking-tight leading-[1.05] text-center lg:text-left">
              <span class="block">Global Education,</span>
              <span class="block italic font-light text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-300 dark:to-primary-500 mt-1">
                Perfectly Guided.
              </span>
            </h1>

            <!-- Body -->
            <p class="text-base sm:text-lg text-surface-600 dark:text-surface-400 font-medium leading-relaxed text-center lg:text-left mx-auto lg:mx-0 max-w-lg">
              Unireach unifies the journey to Europe — a surgical platform to match Schengen universities, secure scholarships, and map your professional future.
            </p>
          </div>

          <!-- Search Bar -->
          <div class="w-full">
            <div class="relative flex flex-col sm:flex-row gap-1 p-1 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-xl overflow-hidden">
              <div class="flex-1 min-w-0 flex items-center h-14 sm:h-12 px-4 gap-3">
                <span class="pi pi-search text-primary-500/70 shrink-0 text-sm" />
                <input
                  type="text"
                  placeholder="Destination or Course..."
                  class="w-full min-w-0 bg-transparent outline-none text-xs sm:text-sm font-bold text-surface-900 dark:text-surface-0 placeholder:text-surface-400 placeholder:font-normal uppercase tracking-widest"
                />
              </div>
              <BaseButton
                label="Launch Journey"
                class="shrink-0 h-14 sm:h-auto px-6 sm:px-8 rounded-xl! bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 border-none! text-white! font-black uppercase tracking-widest text-[10px] italic"
                to="/destinations"
              />
            </div>
          </div>

          <!-- Metrics Row -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 sm:gap-x-10 gap-y-5">
            <div
              v-for="metric in infoMetrics"
              :key="metric.label"
              class="flex flex-col items-center lg:items-start"
            >
              <span class="text-2xl sm:text-3xl font-black text-surface-900 dark:text-surface-0 tabular-nums italic leading-none">
                {{ metric.value }}
              </span>
              <span class="text-[8px] sm:text-[9px] font-black text-surface-400 uppercase tracking-widest pt-1">
                {{ metric.label }}
              </span>
            </div>
          </div>

          <!-- Marquee — completely isolated from layout flow -->
          <div class="w-full overflow-hidden">
            <p class="text-[8px] sm:text-[10px] font-black text-surface-400 uppercase tracking-[0.3em] mb-3 text-center lg:text-left">
              Institutional Network Across Schengen
            </p>
            <!-- The outer div has overflow:hidden so the inner marquee can be any width -->
            <div class="relative overflow-hidden mask-fade-edges">
              <div class="marquee-track flex items-center gap-10 sm:gap-16 py-2">
                <span
                  v-for="uni in europeanUnis"
                  :key="uni"
                  class="shrink-0 text-[10px] sm:text-[12px] font-black uppercase tracking-widest text-surface-400/60 hover:text-primary-500 cursor-default transition-colors"
                >
                  {{ uni }}
                </span>
                <!-- Clone for seamless loop -->
                <span
                  v-for="uni in europeanUnis"
                  :key="uni + '-clone'"
                  class="shrink-0 text-[10px] sm:text-[12px] font-black uppercase tracking-widest text-surface-400/60 hover:text-primary-500 cursor-default transition-colors"
                >
                  {{ uni }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── Right Visual Column (desktop only) ─────────────── -->
        <div class="lg:col-span-5 hidden lg:flex flex-col items-end py-6 min-w-0">
          <div class="relative z-10 flex flex-col gap-3 w-full max-w-sm ml-auto animate-float">

            <!-- Destination Card -->
            <div class="p-px rounded-3xl bg-gradient-to-br from-primary-500/30 via-primary-500/10 to-transparent shadow-xl">
              <div class="p-6 rounded-[1.4rem] bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border border-white dark:border-surface-800 space-y-6">
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <div class="text-[9px] font-black text-primary-500 uppercase tracking-widest">Aspirant Insight</div>
                    <h3 class="text-xl font-black italic tracking-tighter text-surface-900 dark:text-surface-0">Hungary</h3>
                  </div>
                  <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
                    <i class="pi pi-clock text-primary-600 text-sm" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-3 rounded-xl bg-surface-50 dark:bg-surface-950/50 border border-surface-100 dark:border-surface-800/30">
                    <p class="text-[8px] font-black text-surface-400 uppercase tracking-widest">Next Intake</p>
                    <div class="text-lg font-black tabular-nums text-primary-600 dark:text-primary-400">SEPT 2026</div>
                  </div>
                  <div class="p-3 rounded-xl bg-surface-50 dark:bg-surface-950/50 border border-surface-100 dark:border-surface-800/30">
                    <p class="text-[8px] font-black text-surface-400 uppercase tracking-widest">Visa Window</p>
                    <div class="text-lg font-black italic text-primary-600 dark:text-primary-400">4-8 WEEKS</div>
                  </div>
                </div>
                <div class="pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
                  <div class="flex -space-x-2">
                    <div v-for="i in 3" :key="i" class="w-7 h-7 rounded-full border-2 border-white dark:border-surface-900 bg-surface-200" />
                  </div>
                  <div class="text-[8px] font-bold text-surface-400 uppercase tracking-widest">Active Alumni</div>
                </div>
              </div>
            </div>

            <!-- Scholarship Card -->
            <div class="p-4 rounded-2xl bg-white/40 dark:bg-surface-900/40 backdrop-blur-xl border border-primary-500/20 shadow-xl flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30 shrink-0">
                <i class="pi pi-award text-white text-xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="text-[9px] font-black uppercase tracking-[0.2em] text-surface-900 dark:text-surface-0">Scholarship Matcher</h5>
                <p class="text-[8px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-tighter italic">Complimentary Review Active</p>
              </div>
              <i class="pi pi-chevron-right text-surface-400 text-[10px] shrink-0" />
            </div>

            <!-- Success Feed -->
            <div class="p-4 rounded-2xl bg-surface-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-4 w-[90%] ml-auto">
              <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/30 shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Student" class="w-full h-full object-cover" />
                <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface-900" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[8px] font-black uppercase tracking-widest text-emerald-400">Just Accepted</span>
                  <span class="text-[8px] text-surface-500">• 2m ago</span>
                </div>
                <p class="text-[10px] text-white font-medium leading-tight">
                  <span class="font-bold text-emerald-200">Arjun M.</span> secured
                  <span class="font-bold text-white">Full Scholarship</span> at TVS Munich.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Marquee ─────────────────────────────────────────────────── */
.marquee-track {
  display: flex;
  width: max-content; /* allowed here because parent has overflow:hidden */
  animation: marquee 40s linear infinite;
  white-space: nowrap;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.mask-fade-edges {
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

/* ── Float (desktop cards) ───────────────────────────────────── */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
