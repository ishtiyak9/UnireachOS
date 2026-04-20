<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formatDistanceToNow } from "date-fns";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

// Page title
useHead({
  title: "Analytics Dashboard | UniReach OS",
});

const { user } = useUserSession();

const isLoading = ref(true);
const systemStats = ref([]);
const leadStats = ref([]);
const inventoryStats = ref([]);
const recentApplications = ref([]);

// Fetch Real-time Intelligence
const refreshDashboard = async () => {
  isLoading.value = true;
  try {
    const { data } = await $fetch("/api/dashboard/stats");
    systemStats.value = data.system;
    leadStats.value = data.leads;
    inventoryStats.value = data.inventory;
    recentApplications.value = data.recentActivity;
  } catch (error) {
    console.error("Critical Failure in Intelligence Harvesting:", error);
  } finally {
    isLoading.value = false;
  }
};

const getRelativeTime = (date: string) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (e) {
    return "just now";
  }
};

onMounted(() => {
  refreshDashboard();
});
</script>

<template>
  <div class="relative space-y-6 pb-6">
    <!-- Background Decor -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"
    />
    <div
      class="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"
    />

    <!-- Dashboard Header (Condensed) -->
    <div
      class="relative flex flex-col md:flex-row md:items-end justify-between gap-4"
    >
      <div class="space-y-0.5">
        <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight">
          Executive
          <span
            class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600"
            >Overview</span
          >
        </h1>
        <p class="text-surface-400 text-xs font-medium">
          Welcome back, {{ user?.profile?.firstName || "Admin" }}.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Privileged Access: Control & Governance -->
        <div
          v-if="['super_admin', 'developer'].includes(user?.roleCode || '')"
          class="flex gap-2"
        >
          <NuxtLink to="/dashboard/authority">
            <Button
              icon="pi pi-shield"
              label="Gov"
              class="bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! text-[9px]! font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg shadow-primary-500/10"
            />
          </NuxtLink>
        </div>

        <DashboardIntelligenceExport
          :data="recentApplications"
          :columns="[
            { field: 'name', header: 'Candidate' },
            { field: 'type', header: 'Entity Type' },
            { field: 'status', header: 'Status' },
            { field: 'date', header: 'Submission Time' },
          ]"
          file-name="unireach-summary"
          label="Export"
          report-title="Intelligence Summary"
          class="scale-90 origin-right"
        />
        <Button
          icon="pi pi-plus"
          label="Add"
          class="bg-linear-to-r! from-primary-500! to-primary-600! border-0! text-black! text-[9px]! font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg shadow-primary-500/20"
        />
      </div>
    </div>

    <!-- ROW 1: System Core -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <h2 class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
          Operational Core
        </h2>
        <div class="flex-1 h-px bg-white/5"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-if="isLoading">
          <div
            v-for="i in 4"
            :key="i"
            class="bg-surface-900/40 border border-white/5 rounded-2xl p-4 h-24 animate-pulse"
          />
        </template>
        <template v-else>
          <component
            :is="stat.to ? 'NuxtLink' : 'div'"
            v-for="stat in systemStats"
            :key="stat.label"
            :to="stat.to"
            class="group relative bg-surface-900/40 border border-white/5 rounded-2xl p-3.5 backdrop-blur-xl hover:border-white/10 transition-all duration-300 block no-underline"
          >
            <div
              :class="[
                'absolute top-0 right-0 w-16 h-16 bg-linear-to-br opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-full',
                stat.color,
              ]"
            />
            <div class="relative flex items-center justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <div
                    :class="['w-1.5 h-1.5 rounded-full bg-linear-to-r', stat.color]"
                  />
                  <span
                    class="text-[9px] font-black text-surface-400 uppercase tracking-widest"
                    >{{ stat.label }}</span
                  >
                </div>
                <div class="space-y-0.5">
                  <div class="text-xl font-black text-white tracking-tight">
                    {{ stat.value }}
                  </div>
                  <div class="text-emerald-400 text-[9px] font-bold">
                    {{ stat.change }}
                  </div>
                </div>
              </div>
              <div
                :class="[
                  'w-9 h-9 rounded-xl bg-linear-to-br flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300',
                  stat.color,
                ]"
              >
                <i :class="[stat.icon, 'text-black text-sm font-black']" />
              </div>
            </div>
          </component>
        </template>
      </div>
    </div>

    <!-- ROW 2: Leads -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <h2 class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
          Lead Acquisition
        </h2>
        <div class="flex-1 h-px bg-white/5"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <template v-if="isLoading">
          <div
            v-for="i in 4"
            :key="i"
            class="bg-surface-900/40 border border-white/5 rounded-2xl p-4 h-24 animate-pulse"
          />
        </template>
        <template v-else>
          <component
            :is="stat.to ? 'NuxtLink' : 'div'"
            v-for="stat in leadStats"
            :key="stat.label"
            :to="stat.to"
            class="group relative bg-surface-900/40 border border-white/5 rounded-2xl p-3.5 backdrop-blur-xl hover:border-white/10 transition-all duration-300 block no-underline"
          >
            <div class="relative flex items-center justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <div
                    :class="['w-1.5 h-1.5 rounded-full bg-linear-to-r', stat.color]"
                  />
                  <span
                    class="text-[9px] font-black text-surface-400 uppercase tracking-widest"
                    >{{ stat.label }}</span
                  >
                </div>
                <div class="space-y-0.5">
                  <div class="text-xl font-black text-white tracking-tight">
                    {{ stat.value }}
                  </div>
                  <div class="text-emerald-400 text-[9px] font-bold">
                    {{ stat.change }}
                  </div>
                </div>
              </div>
              <div
                :class="[
                  'w-9 h-9 rounded-xl bg-linear-to-br flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300',
                  stat.color,
                ]"
              >
                <i :class="[stat.icon, 'text-black text-sm font-black']" />
              </div>
            </div>
          </component>
        </template>
      </div>
    </div>

    <!-- ROW 3: Inventory -->
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <h2 class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
          Intelligence Registry
        </h2>
        <div class="flex-1 h-px bg-white/5"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-if="isLoading">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-surface-900/40 border border-white/5 rounded-2xl p-4 h-24 animate-pulse"
          />
        </template>
        <template v-else>
          <component
            :is="stat.to ? 'NuxtLink' : 'div'"
            v-for="stat in inventoryStats"
            :key="stat.label"
            :to="stat.to"
            class="group relative bg-surface-900/40 border border-white/5 rounded-2xl p-3.5 backdrop-blur-xl hover:border-white/10 transition-all duration-300 block no-underline"
          >
            <div class="relative flex items-center justify-between">
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <div
                    :class="['w-1.5 h-1.5 rounded-full bg-linear-to-r', stat.color]"
                  />
                  <span
                    class="text-[9px] font-black text-surface-400 uppercase tracking-widest"
                    >{{ stat.label }}</span
                  >
                </div>
                <div class="space-y-0.5">
                  <div class="text-xl font-black text-white tracking-tight">
                    {{ stat.value }}
                  </div>
                  <div class="text-emerald-400 text-[9px] font-bold">
                    {{ stat.change }}
                  </div>
                </div>
              </div>
              <div
                :class="[
                  'w-9 h-9 rounded-xl bg-linear-to-br flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300',
                  stat.color,
                ]"
              >
                <i :class="[stat.icon, 'text-black text-sm font-black']" />
              </div>
            </div>
          </component>
        </template>
      </div>
    </div>

    <!-- Main Content Section (Activity) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Performance Analytics -->
      <div
        class="lg:col-span-8 bg-surface-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="space-y-0.5">
            <h3 class="text-sm font-black text-white uppercase tracking-tight">
              Performance
            </h3>
            <p class="text-[10px] text-surface-400 font-medium">
              Real-time approval rate tracking.
            </p>
          </div>
          <div class="flex bg-surface-950/50 p-0.5 rounded-lg border border-white/5">
            <button class="px-2 py-0.5 text-[9px] font-bold text-black bg-primary-500 rounded-md">Real-time</button>
            <button class="px-2 py-0.5 text-[9px] font-bold text-surface-400">History</button>
          </div>
        </div>
        <div class="h-[180px] flex items-center justify-center relative rounded-xl bg-surface-950/30 border border-white/5 overflow-hidden">
          <div class="absolute inset-0 opacity-10 pointer-events-none">
             <div class="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-primary-500/20 to-transparent" />
          </div>
          <div class="relative z-10 flex flex-col items-center gap-2 text-center px-4">
            <i class="pi pi-chart-bar text-primary-500 text-xl" />
            <p class="text-white font-black uppercase text-[10px] tracking-widest">
              Live Analytics Engaged
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Activity -->
      <div
        class="lg:col-span-4 bg-surface-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-black text-white uppercase tracking-tight">
            Activity
          </h3>
          <Button
            icon="pi pi-refresh"
            class="p-button-text p-button-sm text-surface-400! p-0!"
            @click="refreshDashboard"
          />
        </div>

        <div class="space-y-4 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
          <template v-if="isLoading">
            <div v-for="i in 3" :key="i" class="flex gap-3">
              <div class="w-1.5 h-10 bg-white/5 rounded-full animate-pulse"></div>
              <div class="flex-1 space-y-1">
                <div class="h-2.5 w-20 bg-white/5 rounded"></div>
                <div class="h-2 w-full bg-white/5 rounded"></div>
              </div>
            </div>
          </template>
          <div
            v-for="app in recentApplications"
            :key="app.id"
            class="relative pl-6 pb-4 last:pb-0 border-l border-white/10"
          >
            <div class="absolute -left-[4px] top-0 w-1.5 h-1.5 rounded-full bg-primary-500" />
            <div class="space-y-0.5">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-white uppercase truncate max-w-[120px]">{{ app.name }}</span>
                <span class="text-[8px] font-bold text-surface-500 uppercase">{{ getRelativeTime(app.createdAt) }}</span>
              </div>
              <p class="text-[9px] text-surface-400 font-medium">New {{ app.type.toLowerCase() }} app.</p>
              <div class="pt-1 flex items-center gap-2">
                <span class="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[7px] font-black text-primary-400 uppercase">{{ app.status }}</span>
                <NuxtLink :to="`/dashboard/applications/${app.id}`" class="text-[7px] font-bold text-surface-500 uppercase">Details →</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Health Footer (Ultra Condensed) -->
    <div class="bg-linear-to-r from-surface-900/60 to-surface-800/40 border border-white/5 rounded-2xl p-3 backdrop-blur-xl flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <p class="text-[8px] text-surface-500 font-bold uppercase tracking-widest">Systems Active: <span class="text-emerald-400">124ms</span></p>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-[8px] font-black text-white/40 uppercase tracking-widest">Shield Active</div>
        <div class="text-[8px] font-black text-white uppercase tracking-widest border-l border-white/10 pl-4">v4.3.0 Rev B</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1, h2, h3, h4 { font-family: "Outfit", "Inter", sans-serif; }
.pi { font-weight: 900 !important; }
.backdrop-blur-xl { backdrop-filter: blur(24px) saturate(180%); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>
