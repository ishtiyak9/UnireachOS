<script setup lang="ts">
definePageMeta({
  title: "Applicant Portal",
  layout: "applicant",
  middleware: "auth",
});

const { user } = useUserSession();

// 1. Unified Profile Intelligence
const { completionPercentage } = useProfile();

// Fetch Tactical Intelligence Summary
const { data: summary, pending } = await useFetch(
  "/api/applicant/dashboard-summary"
);

// 2. Intelligence State: High-fidelity operational data
const stats = computed(() => ({
  profileCompletion: completionPercentage.value || 0,
  totalApplications: summary.value?.stats?.totalApplications || 0,
  totalDocuments: summary.value?.stats?.totalDocuments || 0,
  activeStage: summary.value?.stats?.activeStage || 0, // 0: Start, 1: Applied, 2: Review, 3: Offer, 4: Visa
}));

// 2. The Journey: Professional Admission Flight Path
const journeySteps = [
  { label: "Start", icon: "pi pi-info-circle" },
  { label: "Applied", icon: "pi pi-file-edit" },
  { label: "Review", icon: "pi pi-verified" },
  { label: "Offer", icon: "pi pi-envelope" },
  { label: "Visa", icon: "pi pi-globe" },
];

const getStepStatus = (idx: number) => {
  if (idx < stats.value.activeStage) return "complete";
  if (idx === stats.value.activeStage) return "active";
  return "pending";
};

// 3. Priority Action: The "Concierge" Focus
const priorityAction = computed(
  () =>
    summary.value?.priorityAction || {
      title: "Awaiting Intel",
      desc: "Synchronizing with the global registry...",
      status: "Loading",
      actionLabel: "Please wait",
      actionTo: "/",
    }
);

// 4. Quick Actions: Tactical Shortcuts
const shortcuts = [
  {
    title: "New Application",
    label: "Expand",
    icon: "pi pi-plus-circle",
    to: "/applicant-portal/courses-finder",
    color: "primary",
  },
  {
    title: "Document Vault",
    label: "Verify",
    icon: "pi pi-box",
    to: "/applicant-portal/documents",
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
          Applicant
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 italic"
            >Command</span
          >
        </h1>
        <p class="text-surface-400 text-sm font-medium">
          Welcome back, {{ user?.email?.split("@")[0] }}. Accessing academic
          tactical status.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Counselor Card -->
        <div
          v-if="summary?.assignedStaff"
          class="flex items-center gap-2.5 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-xl backdrop-blur-md group hover:bg-primary-500/20 transition-all cursor-default"
        >
          <div class="relative">
            <Avatar
              :label="summary.assignedStaff.firstName[0]"
              shape="circle"
              class="w-7 h-7 bg-primary-500/20! text-primary-500! font-black! text-[10px]!"
            />
            <div
              class="absolute -right-0.5 -bottom-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-black animate-pulse"
            />
          </div>
          <div class="flex flex-col">
            <span
              class="text-[8px] font-black text-surface-500 uppercase tracking-widest leading-none mb-0.5"
              >Assigned Counselor</span
            >
            <span
              class="text-[10px] font-black text-white uppercase italic tracking-tight"
              >{{ summary.assignedStaff.firstName }}
              {{ summary.assignedStaff.lastName }}</span
            >
          </div>
        </div>

        <Button
          icon="pi pi-search"
          label="Course Search"
          @click="navigateTo('/applicant-portal/courses-finder')"
          class="!border-white/10 !text-surface-300 hover:!bg-white/5 !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl"
        />
        <Button
          icon="pi pi-plus"
          label="Launch Admission"
          @click="navigateTo('/applicant-portal/courses-finder')"
          class="!bg-linear-to-r !from-primary-500 !to-primary-600 !border-0 !text-black !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/20"
        />
      </div>
    </div>

    <!-- Loading Shimmer -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton v-for="i in 3" :key="i" height="120px" border-radius="24px" />
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Profile Completion Card -->
      <div
        class="group relative bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300 flex items-center justify-center"
      >
        <ProfileCompletionGauge />
      </div>

      <!-- Active Missions Card -->
      <div
        class="group relative bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300"
      >
        <div class="relative flex items-start justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-primary-500" />
              <span
                class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em]"
                >Active Missions</span
              >
            </div>
            <div class="space-y-1">
              <div
                class="text-3xl font-black text-white leading-none tracking-tight"
              >
                0{{ stats.totalApplications }}
              </div>
              <div class="flex items-center gap-1.5 pt-1">
                <span class="text-primary-400 text-[10px] font-bold"
                  >PROGRAM TRACKING</span
                >
              </div>
            </div>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/20 transition-all"
          >
            <i class="pi pi-compass text-primary-500 text-lg" />
          </div>
        </div>
      </div>

      <!-- Vault Tokens Card -->
      <div
        class="group relative bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300"
      >
        <div class="relative flex items-start justify-between">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span
                class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em]"
                >Secure Vault</span
              >
            </div>
            <div class="space-y-1">
              <div
                class="text-3xl font-black text-white leading-none tracking-tight"
              >
                {{ stats.totalDocuments }}
              </div>
              <div class="flex items-center gap-1.5 pt-1">
                <span class="text-blue-400 text-[10px] font-bold"
                  >VERIFIED DOCUMENTS</span
                >
              </div>
            </div>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-all"
          >
            <i class="pi pi-box text-blue-500 text-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Section (8/4 Split) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
      <!-- Left Column: journey Timeline & Instructions -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Academic Flight Path (Shrinked Height) -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl space-y-4"
        >
          <div
            class="flex items-center justify-between border-b border-white/5 pb-4"
          >
            <div class="space-y-1">
              <h3
                class="text-sm font-black text-white uppercase tracking-tight italic"
              >
                Academic Flight Path
              </h3>
            </div>
            <div
              class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10"
            >
              <div class="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span
                class="text-[7px] font-black text-white uppercase tracking-widest"
                >Real-time Sync</span
              >
            </div>
          </div>

          <div class="relative py-8 px-2">
            <!-- Journey Progress Line -->
            <div
              class="absolute top-[2.7rem] left-0 w-full h-[1px] bg-white/5"
            />
            <div
              class="absolute top-[2.7rem] left-0 h-[1px] bg-linear-to-r from-primary-500 to-primary-600 transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
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
                class="flex flex-col items-center gap-4 group"
              >
                <div
                  class="w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-700 relative z-10"
                  :class="[
                    getStepStatus(idx) === 'complete'
                      ? 'bg-primary-500 border-primary-500 text-black shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                      : getStepStatus(idx) === 'active'
                      ? 'bg-surface-950 border-primary-500 text-primary-500 scale-110 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      : 'bg-surface-950 border-white/10 text-surface-600',
                  ]"
                >
                  <i :class="[step.icon, 'text-[10px] md:text-sm font-bold']" />
                </div>
                <p
                  class="text-[7px] md:text-[8px] font-black uppercase tracking-widest"
                  :class="
                    getStepStatus(idx) === 'pending'
                      ? 'text-surface-600'
                      : 'text-white'
                  "
                >
                  {{ step.label }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Institutional Protocol & USPs -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl transition-all hover:border-white/10"
        >
          <div class="flex items-center gap-4 mb-8">
            <div
              class="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
            >
              <i class="pi pi-shield text-primary-500 text-xl" />
            </div>
            <div>
              <h3
                class="text-xl font-black text-white uppercase tracking-tighter italic"
              >
                UniReach Institutional Protocol
              </h3>
              <p
                class="text-[10px] text-surface-400 font-bold uppercase tracking-widest"
              >
                Global Academic Sovereignty & Scholar Advocacy
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- USPs -->
            <div class="space-y-6">
              <h4
                class="text-[11px] font-black text-primary-500 uppercase tracking-[0.2em] border-l-2 border-primary-500 pl-4"
              >
                Core Strategic Advantages
              </h4>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div
                    class="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"
                  />
                  <div>
                    <span
                      class="text-[12px] font-black text-white uppercase tracking-tight"
                      >Direct Institutional Pipeline</span
                    >
                    <p
                      class="text-[11px] text-surface-500 font-medium leading-relaxed mt-1"
                    >
                      Exclusive access to top-tier international universities
                      with priority application processing.
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div
                    class="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"
                  />
                  <div>
                    <span
                      class="text-[12px] font-black text-white uppercase tracking-tight"
                      >Neural Document Verification</span
                    >
                    <p
                      class="text-[11px] text-surface-500 font-medium leading-relaxed mt-1"
                    >
                      AI-powered authenticity checks for your credentials,
                      ensuring global recognition.
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div
                    class="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"
                  />
                  <div>
                    <span
                      class="text-[12px] font-black text-white uppercase tracking-tight"
                      >End-to-End Advocacy</span
                    >
                    <p
                      class="text-[11px] text-surface-500 font-medium leading-relaxed mt-1"
                    >
                      From initial mission selection to visa flight paths—we
                      represent your interests at every node.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- working Procedure -->
            <div class="space-y-6">
              <h4
                class="text-[11px] font-black text-primary-500 uppercase tracking-[0.2em] border-l-2 border-primary-500 pl-4"
              >
                Tactical Procedure
              </h4>
              <div class="relative space-y-6 pl-4 border-l border-white/5">
                <div class="relative">
                  <div
                    class="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-surface-900 border border-primary-500"
                  />
                  <span
                    class="text-[10px] font-black text-white uppercase tracking-widest block"
                    >Stage 01: Identity Synthesis</span
                  >
                  <p class="text-[10px] text-surface-500 font-medium mt-1">
                    Complete your Scholar Profile to 100% for neural
                    verification.
                  </p>
                </div>
                <div class="relative">
                  <div
                    class="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-surface-900 border border-white/20"
                  />
                  <span
                    class="text-[10px] font-black text-white uppercase tracking-widest block"
                    >Stage 02: Mission Mapping</span
                  >
                  <p class="text-[10px] text-surface-500 font-medium mt-1">
                    Use the Course Finder to identify and map your academic
                    targets.
                  </p>
                </div>
                <div class="relative">
                  <div
                    class="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-surface-900 border border-white/20"
                  />
                  <span
                    class="text-[10px] font-black text-white uppercase tracking-widest block"
                    >Stage 03: Admission Launch</span
                  >
                  <p class="text-[10px] text-surface-500 font-medium mt-1">
                    Submit your missions with verified digital vault
                    credentials.
                  </p>
                </div>
                <div class="relative">
                  <div
                    class="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full bg-surface-900 border border-white/20"
                  />
                  <span
                    class="text-[10px] font-black text-white uppercase tracking-widest block"
                    >Stage 04: Flight Tracking</span
                  >
                  <p class="text-[10px] text-surface-500 font-medium mt-1">
                    Track your admission status via the Academic Flight Path
                    timeline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Priority & Shortcuts -->
      <aside class="lg:col-span-4 space-y-6">
        <!-- Priority Directive (High Contrast) -->
        <div
          class="relative p-8 rounded-3xl bg-linear-to-br from-primary-500/90 to-primary-700 text-black overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform duration-500"
        >
          <div
            class="absolute -right-6 -bottom-6 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000"
          >
            <i class="pi pi-shield text-9xl font-bold" />
          </div>
          <div class="relative space-y-6">
            <div class="space-y-1">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-bolt text-xs" />
                <span
                  class="text-[8px] font-black uppercase tracking-[0.3em] opacity-60"
                  >Strategic Directive</span
                >
              </div>
              <h3
                class="text-2xl font-black uppercase tracking-tighter leading-none italic"
              >
                {{ priorityAction.title }}
              </h3>
            </div>
            <p
              class="text-[10px] font-bold leading-relaxed opacity-80 uppercase tracking-tight"
            >
              {{ priorityAction.desc }}
            </p>
            <button
              @click="navigateTo(priorityAction.actionTo)"
              class="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
            >
              {{ priorityAction.actionLabel }}
              <i class="pi pi-arrow-right text-[8px]" />
            </button>
          </div>
        </div>

        <!-- Shortcuts List -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
        >
          <h3
            class="text-[9px] font-black text-surface-500 uppercase tracking-[0.4em] mb-6 italic px-2"
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
                  :class="`w-9 h-9 rounded-xl bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-400 group-hover:scale-110 transition-transform border border-${card.color}-500/10`"
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
                    class="text-[8px] font-black text-surface-600 uppercase italic"
                  >
                    {{ card.label }}
                  </p>
                </div>
              </div>
              <i
                class="pi pi-chevron-right text-[8px] text-surface-600 group-hover:text-primary-500 transition-all"
              />
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>

    <!-- Infrastructure Status -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative"
    >
      <div
        class="absolute inset-0 bg-linear-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-50"
      />
      <div class="relative flex items-center gap-5">
        <div
          class="w-14 h-14 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10"
        >
          <div
            class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>
        <div>
          <h4
            class="text-[10px] font-black text-white uppercase tracking-[0.2em] italic"
          >
            UniReach Neural Trust
          </h4>
          <p
            class="text-[9px] text-surface-500 font-bold mt-1 tracking-widest uppercase"
          >
            Sovereign verification nodes active. Latency:
            <span class="text-emerald-400">0.04s</span>
          </p>
        </div>
      </div>

      <div class="relative flex items-center gap-10 px-4">
        <div class="text-center">
          <div
            class="text-[8px] font-black text-surface-600 uppercase tracking-widest mb-1"
          >
            Vault Status
          </div>
          <div
            class="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]"
          >
            SHIELDED
          </div>
        </div>
        <div class="h-8 w-px bg-white/5" />
        <div class="text-center">
          <div
            class="text-[8px] font-black text-surface-600 uppercase tracking-widest mb-1"
          >
            Global Sync
          </div>
          <div
            class="text-primary-400 text-[9px] font-black uppercase tracking-[0.2em]"
          >
            SYNCHRONIZED
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
