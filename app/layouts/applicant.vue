<script setup lang="ts">
/**
 * Applicant Portal Layout
 * Website-style navigation without sidebar.
 */
</script>

<template>
  <div
    class="min-h-screen bg-[#020202] text-white selection:bg-primary-500/30 font-sans selection:text-white overflow-x-hidden"
  >
    <!-- Ultra-Premium Background Architecture -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <!-- Deep Noise Texture -->
      <div
        class="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grain-y.com/assets/grain.png')]"
      />

      <!-- Ambient Glows -->
      <div
        class="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-primary-500/[0.04] blur-[160px] rounded-full animate-pulse-slow"
      />
      <div
        class="absolute top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/[0.03] blur-[140px] rounded-full"
      />
      <div
        class="absolute -bottom-[20%] right-[20%] w-[50%] h-[50%] bg-indigo-500/[0.02] blur-[120px] rounded-full"
      />
    </div>

    <!-- Navigation Layer -->
    <ApplicantNavbar class="z-50" />

    <!-- Cinematic Main Viewport -->
    <main class="relative z-10 pt-20 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <!-- Obsidian Footer -->
    <footer
      class="relative z-10 py-16 border-t border-white/[0.03] bg-black/80 backdrop-blur-2xl"
    >
      <div
        class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-10"
      >
        <div class="flex flex-col items-center md:items-start gap-4">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-sm border border-primary-500/30 bg-primary-500/10 flex items-center justify-center"
            >
              <i class="pi pi-shield text-[12px] text-primary-500 font-black" />
            </div>
            <span class="text-[13px] font-black uppercase tracking-[0.4em]"
              >UniReach<span class="text-primary-500 opacity-80">
                Intelligence</span
              ></span
            >
          </div>
          <p
            class="text-[12px] font-bold text-surface-600 uppercase tracking-[0.3em] max-w-[250px] text-center md:text-left leading-relaxed"
          >
            Elite Strategy for Global Academic Advancement.
          </p>
        </div>

        <div class="flex flex-col items-center gap-4">
          <p
            class="text-[11px] font-black text-surface-500 uppercase tracking-[0.2em]"
          >
            &copy; 2026 UniReach Intelligence • v4.0 Platinum
          </p>
          <div class="flex gap-8">
            <a
              href="#"
              class="text-[10px] font-black text-surface-500 hover:text-primary-500 uppercase tracking-[0.3em] transition-all"
              >Protocol</a
            >
            <a
              href="#"
              class="text-[10px] font-black text-surface-500 hover:text-primary-500 uppercase tracking-[0.3em] transition-all"
              >Privacy</a
            >
            <a
              href="#"
              class="text-[12px] font-black text-surface-500 hover:text-primary-500 uppercase tracking-[0.3em] transition-all"
              >Support</a
            >
          </div>
        </div>

        <div class="hidden lg:flex flex-col items-end gap-2">
          <span
            class="text-[7px] font-black text-primary-500/40 uppercase tracking-[0.5em]"
            >System Status</span
          >
          <div class="flex gap-1">
            <div
              v-for="i in 4"
              :key="i"
              class="w-1.5 h-1.5 rounded-full bg-emerald-500/40"
            />
            <div
              class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
body {
  background-color: #020202;
  color: #fff;
  cursor: default;
}

/* Luxury Smooth Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}

/* Custom Scrollbar for Luxury Look */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: #020202;
}
::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.3);
}
</style>
