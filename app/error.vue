<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/dashboard" });
</script>

<template>
  <div
    class="min-h-screen bg-surface-950 font-sans selection:bg-primary-500/30 flex items-center justify-center p-6 relative overflow-hidden"
  >
    <!-- Orbital Background Architecture -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse"
      />
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"
        style="animation-delay: 2s"
      />
      <div
        class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
      />
    </div>

    <div class="max-w-xl w-full relative">
      <!-- High-Authority Numeric Badge -->
      <div class="relative mb-12 flex justify-center">
        <div
          class="text-[180px] font-black text-white/5 leading-none select-none tracking-tighter italic"
        >
          {{ error.statusCode }}
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-24 h-24 rounded-3xl bg-surface-900 border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group"
          >
            <div
              class="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <i
              class="pi pi-exclamation-triangle text-3xl text-primary-500 animate-bounce"
            />
          </div>
        </div>
      </div>

      <!-- Core Message -->
      <div class="text-center space-y-6">
        <div class="space-y-2">
          <h1
            class="text-4xl font-black text-white uppercase tracking-tighter italic"
          >
            Neural Access Breakdown
          </h1>
          <p
            class="text-[10px] font-bold text-surface-500 uppercase tracking-[0.5em]"
          >
            Protocol Status:
            {{
              error.statusCode === 404
                ? "Resource Not Found"
                : error.statusCode === 503
                ? "System Maintenance"
                : "System Exception"
            }}
          </p>
        </div>

        <div v-if="error.statusCode === 503" class="space-y-4">
          <p
            class="text-sm text-surface-400 leading-relaxed max-w-sm mx-auto font-medium"
          >
            {{
              error.message ||
              "The platform is currently undergoing a structural update to improve your experience. We will be back online shortly."
            }}
          </p>
          <div
            v-if="error.data?.endTime"
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20"
          >
            <i class="pi pi-clock text-[10px] text-primary-500" />
            <span
              class="text-[9px] font-black text-primary-400 uppercase tracking-widest"
            >
              Estimated Completion:
              {{ new Date(error.data.endTime).toLocaleTimeString() }}
            </span>
          </div>
        </div>

        <p
          v-else
          class="text-sm text-surface-400 leading-relaxed max-w-sm mx-auto font-medium"
        >
          {{
            error.statusMessage ||
            "The requested data vertex has been relocated or the authorization bridge has collapsed. Return to secure territory."
          }}
        </p>

        <!-- Command Actions -->
        <div
          class="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            @click="handleError"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary-500 text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <i class="pi pi-home" />
            Secure Return
          </button>

          <NuxtLink
            to="/support"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface-900 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 hover:text-white hover:border-white/10 transition-all flex items-center justify-center gap-3"
          >
            <i class="pi pi-info-circle text-xs" />
            Report Anomaly
          </NuxtLink>
        </div>
      </div>

      <!-- Footer Telemetry -->
      <div
        class="mt-20 border-t border-white/5 pt-8 flex items-center justify-between px-2"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"
          />
          <span
            class="text-[8px] font-black text-surface-600 uppercase tracking-widest"
            >UniReach Enterprise OS v2.0</span
          >
        </div>
        <div
          class="text-[8px] font-black text-surface-600 uppercase tracking-widest"
        >
          Ref: {{ Math.random().toString(36).substring(7).toUpperCase() }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");

html,
body {
  margin: 0;
  padding: 0;
  background: #050505;
  font-family: "Outfit", sans-serif;
}
</style>
