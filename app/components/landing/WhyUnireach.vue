<script setup lang="ts">
// No script needed for this static visual component
</script>

<template>
  <section
    class="py-20 bg-surface-50 dark:bg-surface-950 overflow-hidden relative"
  >
    <!-- Ambient Background Glow -->
    <div
      class="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/10 via-surface-950 to-surface-950 pointer-events-none"
    />

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <!-- Left: The Manifesto (Compact & Punchy) -->
        <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900/50 border border-white/10 backdrop-blur-md"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
              />
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"
              />
            </span>
            <span
              class="text-[9px] uppercase font-black tracking-[0.2em] text-surface-400"
              >The New Standard</span
            >
          </div>

          <h2
            class="text-4xl md:text-5xl font-black text-surface-900 dark:text-white leading-[0.9] tracking-tighter"
          >
            Old World<br >
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600"
              >Obsolete.</span
            >
          </h2>

          <p
            class="text-sm font-medium text-surface-500 dark:text-surface-400 leading-relaxed max-w-sm"
          >
            Traditional agencies process paper. We process probability. Unireach
            is the <span class="text-white">OS for Global Education</span>—built
            for speed, transparency, and results.
          </p>

          <div class="pt-4">
            <button
              class="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors"
            >
              <span>Explore the Architecture</span>
              <i
                class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>

        <!-- Right: The Bento Grid (Ultra Premium) -->
        <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Card 1: Velocity (Wide) -->
          <div
            class="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 hover:border-primary-500/30 transition-all duration-500"
          >
            <div
              class="absolute inset-0 bg-linear-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div
              class="relative p-8 flex flex-col md:flex-row items-center gap-8"
            >
              <div class="flex-1 space-y-4">
                <div
                  class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"
                >
                  <i class="pi pi-bolt text-xl"/>
                </div>
                <h3 class="text-xl font-black text-surface-900 dark:text-white">
                  Velocity Architecture
                </h3>
                <p
                  class="text-xs font-medium text-surface-500 dark:text-surface-400 leading-relaxed"
                >
                  We replaced "application piles" with digital pipelines.
                  Document processing happens in
                  <span class="text-amber-500">hours, not weeks</span>.
                </p>
              </div>
              <!-- Visual Element -->
              <div
                class="w-full md:w-48 h-24 rounded-xl bg-surface-950 border border-white/5 relative overflow-hidden flex items-center justify-center"
              >
                <div
                  class="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:8px_8px] opacity-20"
                />
                <div class="text-3xl font-black text-amber-500 tabular-nums">
                  4x
                  <span class="text-xs font-bold text-surface-500">Faster</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Transparency (Tall) -->
          <div
            class="group relative overflow-hidden rounded-[2rem] bg-surface-900 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 p-8 space-y-12 flex flex-col justify-between"
          >
            <div
              class="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity"
            >
              <i class="pi pi-eye text-6xl text-emerald-500"/>
            </div>
            <div>
              <div
                class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4"
              >
                <i class="pi pi-verified text-xl"/>
              </div>
              <h3 class="text-lg font-black text-white mb-2">
                Radical Transparency
              </h3>
              <p class="text-xs font-medium text-surface-400">
                The 'Black Box' is dead. Track every click, submission, and
                university response in real-time.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex -space-x-2">
                <div
                  class="w-8 h-8 rounded-full bg-surface-800 border-2 border-surface-900 flex items-center justify-center text-[8px] text-emerald-400 font-bold"
                >
                  LIVE
                </div>
                <div
                  class="w-8 h-8 rounded-full bg-surface-800 border-2 border-surface-900 flex items-center justify-center text-[8px] text-emerald-400 font-bold"
                >
                  View
                </div>
              </div>
              <span
                class="text-[10px] font-bold text-surface-500 uppercase tracking-wider"
                >Dashboard Access</span
              >
            </div>
          </div>

          <!-- Card 3: Matching (Tall) -->
          <div
            class="group relative overflow-hidden rounded-[2rem] bg-surface-900 border border-white/5 hover:border-blue-500/30 transition-all duration-500 p-8 space-y-12 flex flex-col justify-between"
          >
            <div
              class="absolute inset-0 bg-linear-to-b from-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <div>
              <div
                class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4"
              >
                <i class="pi pi-objects-column text-xl"/>
              </div>
              <h3 class="text-lg font-black text-white mb-2">
                Surgical Matching
              </h3>
              <p class="text-xs font-medium text-surface-400">
                Data, not guesswork. We analyze acceptance rates to match you
                where you will <span class="text-blue-400">thrive</span>.
              </p>
            </div>
            <div class="w-full bg-surface-800 h-1 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 w-[98%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Statement (Very Subtle) -->
      <div
        class="mt-12 pt-8 border-t border-surface-200 dark:border-white/5 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity"
      >
        <p
          class="text-[9px] font-bold text-surface-400 uppercase tracking-widest"
        >
          Unireach Systems v1.0
        </p>
        <div class="flex gap-4">
          <i class="pi pi-apple text-surface-400 text-xs"/>
          <i class="pi pi-android text-surface-400 text-xs"/>
          <i class="pi pi-desktop text-surface-400 text-xs"/>
        </div>
      </div>
    </div>
  </section>
</template>
