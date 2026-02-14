<script setup lang="ts">
definePageMeta({
  title: "My Applications",
  layout: "applicant",
  middleware: "auth",
});

const {
  data: response,
  refresh,
  pending,
} = await useFetch("/api/applicant/applications");

const applications = computed(() => response.value?.data || []);

const selectedApplicationId = ref<string | null>(null);
const isThreadVisible = computed({
  get: () => !!selectedApplicationId.value,
  set: (val) => {
    if (!val) selectedApplicationId.value = null;
  },
});

const getStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("accepted") || s.includes("offer") || s.includes("verified"))
    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (s.includes("pending") || s.includes("review") || s.includes("inquiry"))
    return "text-primary-400 bg-primary-500/10 border-primary-500/20";
  if (
    s.includes("rejected") ||
    s.includes("withdrawn") ||
    s.includes("cancelled")
  )
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  return "text-surface-400 bg-surface-500/10 border-surface-500/20";
};

const getStatusIcon = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("accepted") || s.includes("offer") || s.includes("verified"))
    return "pi pi-check-circle";
  if (s.includes("pending") || s.includes("review") || s.includes("inquiry"))
    return "pi pi-bolt";
  if (
    s.includes("rejected") ||
    s.includes("withdrawn") ||
    s.includes("cancelled")
  )
    return "pi pi-times-circle";
  return "pi pi-info-circle";
};
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

    <!-- Header Section -->
    <div
      class="relative flex flex-col md:flex-row md:items-end justify-between gap-4"
    >
      <div class="space-y-1">
        <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
          My
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 italic"
            >Applications</span
          >
        </h1>
        <p class="text-surface-400 text-sm font-medium">
          Track your real-time admission flight path across global institutions.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-refresh"
          label="Refresh Logs"
          outlined
          @click="refresh"
          :loading="pending"
          class="!border-white/10 !text-surface-300 hover:!bg-white/5 !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl"
        />
        <Button
          icon="pi pi-search"
          label="Find Programs"
          @click="navigateTo('/applicant-portal/courses-finder')"
          class="!bg-linear-to-r !from-primary-500 !to-primary-600 !border-0 !text-black !text-[10px] font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/20"
        />
      </div>
    </div>

    <!-- Application Registry (Vertical Card List) -->
    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-32 bg-surface-900/40 border border-white/5 rounded-3xl animate-pulse"
      />
    </div>

    <div v-else-if="applications.length > 0" class="space-y-4">
      <div
        v-for="app in applications"
        :key="app.id"
        class="group relative bg-surface-900/40 border border-white/5 rounded-[32px] p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 overflow-hidden"
      >
        <!-- Card Aura Decor -->
        <div
          class="absolute -right-20 -top-20 w-48 h-48 bg-primary-500/5 blur-[60px] rounded-full group-hover:bg-primary-500/10 transition-all duration-700"
        />

        <!-- Institutional Glyph -->
        <div class="flex-shrink-0 relative">
          <div
            class="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all duration-500 overflow-hidden"
          >
            <img
              v-if="app.course.university.logo"
              :src="app.course.university.logo"
              class="w-full h-full object-contain p-2"
              alt="University Logo"
            />
            <i
              v-else
              class="pi pi-building-columns text-2xl text-surface-500"
            />
          </div>
          <div
            class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black border border-white/5 flex items-center justify-center"
          >
            <i
              :class="[
                getStatusIcon(app.externalStatus),
                'text-[10px]',
                getStatusColor(app.externalStatus).split(' ')[0],
              ]"
            />
          </div>
        </div>

        <!-- Academic Intelligence Core -->
        <div class="flex-1 min-w-0 space-y-2 text-center md:text-left">
          <div
            class="flex flex-wrap items-center justify-center md:justify-start gap-2"
          >
            <span
              class="text-[8px] font-black text-primary-500 uppercase tracking-widest px-2 py-0.5 bg-primary-500/5 border border-primary-500/10 rounded-full"
            >
              {{ app.course.level.name }}
            </span>
            <span
              class="text-[8px] font-black text-surface-500 uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/10 rounded-full italic"
            >
              ID: {{ app.code }}
            </span>
          </div>

          <h2
            class="text-xl md:text-2xl font-black text-white leading-tight tracking-tight truncate group-hover:text-primary-400 transition-colors"
          >
            {{ app.course.name }}
          </h2>

          <div
            class="flex items-center justify-center md:justify-start gap-2 text-surface-400"
          >
            <i class="pi pi-map-marker text-[10px]" />
            <span class="text-[10px] font-black uppercase tracking-widest">
              {{ app.course.university.name }} •
              {{ app.course.campus || "Main Campus" }}
            </span>
          </div>
        </div>

        <!-- Metrics & Status Matrix -->
        <div
          class="flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-3 w-full md:w-auto md:border-l border-white/5 md:pl-8"
        >
          <div class="flex-1 md:flex-none text-right md:text-right">
            <span
              class="text-[8px] font-black text-surface-600 uppercase tracking-widest block mb-1"
              >Live Status</span
            >
            <div
              :class="[getStatusColor(app.externalStatus)]"
              class="px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {{ app.externalStatus }}
            </div>
          </div>

          <div class="hidden lg:block text-right">
            <span
              class="text-[8px] font-black text-surface-600 uppercase tracking-widest block mb-1"
              >Submittal Date</span
            >
            <p class="text-[10px] font-black text-white uppercase italic">
              {{
                new Date(app.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              }}
            </p>
          </div>

          <button
            @click="selectedApplicationId = app.id"
            class="px-6 py-3 md:w-full rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-[9px] font-black uppercase tracking-widest text-white transition-all transform active:scale-95 whitespace-nowrap"
          >
            Deep Intelligence
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-32 space-y-6 bg-surface-900/40 border border-white/5 border-dashed rounded-[32px]"
    >
      <div
        class="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center"
      >
        <i class="pi pi-folder-open text-3xl text-surface-600" />
      </div>
      <div class="text-center space-y-1">
        <h3 class="text-xl font-bold text-white uppercase tracking-tight">
          Registry Empty
        </h3>
        <p
          class="text-xs text-surface-500 uppercase font-black tracking-widest"
        >
          No academic missions launched yet
        </p>
      </div>
      <button
        @click="navigateTo('/applicant-portal/courses-finder')"
        class="bg-linear-to-r from-primary-500 to-primary-600 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:scale-105 transition-all"
      >
        Discover Programs
      </button>
    </div>

    <!-- Tactical Intelligence Drawer -->
    <Drawer
      v-model:visible="isThreadVisible"
      position="right"
      header="Tactical Intelligence"
      class="!w-full md:!w-[450px] !bg-surface-950/80 !backdrop-blur-3xl !border-l !border-white/5"
    >
      <template #header>
        <div class="flex flex-col gap-1">
          <h2 class="text-sm font-black text-white uppercase tracking-[0.2em]">
            Application <span class="text-primary-500">Thread</span>
          </h2>
          <span
            class="text-[8px] font-bold text-surface-500 uppercase tracking-widest"
            >Real-time status synchronization</span
          >
        </div>
      </template>
      <div class="h-full pt-4">
        <ApplicationsThread
          v-if="selectedApplicationId"
          :applicationId="selectedApplicationId"
        />
      </div>
    </Drawer>
  </div>
</template>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(40px) saturate(180%);
}

h1,
h2,
h3 {
  font-family: "Outfit", sans-serif;
}

:deep(.p-drawer-content) {
  padding: 0 !important;
  background: transparent !important;
}
:deep(.p-drawer-header) {
  background: rgba(255, 255, 255, 0.02) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding: 1.5rem !important;
}
</style>
