<script setup lang="ts">
definePageMeta({
  title: "Applicant Portal",
  layout: "applicant",
  middleware: "auth",
});

const { user } = useUserSession();

// 1. Intelligence State: High-fidelity operational data
const stats = ref({
  profileCompletion: 85,
  totalApplications: 4,
  totalDocuments: 12,
  activeStage: 2, // 0: Enquiry, 1: Application, 2: Verification, 3: Offer, 4: Visa
});

// 2. The Journey: Professional Admission Flight Path
const journeySteps = [
  { label: "Enquiry", icon: "pi pi-search", status: "complete" },
  { label: "Applied", icon: "pi pi-file-edit", status: "complete" },
  { label: "Review", icon: "pi pi-verified", status: "active" },
  { label: "Offer", icon: "pi pi-envelope", status: "pending" },
  { label: "Visa", icon: "pi pi-globe", status: "pending" },
];

// 3. Priority Action: The "Concierge" Focus
const priorityAction = {
  title: "Document Verification",
  desc: "Your academic transcripts are currently being synchronized with the university board.",
  status: "In Progress",
  actionLabel: "View Vault",
  actionTo: "/applicant-portal/documents",
};

// 4. Quick Actions: Tactical Shortcuts
const shortcuts = [
  {
    title: "New Application",
    label: "Expand",
    icon: "pi pi-plus-circle",
    to: "/applicant-portal/applications/new",
    color: "primary",
  },
  {
    title: "Support Hub",
    label: "Concierge",
    icon: "pi pi-comments",
    to: "/support",
    color: "blue",
  },
  {
    title: "Identity Hub",
    label: "Profile",
    icon: "pi pi-user-edit",
    to: "/applicant-portal/profile",
    color: "emerald",
  },
];
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <!-- Background Decor (Identical to Admin Dashboard) -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"
    />
    <div
      class="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"
    />

    <!-- Dashboard Header (Executive Overview Style) -->
    <div
      class="relative flex flex-col md:flex-row md:items-end justify-between gap-4"
    >
      <div class="space-y-1">
        <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
          Applicant
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 italic"
            >Command</span
          >
        </h1>
        <p class="text-surface-400 text-sm font-medium">
          Welcome back, {{ user?.email?.split("@")[0] }}. Here's the state of
          your academic journey.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-bolt"
          label="Test Alerts"
          outlined
          @click="$fetch('/api/test-notification', { method: 'POST' })"
          class="!border-white/10 !text-surface-300 hover:!bg-white/5 !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl"
        />
        <Button
          icon="pi pi-plus"
          label="New Application"
          @click="navigateTo('/applicant-portal/applications/new')"
          class="!bg-linear-to-r !from-primary-500 !to-primary-600 !border-0 !text-black !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/20"
        />
      </div>
    </div>

    <!-- Stats Grid (Identical Card Design) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Profile Completion Card -->
      <div
        class="group relative bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full"
        />
        <div class="relative flex items-start justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500" />
              <span
                class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
                >Scholar Profile</span
              >
            </div>
            <div class="space-y-1">
              <div
                class="text-3xl font-black text-white leading-none tracking-tight"
              >
                {{ stats.profileCompletion }}%
              </div>
              <div class="flex items-center gap-1.5 pt-1">
                <span class="text-emerald-400 text-[11px] font-bold"
                  >Elite Standing</span
                >
                <span
                  class="text-surface-500 text-[10px] uppercase font-bold tracking-tighter"
                  >verified</span
                >
              </div>
            </div>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
          >
            <i class="pi pi-verified text-black text-lg font-bold" />
          </div>
        </div>
      </div>

      <!-- Active Applications Card -->
      <div
        class="group relative bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full"
        />
        <div class="relative flex items-start justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary-500" />
              <span
                class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
                >Active Sync Nodes</span
              >
            </div>
            <div class="space-y-1">
              <div
                class="text-3xl font-black text-white leading-none tracking-tight"
              >
                0{{ stats.totalApplications }}
              </div>
              <div class="flex items-center gap-1.5 pt-1">
                <span class="text-primary-400 text-[11px] font-bold"
                  >Processing</span
                >
                <span
                  class="text-surface-500 text-[10px] uppercase font-bold tracking-tighter"
                  >real-time</span
                >
              </div>
            </div>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
          >
            <i class="pi pi-compass text-black text-lg font-bold" />
          </div>
        </div>
      </div>

      <!-- Documents Card -->
      <div
        class="group relative bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300"
      >
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500 rounded-full"
        />
        <div class="relative flex items-start justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-500" />
              <span
                class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
                >Secure Archive</span
              >
            </div>
            <div class="space-y-1">
              <div
                class="text-3xl font-black text-white leading-none tracking-tight"
              >
                {{ stats.totalDocuments }}
              </div>
              <div class="flex items-center gap-1.5 pt-1">
                <span class="text-blue-400 text-[11px] font-bold"
                  >Vault Tokens</span
                >
                <span
                  class="text-surface-500 text-[10px] uppercase font-bold tracking-tighter"
                  >encrypted</span
                >
              </div>
            </div>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
          >
            <i class="pi pi-box text-black text-lg font-bold" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Section (8/4 Split) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: journey Timeline -->
      <div
        class="lg:col-span-8 bg-surface-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl space-y-8"
      >
        <div
          class="flex items-center justify-between border-b border-white/5 pb-4"
        >
          <div class="space-y-1">
            <h3 class="text-lg font-black text-white uppercase tracking-tight">
              Application Journey
            </h3>
            <p class="text-xs text-surface-400 font-medium italic">
              Navigating the 2026 Academic Flight Path
            </p>
          </div>
          <span
            class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-[8px] font-black text-primary-500 uppercase tracking-widest animate-pulse"
            >Live Tracking</span
          >
        </div>

        <div class="relative py-12 px-2">
          <!-- Journey Progress Line -->
          <div
            class="absolute top-[3.7rem] left-0 w-full h-[1px] bg-white/10"
          />
          <div
            class="absolute top-[3.7rem] left-0 h-[2px] bg-primary-500 transition-all duration-1000 shadow-[0_0_15px_rgba(var(--p-primary-500),0.4)]"
            :style="{
              width: `${
                (stats.activeStage / (journeySteps.length - 1)) * 100
              }%`,
            }"
          />

          <div class="grid grid-cols-5 relative">
            <div
              v-for="(step, idx) in journeySteps"
              :key="step.label"
              class="flex flex-col items-center gap-6 group"
            >
              <div
                class="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10"
                :class="[
                  step.status === 'complete'
                    ? 'bg-primary-500 border-primary-500 text-black'
                    : step.status === 'active'
                    ? 'bg-black border-primary-500 text-primary-500 shadow-[0_0_20px_rgba(var(--p-primary-500),0.3)] scale-110'
                    : 'bg-surface-950 border-white/10 text-white/20',
                ]"
              >
                <i :class="[step.icon, 'text-xs md:text-lg font-bold']" />
                <div
                  v-if="step.status === 'active'"
                  class="absolute inset-0 bg-primary-500/20 rounded-full animate-ping"
                />
              </div>
              <div class="text-center space-y-1">
                <p
                  class="text-[8px] md:text-[10px] font-black uppercase tracking-widest"
                  :class="
                    step.status === 'pending' ? 'text-white/20' : 'text-white'
                  "
                >
                  {{ step.label }}
                </p>
                <span
                  class="text-[7px] font-bold text-surface-500 uppercase block tracking-tighter"
                  >{{ step.status }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Priority & Shortcuts -->
      <aside class="lg:col-span-4 space-y-6">
        <!-- Priority Directive (High Contrast) -->
        <div
          class="relative p-8 rounded-3xl bg-linear-to-br from-primary-500 to-primary-700 text-black overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform duration-500"
        >
          <div
            class="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000"
          >
            <i class="pi pi-shield text-9xl font-bold" />
          </div>
          <div class="relative space-y-6">
            <div class="space-y-1">
              <span
                class="text-[8px] font-black uppercase tracking-widest opacity-60"
                >Priority Directive</span
              >
              <h3
                class="text-2xl font-black uppercase tracking-tighter leading-none italic"
              >
                {{ priorityAction.title }}
              </h3>
            </div>
            <p
              class="text-[10px] font-bold leading-relaxed opacity-80 uppercase"
            >
              {{ priorityAction.desc }}
            </p>
            <button
              @click="navigateTo(priorityAction.actionTo)"
              class="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300"
            >
              {{ priorityAction.actionLabel }}
              <i class="pi pi-arrow-right text-[8px]" />
            </button>
          </div>
        </div>

        <!-- Shortcuts List (Identical to Admin Menu Styling) -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
        >
          <h3
            class="text-[10px] font-black text-white uppercase tracking-widest mb-6 italic opacity-40 px-2"
          >
            Tactical Control Hub
          </h3>
          <div class="space-y-3">
            <NuxtLink
              v-for="card in shortcuts"
              :key="card.title"
              :to="card.to"
              class="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary-500/30 transition-all duration-300"
            >
              <div class="flex items-center gap-4">
                <div
                  :class="`w-9 h-9 rounded-xl bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-500 group-hover:scale-110 transition-transform`"
                >
                  <i :class="card.icon" class="text-xs" />
                </div>
                <div>
                  <h4
                    class="text-[10px] font-black text-white uppercase tracking-widest"
                  >
                    {{ card.title }}
                  </h4>
                  <p
                    class="text-[8px] font-black text-surface-500 uppercase italic"
                  >
                    {{ card.label }}
                  </p>
                </div>
              </div>
              <i
                class="pi pi-chevron-right text-[8px] text-white/20 group-hover:text-primary-500 transition-all font-bold"
              />
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>

    <!-- Bottom Section: Infrastructure Status (Identical to Admin Dashboard) -->
    <div
      class="bg-gradient-to-r from-surface-900/60 to-surface-800/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div class="flex items-center gap-5">
        <div
          class="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        >
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div>
          <h4
            class="text-xs font-black text-white uppercase tracking-widest italic"
          >
            Institutional Trust Node
          </h4>
          <p
            class="text-[10px] text-surface-500 font-medium mt-1 tracking-tight"
          >
            All verification systems operational. Response time:
            <span class="text-emerald-400">88ms</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-8 px-4">
        <div class="text-center">
          <div
            class="text-[9px] font-black text-white uppercase tracking-widest"
          >
            Cloud Sync
          </div>
          <div class="text-emerald-400 text-[10px] font-bold uppercase mt-1">
            Active
          </div>
        </div>
        <div class="text-center border-l border-white/10 pl-8">
          <div
            class="text-[9px] font-black text-white uppercase tracking-widest"
          >
            Vault Security
          </div>
          <div class="text-emerald-400 text-[10px] font-bold uppercase mt-1">
            Shielded
          </div>
        </div>
        <div class="text-center border-l border-white/10 pl-8">
          <div
            class="text-[9px] font-black text-white uppercase tracking-widest"
          >
            Uptime
          </div>
          <div class="text-white text-[10px] font-bold uppercase mt-1">
            99.99%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Simplified Luxury Styles */
.backdrop-blur-xl {
  backdrop-filter: blur(40px) saturate(180%);
}

h1,
h2,
h3,
h4 {
  font-family: "Outfit", "Inter", sans-serif;
}
</style>
