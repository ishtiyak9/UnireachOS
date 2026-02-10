<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Systems Control | UniReach Intelligence",
});

const { user } = useUserSession();

// Mock System Intelligence Data
const systemLoad = ref(24);
const maintenanceMode = ref(false);
const registrationEnabled = ref(true);

const coreServices = [
  {
    name: "Global Database",
    status: "Operational",
    ping: "12ms",
    icon: "pi pi-database",
    color: "text-emerald-400",
  },
  {
    name: "Object Intelligence",
    status: "Operational",
    ping: "45ms",
    icon: "pi pi-cloud",
    color: "text-blue-400",
  },
  {
    name: "AI Processing Line",
    status: "Optimizing",
    ping: "156ms",
    icon: "pi pi-microchip",
    color: "text-amber-400",
  },
];

const adminActions = [
  { user: "dev@unireach", action: "Updated Schema", date: "10m ago" },
  { user: "system", action: "Automated Backup", date: "1h ago" },
  { user: "official@hq", action: "User Promotion", date: "3h ago" },
];
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6 pb-12">
    <!-- Level 1: System Command & Vitality -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Command Center Header -->
      <div
        class="lg:col-span-2 bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4"
        />

        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <h1
              class="text-2xl font-black text-white uppercase tracking-tighter"
            >
              Systems Control Hub
            </h1>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4">
            <div>
              <p
                class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em] mb-2"
              >
                Cluster Status
              </p>
              <p class="text-sm font-black text-emerald-400 uppercase">
                Active-Redundant
              </p>
            </div>
            <div>
              <p
                class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em] mb-2"
              >
                Node Latency
              </p>
              <p class="text-sm font-black text-white uppercase">0.024ms</p>
            </div>
            <div>
              <p
                class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em] mb-2"
              >
                Active Roles
              </p>
              <p class="text-sm font-black text-white uppercase">
                {{
                  user?.role === "SUPERADMIN" ? "Full Mastery" : "High Official"
                }}
              </p>
            </div>
            <div>
              <p
                class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em] mb-2"
              >
                Encryption
              </p>
              <p class="text-sm font-black text-primary-500 uppercase">
                Quantum-V2
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vitality Metric -->
      <div
        class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative group overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />
        <div class="relative w-28 h-28">
          <svg class="w-full h-full -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-white/5"
            />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-primary-500"
              :style="{
                strokeDasharray: '301.6',
                strokeDashoffset: 301.6 - (301.6 * systemLoad) / 100,
              }"
            />
          </svg>
          <div
            class="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span class="text-3xl font-black text-white leading-none"
              >{{ systemLoad }}%</span
            >
            <span
              class="text-[8px] font-black text-surface-500 uppercase tracking-widest mt-1"
              >Core Load</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Level 2: Command Switches & Integration -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Maintenance Override -->
      <div
        class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:border-amber-500/20 group"
      >
        <div class="flex items-center justify-between mb-8">
          <div
            class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 ring-1 ring-amber-500/20"
          >
            <i class="pi pi-exclamation-triangle text-lg" />
          </div>
          <InputSwitch v-model="maintenanceMode" class="custom-switch" />
        </div>
        <h3
          class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
        >
          Maintenance Mode
        </h3>
        <p class="text-[9px] text-surface-500 font-bold mt-2 leading-relaxed">
          Instantly restrict all public access to the intelligence core.
        </p>
      </div>

      <!-- Registration Lock -->
      <div
        class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:border-primary-500/20 group"
      >
        <div class="flex items-center justify-between mb-8">
          <div
            class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 ring-1 ring-primary-500/20"
          >
            <i class="pi pi-user-plus text-lg" />
          </div>
          <InputSwitch v-model="registrationEnabled" class="custom-switch" />
        </div>
        <h3
          class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
        >
          Public Enrollment
        </h3>
        <p class="text-[9px] text-surface-500 font-bold mt-2 leading-relaxed">
          Toggle the ability for new entities to register in the system.
        </p>
      </div>

      <!-- Purge Operations -->
      <div
        class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:border-rose-500/20 group relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 blur-xl rounded-full translate-x-4 -translate-y-4"
        />
        <div class="flex items-center justify-between mb-8">
          <div
            class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 ring-1 ring-rose-500/20"
          >
            <i class="pi pi-trash text-lg" />
          </div>
          <button
            class="w-8 h-8 rounded-lg bg-rose-500/5 flex items-center justify-center hover:bg-rose-500/20 text-rose-500 transition-all"
          >
            <i class="pi pi-angle-right" />
          </button>
        </div>
        <h3
          class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
        >
          Cache Purge
        </h3>
        <p class="text-[9px] text-surface-500 font-bold mt-2 leading-relaxed">
          Reset all temporary intelligence buffers and cached states.
        </p>
      </div>

      <!-- Advanced Config -->
      <div
        class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-500 hover:border-blue-500/20 group"
      >
        <div class="flex items-center justify-between mb-8">
          <div
            class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 ring-1 ring-blue-500/20"
          >
            <i class="pi pi-cog text-lg" />
          </div>
          <button
            class="px-3 py-1 rounded-lg bg-blue-500/10 text-[8px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20"
          >
            Open JSON
          </button>
        </div>
        <h3
          class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
        >
          Raw Configuration
        </h3>
        <p class="text-[9px] text-surface-500 font-bold mt-2 leading-relaxed">
          Direct access to the system environment parameters.
        </p>
      </div>
    </div>

    <!-- Level 3: Service Health & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Global Service Health -->
      <div
        class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div
          class="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between"
        >
          <h3
            class="text-[11px] font-black text-white uppercase tracking-[0.3em]"
          >
            Neural Service Health
          </h3>
          <span
            class="text-[8px] font-black text-primary-500 uppercase tracking-widest animate-pulse"
            >Syncing...</span
          >
        </div>
        <div class="p-4 space-y-2">
          <div
            v-for="service in coreServices"
            :key="service.name"
            class="flex items-center gap-5 p-4 rounded-2xl bg-surface-950/50 border border-white/[0.02] hover:bg-white/5 transition-all"
          >
            <div
              :class="[
                'w-10 h-10 rounded-xl bg-surface-950 flex items-center justify-center ring-1 ring-white/5 shadow-inner',
                service.color,
              ]"
            >
              <i :class="[service.icon, 'text-sm']" />
            </div>
            <div class="flex-1">
              <div
                class="text-[10px] font-black text-white uppercase tracking-tight"
              >
                {{ service.name }}
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[9px] font-bold text-surface-500">{{
                  service.status
                }}</span>
                <span class="w-1 h-1 rounded-full bg-surface-700" />
                <span class="text-[9px] font-bold text-surface-700">{{
                  service.ping
                }}</span>
              </div>
            </div>
            <div class="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
              <div
                class="h-full bg-linear-to-r from-primary-500 to-transparent w-full opacity-30"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Administrative Audit Intelligence -->
      <div
        class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div class="p-6 border-b border-white/5 bg-white/[0.01]">
          <h3
            class="text-[11px] font-black text-white uppercase tracking-[0.3em]"
          >
            Authority Audit Trail
          </h3>
        </div>
        <div class="p-6">
          <div
            class="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/5"
          >
            <div
              v-for="log in adminActions"
              :key="log.date"
              class="relative flex items-center gap-8 group"
            >
              <div
                class="relative z-10 w-6 h-6 rounded-full bg-surface-950 border border-white/10 flex items-center justify-center group-hover:border-primary-500/30 transition-colors"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-primary-500" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between gap-4">
                  <span
                    class="text-[10px] font-black text-white uppercase tracking-tight"
                    >{{ log.action }}</span
                  >
                  <span
                    class="text-[9px] font-bold text-surface-700 uppercase"
                    >{{ log.date }}</span
                  >
                </div>
                <p
                  class="text-[9px] font-bold text-surface-500 mt-1 uppercase tracking-widest"
                >
                  {{ log.user }}
                </p>
              </div>
            </div>
          </div>
          <button
            class="w-full mt-8 py-3 rounded-2xl text-[9px] font-black text-surface-500 hover:text-white hover:bg-white/5 transition-all border border-white/5 uppercase tracking-[0.4em]"
          >
            Export Full Traceability Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-switch :deep(.p-inputswitch-slider) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  height: 1.25rem !important;
  width: 2.5rem !important;
}

.custom-switch :deep(.p-inputswitch-slider:before) {
  width: 0.75rem !important;
  height: 0.75rem !important;
  margin-top: -0.375rem !important;
  background: #64748b !important;
}

.custom-switch :deep(.p-inputswitch-checked .p-inputswitch-slider) {
  background: #d4af37 !important;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2) !important;
}

.custom-switch :deep(.p-inputswitch-checked .p-inputswitch-slider:before) {
  background: #000 !important;
}
</style>
