<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  showTitle?: boolean;
  compact?: boolean;
  initialFilters?: any;
  mode?: "discovery" | "suggestions";
  leadId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showTitle: true,
  compact: false,
  initialFilters: () => ({}),
  mode: "discovery",
  leadId: "",
});

// Registry Intelligence
const { data: countriesRes } = await useFetch("/api/countries");
const countries = computed(() => (countriesRes.value as any)?.data || []);

const { data: levelsRes } = await useFetch("/api/public/program-levels");
const levels = computed(() => (levelsRes.value as any)?.data || []);

const { data: areasRes } = await useFetch("/api/public/study-areas");
const studyAreas = computed(() => (areasRes.value as any)?.data || []);

const { data: disciplinesRes } = await useFetch("/api/public/disciplines");
const disciplines = computed(() => (disciplinesRes.value as any)?.data || []);

// State Intelligence
const filters = ref({
  search: props.initialFilters.search || "",
  country: props.initialFilters.country || "",
  levelId: props.initialFilters.levelId || "",
  studyAreaId: props.initialFilters.studyAreaId || "",
  disciplineId: props.initialFilters.disciplineId || "",
  intake: props.initialFilters.intake || "",
  // Tactical Booleans (Quick Filters)
  isFastTrack: props.initialFilters.isFastTrack || false,
  hasScholarship: props.initialFilters.hasScholarship || false,
  highAcceptanceRate: props.initialFilters.highAcceptanceRate || false,
  hasEnglishWaiver: props.initialFilters.hasEnglishWaiver || false,
  isAffordable: props.initialFilters.isAffordable || false,
  hasCoop: props.initialFilters.hasCoop || false,
  highJobDemand: props.initialFilters.highJobDemand || false,
  isMajorCity: props.initialFilters.isMajorCity || false,
  hasLoanSupport: props.initialFilters.hasLoanSupport || false,
  isInterviewOptional: props.initialFilters.isInterviewOptional || false,
  // Strategic Tags
  strategicFlag: props.initialFilters.strategicFlag || "",
});

// Deep Watch for external sync (e.g. Lead details changing)
watch(
  () => props.initialFilters,
  (newVal) => {
    if (newVal) {
      Object.assign(filters.value, newVal);
    }
  },
  { deep: true }
);

const quickFilters = [
  { label: "Faster Offer TAT", key: "isFastTrack", icon: "pi pi-bolt" },
  {
    label: "Scholarship Available",
    key: "hasScholarship",
    icon: "pi pi-dollar",
  },
  { label: "English Exam Waiver", key: "hasEnglishWaiver", icon: "pi pi-book" },
  { label: "Affordable Tier", key: "isAffordable", icon: "pi pi-wallet" },
  { label: "Co-op / Internships", key: "hasCoop", icon: "pi pi-briefcase" },
  { label: "High Job Demand", key: "highJobDemand", icon: "pi pi-chart-line" },
  {
    label: "Major City Location",
    key: "isMajorCity",
    icon: "pi pi-map-marker",
  },
  { label: "Loan Support", key: "hasLoanSupport", icon: "pi pi-building" },
  { label: "No Interview", key: "isInterviewOptional", icon: "pi pi-users" },
];

// Search Pulse
const { data: results, pending } = await useFetch("/api/programs/search", {
  query: filters,
  watch: [filters],
});

const courses = computed(() => {
  const raw = (results.value as any)?.data || [];
  return raw.map((c: any) => ({
    ...c,
    matchScore: Math.floor(Math.random() * (99 - 75 + 1) + 75), // Simulated Intelligence
  }));
});

const filteredDisciplines = computed(() => {
  if (!filters.value.studyAreaId) return disciplines.value;
  return disciplines.value.filter(
    (d: any) => d.studyAreaId === filters.value.studyAreaId
  );
});

const clearAll = () => {
  filters.value = {
    search: "",
    country: "",
    levelId: "",
    studyAreaId: "",
    disciplineId: "",
    intake: "",
    isFastTrack: false,
    hasScholarship: false,
    highAcceptanceRate: false,
    hasEnglishWaiver: false,
    isAffordable: false,
    hasCoop: false,
    highJobDemand: false,
    isMajorCity: false,
    hasLoanSupport: false,
    isInterviewOptional: false,
    strategicFlag: "",
  };
};

const toggleFilter = (key: string) => {
  (filters.value as any)[key] = !(filters.value as any)[key];
};
</script>

<template>
  <div class="space-y-8">
    <!-- Optional Compact Header -->
    <div
      v-if="showTitle"
      class="relative flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-white/5"
    >
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-8 h-[2px] bg-primary-500"></div>
          <span
            class="text-[9px] font-black text-primary-500 uppercase tracking-[0.4em]"
            >{{
              mode === "suggestions"
                ? "Neural Suggestions"
                : "Intelligence Matrix"
            }}</span
          >
        </div>
        <h1
          class="text-4xl font-black text-white tracking-tighter uppercase italic leading-none"
        >
          {{ mode === "suggestions" ? "Curated" : "Program" }}
          <span
            class="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
            >{{ mode === "suggestions" ? "Matches." : "Discovery." }}</span
          >
        </h1>
      </div>
      <div class="flex items-center gap-4">
        <div
          class="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl flex items-center gap-3"
        >
          <div
            class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          ></div>
          <span
            class="text-[10px] font-black text-white uppercase tracking-widest"
            >{{ courses?.length || 0 }} Assets Found</span
          >
        </div>
      </div>
    </div>

    <!-- Neural Tactical HUD (Filter Console) -->
    <div class="relative group">
      <div
        class="absolute -inset-1 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-600/10 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"
      ></div>
      <div
        class="relative bg-surface-900/60 border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-8 backdrop-blur-3xl space-y-6 md:space-y-8 shadow-2xl"
      >
        <!-- Discovery Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6"
        >
          <div class="lg:col-span-12 relative">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em] mb-3 block px-1"
              >Deep Search Payload</label
            >
            <div class="relative">
              <i
                class="pi pi-search absolute left-5 top-1/2 -translate-y-1/2 text-primary-500/50 text-sm"
              />
              <InputText
                v-model="filters.search"
                placeholder="Search Programs, Uni IDs, or Key Missions..."
                class="w-full! bg-white/5! border-white/5! pl-14! h-14! text-sm font-bold rounded-[20px] focus:border-primary-500/50! focus:bg-white/10! transition-all placeholder:text-surface-600! shadow-inner"
              />
            </div>
          </div>

          <div class="lg:col-span-3">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em] mb-3 block px-1"
              >Global Target</label
            >
            <Select
              v-model="filters.country"
              :options="countries"
              optionLabel="name"
              optionValue="name"
              placeholder="Target Nation"
              class="neural-select !h-14 !rounded-[20px] !text-xs !bg-white/5! !border-white/5!"
              filter
              showClear
            />
          </div>

          <div class="lg:col-span-3">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em] mb-3 block px-1"
              >Academic Level</label
            >
            <Select
              v-model="filters.levelId"
              :options="levels"
              optionLabel="name"
              optionValue="id"
              placeholder="Level"
              class="neural-select !h-14 !rounded-[20px] !text-xs !bg-white/5! !border-white/5!"
              filter
              showClear
            />
          </div>

          <div class="lg:col-span-3">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em] mb-3 block px-1"
              >Study Domain</label
            >
            <Select
              v-model="filters.studyAreaId"
              :options="studyAreas"
              optionLabel="name"
              optionValue="id"
              placeholder="Domain"
              class="neural-select !h-14 !rounded-[20px] !text-xs !bg-white/5! !border-white/5!"
              filter
              showClear
              @change="filters.disciplineId = ''"
            />
          </div>

          <div class="lg:col-span-3">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-[0.2em] mb-3 block px-1"
              >Refinement</label
            >
            <Select
              v-model="filters.disciplineId"
              :options="filteredDisciplines"
              optionLabel="name"
              optionValue="id"
              placeholder="Discipline"
              class="neural-select !h-14 !rounded-[20px] !text-xs !bg-white/5! !border-white/5!"
              filter
              showClear
              :disabled="!filters.studyAreaId"
            />
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="pt-6 border-t border-white/5 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-1 h-4 bg-primary-500 rounded-full"></div>
              <span
                class="text-[10px] font-black text-white uppercase tracking-[0.3em]"
                >Tactical Flushes</span
              >
            </div>
            <button
              @click="clearAll"
              class="text-[8px] font-black text-primary-500 hover:text-white uppercase tracking-widest flex items-center gap-2"
            >
              <i class="pi pi-refresh" /> Reset Protocol
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="f in quickFilters"
              :key="f.key"
              @click="toggleFilter(f.key)"
              :class="[
                'flex items-center gap-2.5 px-3.5 md:px-4 py-2.5 rounded-xl border transition-all text-[9.5px] md:text-[10px] font-bold',
                (filters as any)[f.key]
                  ? 'bg-primary-500 border-primary-400 text-black shadow-lg scale-105'
                  : 'bg-white/5 border-white/5 text-surface-400 hover:bg-white/10',
              ]"
            >
              <i :class="f.icon" class="text-[9px]" /> {{ f.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Matrix -->
    <div v-if="pending" class="grid grid-cols-1 gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-[180px] bg-white/5 rounded-[32px] animate-pulse"
      ></div>
    </div>

    <div v-else-if="!courses || courses.length === 0" class="py-20 text-center">
      <h2
        class="text-xl font-black text-surface-400 uppercase tracking-tighter"
      >
        Zero Neural Matches.
      </h2>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
        v-for="course in courses"
        :key="course.id"
        class="group bg-surface-900/40 border border-white/5 rounded-[32px] p-4 md:p-5 backdrop-blur-xl hover:bg-surface-800/60 hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden"
      >
        <div class="relative z-10 flex flex-col md:flex-row gap-5 md:gap-6">
          <!-- Left: Match Score -->
          <div
            class="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 min-w-[110px] border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6"
          >
            <div class="relative w-14 h-14 md:w-16 md:h-16">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="transparent"
                  stroke="currentColor"
                  stroke-width="4"
                  class="text-white/5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="transparent"
                  stroke="currentColor"
                  stroke-width="4"
                  stroke-dasharray="176"
                  :stroke-dashoffset="176 - (176 * course.matchScore) / 100"
                  class="text-primary-500 transition-all duration-1000"
                />
              </svg>
              <div
                class="absolute inset-0 flex flex-col items-center justify-center"
              >
                <span
                  class="text-[10px] md:text-xs font-black text-white italic"
                  >{{ course.matchScore }}%</span
                >
                <span
                  class="text-[5px] md:text-[6px] font-black text-surface-500 uppercase tracking-tighter"
                  >Match</span
                >
              </div>
            </div>
            <div
              class="w-9 h-9 rounded-lg bg-surface-950 border border-white/10 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="course.university.logo"
                :src="course.university.logo"
                class="w-full h-full object-cover"
              />
              <i v-else class="pi pi-building text-surface-700 text-xs" />
            </div>
          </div>

          <!-- Center Content -->
          <div class="flex-1 space-y-3">
            <div class="space-y-1">
              <div class="flex items-center flex-wrap gap-2">
                <h2
                  class="text-base md:text-lg font-black text-white leading-tight uppercase tracking-tight group-hover:text-primary-400 transition-colors"
                >
                  {{ course.name }}
                </h2>
                <div
                  v-if="course.university.isPremiumPartner"
                  class="px-2 py-0.5 rounded-md bg-primary-500/10 border border-primary-500/20"
                >
                  <span
                    class="text-[7px] font-black text-primary-400 uppercase tracking-widest"
                    >Elite Partner</span
                  >
                </div>
              </div>
              <div class="flex items-center flex-wrap gap-3">
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-3.5 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="course.university.countryFlag"
                      :src="course.university.countryFlag"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="pi pi-flag text-[8px] text-surface-600" />
                  </div>
                  <span
                    class="text-[9px] font-bold text-surface-400 uppercase tracking-widest"
                    >{{ course.university.country }}</span
                  >
                </div>
                <div class="w-0.5 h-0.5 rounded-full bg-white/20"></div>
                <span
                  class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                  >{{ course.university.name }}</span
                >
              </div>
            </div>

            <div class="flex flex-wrap gap-1.5">
              <div
                v-if="course.hasEnglishWaiver"
                class="px-2.5 py-0.5 rounded-md bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-[7.5px] font-black uppercase tracking-tight"
              >
                ENG Waiver
              </div>
              <div
                v-if="course.isAffordable"
                class="px-2.5 py-0.5 rounded-md bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[7.5px] font-black uppercase tracking-tight"
              >
                Affordable
              </div>
              <div
                v-if="course.isStem"
                class="px-2.5 py-0.5 rounded-md bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[7.5px] font-black uppercase tracking-tight"
              >
                STEM
              </div>
              <div
                class="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white text-[7.5px] font-black uppercase tracking-tight"
              >
                {{ course.duration }}
              </div>
            </div>

            <div
              class="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 py-2.5 bg-black/40 rounded-2xl border border-white/5 shadow-inner"
            >
              <div class="space-y-0.5">
                <span
                  class="text-[6px] font-black text-surface-600 uppercase tracking-widest"
                  >Intakes</span
                >
                <p class="text-[8px] font-black text-white uppercase truncate">
                  {{ course.intakeMonths.join(", ") }}
                </p>
              </div>
              <div class="space-y-0.5">
                <span
                  class="text-[6px] font-black text-surface-600 uppercase tracking-widest"
                  >Tuition</span
                >
                <p class="text-[9px] font-black text-white italic truncate">
                  {{ course.currency }} {{ course.tuitionFee.toLocaleString() }}
                </p>
              </div>
              <div class="space-y-0.5">
                <span
                  class="text-[6px] font-black text-surface-600 uppercase tracking-widest"
                  >App Fee</span
                >
                <p class="text-[9px] font-black text-white italic truncate">
                  {{
                    course.applicationFee === 0
                      ? "FREE"
                      : course.currency + " " + course.applicationFee
                  }}
                </p>
              </div>
              <div v-if="course.expectedCommission" class="space-y-0.5">
                <span
                  class="text-[6px] font-black text-emerald-500/60 uppercase tracking-widest"
                  >Yield</span
                >
                <p class="text-[9px] font-black text-emerald-400 italic">
                  {{ course.expectedCommission }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div
            class="flex flex-row md:flex-col justify-end gap-2 md:w-[120px] md:border-l border-white/5 md:pl-6"
          >
            <NuxtLink
              v-if="mode !== 'suggestions'"
              :to="
                leadId
                  ? `/apply?courseId=${course.id}&leadId=${leadId}`
                  : `/apply?courseId=${course.id}`
              "
              class="flex-1"
            >
              <button
                class="w-full h-10 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-black shadow-lg transition-all active:scale-95"
              >
                {{ leadId ? "Register" : "Apply" }}
              </button>
            </NuxtLink>
            <button
              v-if="course.courseUrl"
              @click="window.open(course.courseUrl, '_blank')"
              class="h-10 px-4 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-surface-500 flex items-center justify-center gap-2 hover:text-white transition-all"
            >
              <i class="pi pi-external-link" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neural-select {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}
:deep(.p-select-label) {
  font-size: 11px !important;
  font-weight: 700 !important;
  padding: 0 1.25rem !important;
  color: #fff !important;
}
:deep(.p-select-dropdown) {
  width: 2.5rem !important;
}
@keyframes pulse-soft {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}
.animate-pulse-soft {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
