<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

// Page title
useHead({
  title: "Analytics Dashboard | UniReach OS",
});

const { user } = useUserSession();

const stats = [
  {
    label: "Total Applications",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: "pi pi-file-edit",
    color: "from-blue-500 to-indigo-600",
  },
  {
    label: "Pending Review",
    value: "42",
    change: "-3.2%",
    trend: "down",
    icon: "pi pi-clock",
    color: "from-amber-400 to-orange-500",
  },
  {
    label: "Approved",
    value: "912",
    change: "+8.1%",
    trend: "up",
    icon: "pi pi-check-circle",
    color: "from-emerald-400 to-teal-600",
  },
  {
    label: "Total Revenue",
    value: "$125.4K",
    change: "+15.3%",
    trend: "up",
    icon: "pi pi-dollar",
    color: "from-fuchsia-500 to-purple-600",
  },
];

const recentApplications = [
  {
    id: 1,
    name: "John Doe",
    type: "Student",
    status: "PENDING",
    date: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Smith",
    type: "Student",
    status: "APPROVED",
    date: "5 hours ago",
  },
  {
    id: 3,
    name: "Global Travel Inc",
    type: "Agent",
    status: "ACTIVE",
    date: "Yesterday",
  },
  {
    id: 4,
    name: "Michael Chen",
    type: "Expatriate",
    status: "REVIEW",
    date: "2 days ago",
  },
];
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <!-- Background Decor -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"
    />
    <div
      class="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"
    />

    <!-- Dashboard Header -->
    <div
      class="relative flex flex-col md:flex-row md:items-end justify-between gap-4"
    >
      <div class="space-y-1">
        <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
          Executive
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"
            >Overview</span
          >
        </h1>
        <p class="text-surface-400 text-sm font-medium">
          Welcome back, {{ user?.profile?.firstName || "Admin" }}. Here's the
          pulse of UniReach today.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Privileged Access: Control & Governance -->
        <div
          v-if="['super_admin', 'developer'].includes(user?.roleCode || '')"
          class="flex gap-3"
        >
          <NuxtLink to="/dashboard/authority">
            <Button
              icon="pi pi-shield"
              label="Governance"
              class="!bg-linear-to-r !from-primary-400 !to-primary-600 !border-0 !text-black !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/10"
            />
          </NuxtLink>
          <NuxtLink to="/dashboard/settings">
            <Button
              icon="pi pi-sliders-h"
              label="Control Hub"
              class="!bg-surface-800 !border-white/10 !text-white !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl hover:!bg-surface-700"
            />
          </NuxtLink>
        </div>

        <Button
          icon="pi pi-download"
          label="Export Report"
          outlined
          severity="secondary"
          class="!border-white/10 !text-surface-300 hover:!bg-white/5 !text-xs font-bold uppercase tracking-wider px-4 rounded-xl"
        />
        <Button
          icon="pi pi-plus"
          label="Add Record"
          class="!bg-linear-to-r !from-primary-500 !to-primary-600 !border-0 !text-black !text-xs font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/20"
        />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="group relative bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300"
      >
        <!-- Card Interior Glow -->
        <div
          :class="[
            'absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full',
            stat.color,
          ]"
        />

        <div class="relative flex items-start justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div
                :class="['w-2 h-2 rounded-full bg-gradient-to-r', stat.color]"
              />
              <span
                class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
                >{{ stat.label }}</span
              >
            </div>

            <div class="space-y-1">
              <div
                class="text-3xl font-black text-white leading-none tracking-tight"
              >
                {{ stat.value }}
              </div>
              <div class="flex items-center gap-1.5 pt-1">
                <span
                  :class="[
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400',
                    'text-[11px] font-bold',
                  ]"
                >
                  {{ stat.change }}
                </span>
                <span
                  class="text-surface-500 text-[10px] uppercase font-bold tracking-tighter"
                  >vs last month</span
                >
              </div>
            </div>
          </div>

          <div
            :class="[
              'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300',
              stat.color,
            ]"
          >
            <i :class="[stat.icon, 'text-black text-lg font-bold']" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Performance Analytics (Chart Placeholder) -->
      <div
        class="lg:col-span-8 bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
      >
        <div class="flex items-center justify-between mb-8">
          <div class="space-y-1">
            <h3 class="text-lg font-black text-white uppercase tracking-tight">
              Performance Analytics
            </h3>
            <p class="text-xs text-surface-400 font-medium">
              Global application intake vs Approval rate
            </p>
          </div>
          <div
            class="flex bg-surface-950/50 p-1 rounded-xl border border-white/5"
          >
            <button
              class="px-3 py-1 text-[10px] font-bold text-black bg-primary-500 rounded-lg"
            >
              Real-time
            </button>
            <button
              class="px-3 py-1 text-[10px] font-bold text-surface-400 hover:text-white transition-colors"
            >
              Historical
            </button>
          </div>
        </div>

        <div
          class="h-[320px] flex items-center justify-center relative group overflow-hidden rounded-2xl bg-surface-950/30 border border-white/5"
        >
          <!-- Decorative Chart Elements (Simulated) -->
          <div class="absolute inset-0 opacity-20 pointer-events-none">
            <div
              class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-500/20 to-transparent"
            />
            <!-- Simulated Grid Lines -->
            <div class="grid grid-cols-6 h-full w-full">
              <div
                v-for="i in 6"
                :key="i"
                class="border-r border-white/5 h-full"
              />
            </div>
          </div>

          <div
            class="relative z-10 flex flex-col items-center gap-4 text-center px-10"
          >
            <div
              class="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center"
            >
              <i class="pi pi-chart-bar text-primary-500 text-2xl" />
            </div>
            <div>
              <p
                class="text-white font-black uppercase text-xs tracking-widest"
              >
                Analytics Module Loading
              </p>
              <p class="text-surface-500 text-[10px] mt-2 max-w-xs">
                Integrating real-time application data flows for instant
                business intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions / Activity -->
      <div
        class="lg:col-span-4 bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
      >
        <h3 class="text-lg font-black text-white uppercase tracking-tight mb-6">
          Live Activity
        </h3>

        <div class="space-y-6">
          <div
            v-for="app in recentApplications"
            :key="app.id"
            class="relative pl-8 pb-6 last:pb-0 border-l border-white/10"
          >
            <!-- Timeline Dot -->
            <div
              class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(var(--p-primary-500),0.5)]"
            />

            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-white uppercase">{{
                  app.name
                }}</span>
                <span class="text-[9px] font-bold text-surface-500 uppercase">{{
                  app.date
                }}</span>
              </div>
              <p class="text-[10px] text-surface-400 font-medium">
                New {{ app.type }} application submitted via portal.
              </p>
              <div class="pt-2 flex items-center gap-2">
                <span
                  class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black text-primary-400 uppercase tracking-wider"
                >
                  {{ app.status }}
                </span>
                <button
                  class="text-[9px] font-bold text-surface-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Review Details →
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          class="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all"
        >
          View All Activity
        </button>
      </div>
    </div>

    <!-- Bottom Section: Detailed Stats / System Health -->
    <div
      class="bg-gradient-to-r from-surface-900/60 to-surface-800/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div class="flex items-center gap-5">
        <div
          class="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
        >
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div>
          <h4 class="text-sm font-black text-white uppercase tracking-widest">
            Infrastructure Status
          </h4>
          <p class="text-[10px] text-surface-500 font-medium mt-1">
            All systems operational. Global response time:
            <span class="text-emerald-400">124ms</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-8">
        <div class="text-center">
          <div class="text-xs font-black text-white uppercase tracking-widest">
            Databases
          </div>
          <div class="text-emerald-400 text-[10px] font-bold uppercase mt-1">
            Synchronized
          </div>
        </div>
        <div class="text-center border-l border-white/10 pl-8">
          <div class="text-xs font-black text-white uppercase tracking-widest">
            Security
          </div>
          <div class="text-emerald-400 text-[10px] font-bold uppercase mt-1">
            Shield Active
          </div>
        </div>
        <div class="text-center border-l border-white/10 pl-8">
          <div class="text-xs font-black text-white uppercase tracking-widest">
            Uptime
          </div>
          <div class="text-white text-[10px] font-bold uppercase mt-1">
            99.98%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom typography sizing for ultra-premium look */
h1,
h2,
h3,
h4 {
  font-family: "Outfit", "Inter", sans-serif;
}

.pi {
  font-weight: 900 !important;
}

/* Glass effect refinements */
.backdrop-blur-xl {
  backdrop-filter: blur(24px) saturate(180%);
}
</style>
