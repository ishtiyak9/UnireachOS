<script setup lang="ts">
// Ultra-Premium CTA Component
</script>

<template>
  <section
    class="py-16 md:py-20 bg-surface-950 border-t border-white/5 relative overflow-hidden"
  >
    <!-- Advanced Background -->
    <div class="absolute inset-0 z-0">
      <!-- Gradient Mesh -->
      <div class="absolute inset-0">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-gradient-to-r from-primary-500/10 via-primary-600/10 to-primary-500/10 blur-[150px] rounded-full animate-pulse"
        />
      </div>
      <!-- Animated Grid -->
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Compact Premium Card -->
      <div class="relative">
        <!-- Animated Gradient Border -->
        <div
          class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-3xl blur opacity-20 animate-pulse"
        />

        <!-- Main Card -->
        <div
          class="relative rounded-3xl bg-gradient-to-br from-surface-900/90 to-surface-900/60 border border-white/10 backdrop-blur-2xl overflow-hidden"
        >
          <!-- Inner Glow -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5"
          />

          <!-- Content -->
          <div class="relative px-8 py-12 md:px-16 md:py-16">
            <div class="max-w-4xl mx-auto">
              <!-- Compact Grid Layout -->
              <div class="grid lg:grid-cols-[1fr,auto] gap-8 items-center">
                <!-- Left: Messaging -->
                <div class="space-y-5 text-center lg:text-left">
                  <!-- Badge -->
                  <div
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-xl"
                  >
                    <div
                      class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
                    />
                    <span
                      class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-400"
                      >Limited Slots Available</span
                    >
                  </div>

                  <!-- Headline -->
                  <h2
                    class="text-3xl md:text-5xl font-black tracking-tight leading-[1.1]"
                  >
                    <span class="block text-white">Ready to Transform</span>
                    <span
                      class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic mt-1"
                      >Your Global Journey?</span
                    >
                  </h2>

                  <!-- Description -->
                  <p
                    class="text-sm md:text-base text-surface-300 leading-relaxed max-w-xl lg:max-w-none"
                  >
                    Join thousands who've trusted UniReach to navigate their
                    path to success. Expert guidance, proven results, premium
                    service.
                  </p>

                  <!-- Trust Indicators (Mobile) -->
                  <div
                    class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 lg:hidden"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
                      >
                        <i class="pi pi-check text-primary-500 text-xs"/>
                      </div>
                      <span class="text-xs text-surface-400 font-bold"
                        >83% Success Rate</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <div
                        class="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
                      >
                        <i class="pi pi-shield text-primary-500 text-xs"/>
                      </div>
                      <span class="text-xs text-surface-400 font-bold"
                        >Verified Reviews</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Right: Action Buttons -->
                <div class="flex flex-col gap-3 lg:min-w-[280px]">
                  <NuxtLink
                    to="/contact"
                    class="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105 text-center overflow-hidden"
                  >
                    <span
                      class="relative z-10 flex items-center justify-center gap-2"
                    >
                      <span>Get Started Now</span>
                      <i
                        class="pi pi-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                    <!-- Animated Shine -->
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                    />
                  </NuxtLink>

                  <button
                    class="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300 text-center"
                  >
                    Schedule Consultation
                  </button>

                  <!-- Trust Indicators (Desktop) -->
                  <div class="hidden lg:flex flex-col gap-2 pt-2">
                    <div class="flex items-center gap-2">
                      <i
                        class="pi pi-check-circle text-primary-500 text-xs"
                      />
                      <span
                        class="text-[9px] text-surface-500 font-bold uppercase tracking-wider"
                        >No Hidden Fees</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <i
                        class="pi pi-check-circle text-primary-500 text-xs"
                      />
                      <span
                        class="text-[9px] text-surface-500 font-bold uppercase tracking-wider"
                        >Free Initial Consultation</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom Stats Bar -->
              <div
                class="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/5"
              >
                <div class="text-center">
                  <div
                    class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 italic mb-1"
                  >
                    350+
                  </div>
                  <div
                    class="text-[8px] md:text-[9px] text-surface-500 font-bold uppercase tracking-[0.3em]"
                  >
                    Verified Universities
                  </div>
                </div>
                <div class="text-center">
                  <div
                    class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 italic mb-1"
                  >
                    22+
                  </div>
                  <div
                    class="text-[8px] md:text-[9px] text-surface-500 font-bold uppercase tracking-[0.3em]"
                  >
                    Countries
                  </div>
                </div>
                <div class="text-center">
                  <div
                    class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 italic mb-1"
                  >
                    24/7
                  </div>
                  <div
                    class="text-[8px] md:text-[9px] text-surface-500 font-bold uppercase tracking-[0.3em]"
                  >
                    Support
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
.bg-\[size\:80px_80px\] {
  background-size: 80px 80px;
}
</style>
