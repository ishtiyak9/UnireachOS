<script setup lang="ts">
// Business Immigration Section Logic - Elite Mobility
</script>

<template>
  <section class="py-24 bg-surface-950 relative overflow-hidden">
    <!-- Luxury Backdrop -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary-500/5 blur-[120px] rounded-full rotate-12"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px)] bg-size-[100px_100px] mask-[radial-gradient(ellipse_at_center,black,transparent_80%)]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <div
        class="relative p-8 md:p-16 rounded-[3rem] bg-surface-900/40 backdrop-blur-3xl border border-white/5 shadow-3xl overflow-hidden group"
      >
        <!-- Golden Corner Accents -->
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-primary-500/10 to-transparent"
        ></div>
        <div
          class="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-primary-900/10 to-transparent"
        ></div>

        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <!-- Text Content -->
          <div class="flex-1 space-y-8">
            <div
              class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-500/5 border border-primary-500/10"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
              ></span>
              <span
                class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-400"
                >Executive Mobility</span
              >
            </div>

            <div class="space-y-4">
              <h2
                class="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight"
              >
                Architecting <br />
                <span class="text-primary-500 not-italic font-light"
                  >Sovereign Presence.</span
                >
              </h2>
              <p
                class="text-surface-400 text-sm md:text-lg font-medium max-w-xl leading-relaxed"
              >
                Strategic residency and citizenship pathways for HNWIs and
                global entrepreneurs. We bridge the gap between investment and
                institutional arrival with surgical discretion.
              </p>
            </div>

            <div class="flex flex-wrap gap-8 items-center pt-4">
              <div class="flex flex-col">
                <span
                  class="text-2xl font-black text-white italic tracking-tighter"
                  >€0 to €500K+</span
                >
                <span
                  class="text-[9px] font-bold text-surface-500 uppercase tracking-widest"
                  >Typical CapEx</span
                >
              </div>
              <div class="w-px h-10 bg-surface-800"></div>
              <div class="flex flex-col">
                <span
                  class="text-2xl font-black text-white italic tracking-tighter"
                  >VIP-72h</span
                >
                <span
                  class="text-[9px] font-bold text-surface-500 uppercase tracking-widest"
                  >Initial Audit</span
                >
              </div>
            </div>

            <div class="pt-4">
              <NuxtLink
                to="/business-immigration"
                class="group/btn relative inline-flex items-center gap-4 px-10 py-5 bg-primary-500 rounded-2xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(var(--p-primary-500-rgb),0.4)]"
              >
                <div
                  class="absolute inset-0 bg-linear-to-r from-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"
                ></div>
                <span
                  class="relative z-10 text-xs font-black uppercase tracking-widest text-black"
                  >Inquire Privately</span
                >
                <i
                  class="pi pi-arrow-right text-black relative z-10 group-hover/btn:translate-x-1 transition-transform"
                ></i>
              </NuxtLink>
            </div>
          </div>

          <!-- Visual Metaphor -->
          <div
            class="w-full lg:w-[450px] aspect-square relative flex items-center justify-center"
          >
            <div
              class="absolute inset-0 bg-primary-500/5 rounded-full blur-3xl"
            ></div>
            <!-- Concentric Golden Rings -->
            <div
              v-for="i in 3"
              :key="i"
              class="absolute border border-primary-500/10 rounded-full animate-pulse"
              :style="{
                width: `${100 - i * 20}%`,
                height: `${100 - i * 20}%`,
                animationDelay: `${i * 0.5}s`,
              }"
            ></div>

            <div
              class="relative z-10 p-12 rounded-[2.5rem] bg-surface-900 border border-primary-500/20 shadow-2xl transform hover:scale-105 transition-transform duration-700"
            >
              <i
                class="pi pi-briefcase text-primary-500 text-7xl md:text-8xl opacity-80"
              ></i>
              <!-- Success Tags -->
              <div
                class="absolute -top-6 -right-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rotate-12"
              >
                <span
                  class="text-[10px] font-black text-primary-500 uppercase tracking-widest leading-none"
                  >Global Asset</span
                >
              </div>
              <div
                class="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl -rotate-6"
              >
                <span
                  class="text-[10px] font-black text-white uppercase tracking-widest leading-none"
                  >Secure Exit</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shadow-3xl {
  box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 1);
}
</style>
