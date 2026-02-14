<template>
  <section class="pb-20 bg-surface-950 relative overflow-hidden font-outfit">
    <div class="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Neural Information Card -->
      <div
        class="relative p-1 rounded-[2rem] bg-linear-to-br from-primary-500/20 via-transparent to-primary-600/20 border border-white/5 backdrop-blur-3xl overflow-hidden group shadow-2xl"
      >
        <!-- Animated Background Orbs -->
        <div
          class="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full group-hover:bg-primary-500/15 transition-all duration-700"
        />
        <div
          class="absolute -bottom-24 -right-24 w-64 h-64 bg-primary-600/10 blur-[100px] rounded-full group-hover:bg-primary-600/15 transition-all duration-700"
        />

        <div
          class="relative bg-surface-950/40 rounded-[1.8rem] p-8 md:p-12 border border-white/5 flex flex-col md:flex-row items-center gap-10"
        >
          <!-- Tactical Icon -->
          <div class="flex-shrink-0 relative">
            <div
              class="absolute inset-0 bg-primary-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
            />
            <div
              class="relative w-24 h-24 rounded-3xl bg-linear-to-br from-surface-900 to-surface-800 border border-primary-500/30 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
            >
              <i class="pi pi-shield-check text-primary-500 text-4xl" />
            </div>
          </div>

          <!-- Content Intelligence -->
          <div class="flex-1 space-y-6 text-center md:text-left">
            <div class="space-y-2">
              <div
                class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20"
              >
                <span
                  class="w-1 h-1 rounded-full bg-primary-500 animate-pulse"
                />
                <span
                  class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-400"
                  >Financial Verification Protocol</span
                >
              </div>
              <h3
                class="text-3xl md:text-4xl font-black text-white italic tracking-tighter"
              >
                Strategic
                <span
                  class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600"
                  >Financial Support</span
                >
              </h3>
            </div>

            <p
              class="text-sm md:text-base text-surface-300 leading-relaxed font-medium max-w-3xl"
            >
              Achieving a successful visa decision requires meticulous financial
              coordination. Unireach provides elite assistance in preparing your
              <span class="text-white font-bold"
                >Bank Solvency Certificates</span
              >, multi-month
              <span class="text-white font-bold">Statement Reconciliation</span
              >, and legal
              <span class="text-white font-bold">Sponsorship Frameworks</span>.
            </p>

            <!-- Intelligence Grid -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4"
            >
              <div
                v-for="item in supportItems"
                :key="item"
                class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary-500/20 transition-all group/item"
              >
                <i class="pi pi-check-circle text-primary-500 text-[10px]" />
                <span
                  class="text-[10px] font-black text-surface-200 uppercase tracking-widest group-hover/item:text-white transition-colors"
                  >{{ item }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const supportItems = [
  "Account Reconciliation",
  "Legal Affidavits",
  "Asset Evaluations",
  "Source of Funds (SOF)",
  "Sponsorship Matrix",
  "Tax Compliance (TIN/IT)",
];
</script>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
