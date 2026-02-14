<script setup lang="ts">
const props = defineProps<{
  programId: string;
  mode: "admin" | "partner";
}>();

const { user } = useUserSession();

// Unified Intelligence Acquisition
const { data: res, pending } = await useFetch(
  `/api/programs/${props.programId}`
);
const program = computed(() => (res.value as any)?.data);

const statsMatrix = computed(() => {
  if (!program.value) return [];
  return [
    {
      label: "Intake Timeline",
      value: program.value.intakeMonths?.join(", ") || "Rolling",
      icon: "pi pi-calendar",
    },
    {
      label: "Temporal Duration",
      value: program.value.duration,
      icon: "pi pi-clock",
    },
    {
      label: "Academic Tier",
      value: program.value.level?.name,
      icon: "pi pi-shield",
    },
    {
      label: "Campus Node",
      value: program.value.campus || "Main Campus",
      icon: "pi pi-map-marker",
    },
  ];
});

const tacticalFlags = computed(() => {
  if (!program.value) return [];
  const flags = [
    {
      label: "English Waiver",
      active: program.value.hasEnglishWaiver,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      label: "Scholarship",
      active: program.value.hasScholarship,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Fast Track",
      active: program.value.isFastTrack,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "STEM Alignment",
      active: program.value.isStem,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "No Interview",
      active: program.value.isInterviewOptional,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "High Demand",
      active: program.value.highJobDemand,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      label: "High Acceptance",
      active: program.value.highAcceptanceRate,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Affordable",
      active: program.value.isAffordable,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Loan Support",
      active: program.value.hasLoanSupport,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Major City",
      active: program.value.isMajorCity,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
  ];
  return flags.filter((f) => f.active);
});

const emit = defineEmits(["apply"]);
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <div v-if="pending" class="space-y-8">
      <Skeleton height="300px" class="rounded-[40px]" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton height="150px" v-for="i in 3" :key="i" class="rounded-3xl" />
      </div>
    </div>

    <template v-else-if="program">
      <!-- Institutional Hub Banner -->
      <div class="relative group">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-transparent to-primary-600/20 rounded-[44px] blur-2xl opacity-50"
        ></div>
        <div
          class="relative h-[300px] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl"
        >
          <img
            v-if="program.university.bannerImage"
            :src="program.university.bannerImage"
            class="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          />
          <div
            v-else
            class="w-full h-full bg-surface-950/50 flex items-center justify-center"
          >
            <i class="pi pi-building text-surface-800 text-6xl" />
          </div>

          <!-- Glass Overlay Header -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent p-8 flex flex-col justify-end"
          >
            <div
              class="flex flex-col md:flex-row items-end justify-between gap-6"
            >
              <div class="flex items-center gap-6">
                <div
                  class="w-20 h-20 rounded-2xl bg-white p-1 shadow-2xl border border-white/10 overflow-hidden transform group-hover:rotate-3 transition-transform"
                >
                  <img
                    :src="program.university.logo"
                    class="w-full h-full object-contain"
                  />
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-3">
                    <span
                      class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]"
                      >Integrated Registry</span
                    >
                    <div
                      v-if="program.university.isPremiumPartner"
                      class="px-2 py-0.5 rounded-md bg-primary-500/10 border border-primary-500/20 text-[8px] font-black text-primary-400 uppercase"
                    >
                      Premium Institution
                    </div>
                  </div>
                  <h1
                    class="text-3xl font-black text-white leading-none uppercase tracking-tighter"
                  >
                    {{ program.name }}
                  </h1>
                  <p
                    class="text-surface-400 font-bold uppercase tracking-widest text-sm italic"
                  >
                    {{ program.university.name }} —
                    {{ program.university.country }}
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="$emit('apply', program)"
                  class="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-black text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all active:scale-95"
                >
                  Authorize Enrollment
                </button>
                <a
                  v-if="program.courseUrl"
                  :href="program.courseUrl"
                  target="_blank"
                  class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <i class="pi pi-external-link" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Intelligence Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Axis: Academic Core -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Tactical Attributes HUD -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="stat in statsMatrix"
              :key="stat.label"
              class="p-4 rounded-3xl bg-surface-900/40 border border-white/5 backdrop-blur-xl space-y-3"
            >
              <div
                class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center"
              >
                <i :class="[stat.icon, 'text-primary-500 text-xs']" />
              </div>
              <div>
                <span
                  class="text-[8px] font-black text-surface-600 uppercase tracking-widest block"
                  >{{ stat.label }}</span
                >
                <p class="text-[11px] font-black text-white uppercase">
                  {{ stat.value }}
                </p>
              </div>
            </div>
          </div>

          <!-- Requirements Matrix -->
          <div
            class="bg-surface-900/40 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl"
          >
            <div
              class="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center gap-3"
            >
              <i class="pi pi-shield-check text-primary-500" />
              <h3
                class="text-[10px] font-black text-white uppercase tracking-[0.3em]"
              >
                Compliance Matrix
              </h3>
            </div>
            <div class="p-8 grid grid-cols-1 gap-8">
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                  <span
                    class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                    >Academic Entry Protocol</span
                  >
                </div>
                <div
                  class="text-sm text-surface-200 leading-relaxed font-bold whitespace-pre-line bg-black/20 p-6 rounded-2xl border border-white/5"
                >
                  {{
                    program.entryRequirements ||
                    "No specific academic requirements documented in the registry."
                  }}
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  <span
                    class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                    >Linguistic Sovereignty</span
                  >
                </div>
                <div
                  class="text-sm text-surface-200 leading-relaxed font-bold whitespace-pre-line bg-black/20 p-6 rounded-2xl border border-white/5"
                >
                  {{
                    program.englishRequirements ||
                    "Standard institutional English requirements apply."
                  }}
                  <div class="mt-4 flex flex-wrap gap-2">
                    <div
                      v-if="program.moiAccepted"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                    >
                      <i class="pi pi-check-circle text-cyan-400 text-[10px]" />
                      <span
                        class="text-[8px] font-black text-cyan-400 uppercase"
                        >MOI Accepted</span
                      >
                    </div>
                    <div
                      v-if="program.hasEnglishWaiver"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <i class="pi pi-verified text-emerald-400 text-[10px]" />
                      <span
                        class="text-[8px] font-black text-emerald-400 uppercase"
                        >Standard Waiver Available</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Academic & Career Tactical HUD -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-6"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-book text-primary-500" />
                <h3
                  class="text-[10px] font-black text-white uppercase tracking-[0.3em]"
                >
                  Graduation Attributes
                </h3>
              </div>
              <div class="grid grid-cols-1 gap-3">
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span class="text-[9px] font-black text-surface-400 uppercase"
                    >Maths Requirement</span
                  >
                  <span
                    :class="
                      program.hasMathsWaiver
                        ? 'text-emerald-400'
                        : 'text-surface-200'
                    "
                    class="text-[10px] font-black uppercase tracking-widest text-right"
                  >
                    {{
                      program.hasMathsWaiver
                        ? "Not Required / Waiver"
                        : "Mandatory"
                    }}
                  </span>
                </div>
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span class="text-[9px] font-black text-surface-400 uppercase"
                    >GRE / GMAT Protocol</span
                  >
                  <span
                    :class="
                      program.hasGreGmatWaiver
                        ? 'text-emerald-400'
                        : 'text-surface-200'
                    "
                    class="text-[10px] font-black uppercase tracking-widest text-right"
                  >
                    {{
                      program.hasGreGmatWaiver
                        ? "Waived / Exempt"
                        : "Standard Requirement"
                    }}
                  </span>
                </div>
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span class="text-[9px] font-black text-surface-400 uppercase"
                    >Professional Experience</span
                  >
                  <span
                    :class="
                      program.requiresWorkExp
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    "
                    class="text-[10px] font-black uppercase tracking-widest text-right"
                  >
                    {{
                      program.requiresWorkExp ? "Mandatory" : "No Exp Required"
                    }}
                  </span>
                </div>
              </div>
            </div>

            <div
              class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-6"
            >
              <div class="flex items-center gap-3">
                <i class="pi pi-briefcase text-primary-500" />
                <h3
                  class="text-[10px] font-black text-white uppercase tracking-[0.3em]"
                >
                  Career Progression Flags
                </h3>
              </div>
              <div class="grid grid-cols-1 gap-3">
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span class="text-[9px] font-black text-surface-400 uppercase"
                    >Regional Advantage</span
                  >
                  <span
                    :class="
                      program.isRegional
                        ? 'text-emerald-400'
                        : 'text-surface-500'
                    "
                    class="text-[10px] font-black uppercase tracking-widest text-right"
                  >
                    {{
                      program.isRegional
                        ? "Regional / Rural Points"
                        : "Central Node"
                    }}
                  </span>
                </div>
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span class="text-[9px] font-black text-surface-400 uppercase"
                    >Internship / Co-op</span
                  >
                  <span
                    :class="
                      program.hasCoop ? 'text-emerald-400' : 'text-surface-500'
                    "
                    class="text-[10px] font-black uppercase tracking-widest text-right"
                  >
                    {{ program.hasCoop ? "Built-in / Integrated" : "Standard" }}
                  </span>
                </div>
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span class="text-[9px] font-black text-surface-400 uppercase"
                    >Market job Demand</span
                  >
                  <span
                    :class="
                      program.highJobDemand
                        ? 'text-rose-400'
                        : 'text-surface-500'
                    "
                    class="text-[10px] font-black uppercase tracking-widest text-right"
                  >
                    {{ program.highJobDemand ? "High Intensity" : "Stable" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Intelligence Logs -->
          <div
            v-if="program.remarks || program.extraNotes"
            class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-6"
          >
            <div class="flex items-center gap-3">
              <i class="pi pi-info-circle text-primary-500" />
              <h3
                class="text-[10px] font-black text-white uppercase tracking-[0.3em]"
              >
                Registry Logs & Intelligence
              </h3>
            </div>
            <div class="grid grid-cols-1 gap-8">
              <div v-if="program.remarks" class="space-y-2">
                <span
                  class="text-[8px] font-black text-surface-600 uppercase tracking-widest block px-1"
                  >Tactical Remarks</span
                >
                <p class="text-xs text-surface-400 leading-relaxed italic">
                  {{ program.remarks }}
                </p>
              </div>
              <div v-if="program.extraNotes" class="space-y-2">
                <span
                  class="text-[8px] font-black text-surface-600 uppercase tracking-widest block px-1"
                  >Extra Operations Notes</span
                >
                <p class="text-xs text-surface-400 leading-relaxed italic">
                  {{ program.extraNotes }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Axis: Financial & Tactical HUD -->
        <div class="lg:col-span-4 space-y-8">
          <!-- Financial Asset Card -->
          <div
            class="bg-gradient-to-br from-surface-900 via-surface-900 to-black border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"
            ></div>
            <div class="space-y-8 relative z-10">
              <div class="space-y-2">
                <span
                  class="text-[9px] font-black text-surface-500 uppercase tracking-[0.4em]"
                  >Investment Payload</span
                >
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-black text-white tracking-tighter"
                    >{{ program.currency }}
                    {{ program.tuitionFee.toLocaleString() }}</span
                  >
                  <span
                    class="text-[10px] font-black text-surface-600 uppercase tracking-widest"
                    >/ Per Annum</span
                  >
                </div>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span
                    class="text-[8px] font-black text-surface-600 uppercase tracking-widest block mb-1"
                    >Application Hub Fee</span
                  >
                  <p
                    class="text-lg font-black"
                    :class="
                      program.applicationFee === 0 || program.hasAppFeeWaiver
                        ? 'text-emerald-400'
                        : 'text-white'
                    "
                  >
                    {{
                      program.applicationFee === 0 || program.hasAppFeeWaiver
                        ? "EXEMPT / WAIVED"
                        : program.currency + " " + program.applicationFee
                    }}
                  </p>
                </div>
                <div
                  v-if="program.unireachCommission && mode === 'admin'"
                  class="p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10"
                >
                  <span
                    class="text-[8px] font-black text-primary-500 uppercase tracking-widest block mb-1"
                    >Unireach Payload</span
                  >
                  <p class="text-lg font-black text-primary-400">
                    {{ program.unireachCommission }}
                  </p>
                </div>
                <div
                  v-if="program.partnerCommission"
                  class="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"
                >
                  <span
                    class="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1"
                    >Partner Yield</span
                  >
                  <p class="text-lg font-black text-emerald-400">
                    {{ program.partnerCommission }}
                  </p>
                </div>
                <div
                  v-else
                  class="p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <span
                    class="text-[8px] font-black text-surface-600 uppercase tracking-widest block mb-1"
                    >Deposit Requirement</span
                  >
                  <p class="text-sm font-black text-white uppercase italic">
                    {{
                      program.lowTuitionDeposit ? "Minimum Deposit" : "Standard"
                    }}
                  </p>
                </div>
              </div>

              <!-- Tactical Badges -->
              <div class="space-y-3">
                <span
                  class="text-[8px] font-black text-surface-600 uppercase tracking-widest block px-1"
                  >Network Capabilities</span
                >
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="flag in tacticalFlags"
                    :key="flag.label"
                    :class="[flag.bg, flag.color]"
                    class="px-3 py-1.5 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-tight"
                  >
                    {{ flag.label }}
                  </div>
                </div>
              </div>

              <div
                v-if="program.applicationDeadline"
                class="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4"
              >
                <div
                  class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center"
                >
                  <i class="pi pi-clock text-rose-500" />
                </div>
                <div>
                  <span
                    class="text-[8px] font-black text-rose-500/60 uppercase tracking-widest block"
                    >Critical Deadline</span
                  >
                  <p class="text-xs font-black text-white uppercase">
                    {{ program.applicationDeadline }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Institutional Performance Matrix (Admin Only) -->
          <div
            v-if="mode === 'admin'"
            class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-6"
          >
            <div class="flex items-center gap-3">
              <i class="pi pi-chart-bar text-primary-500" />
              <h3
                class="text-[10px] font-black text-white uppercase tracking-[0.3em]"
              >
                Performance Telemetry
              </h3>
            </div>
            <div class="space-y-6">
              <div class="space-y-2">
                <div
                  class="flex justify-between text-[8px] font-black uppercase tracking-widest"
                >
                  <span class="text-surface-500">Offer TAT Efficiency</span>
                  <span class="text-white"
                    >{{ program.university.offerTATIndex }}/5</span
                  >
                </div>
                <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary-500 rounded-full"
                    :style="{
                      width: (program.university.offerTATIndex / 5) * 100 + '%',
                    }"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <div
                  class="flex justify-between text-[8px] font-black uppercase tracking-widest"
                >
                  <span class="text-surface-500">Visa Protocol Success</span>
                  <span class="text-white"
                    >{{ program.university.visaSuccessRate }}%</span
                  >
                </div>
                <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-emerald-500 rounded-full"
                    :style="{ width: program.university.visaSuccessRate + '%' }"
                  ></div>
                </div>
              </div>
              <div class="pt-4 grid grid-cols-2 gap-4 border-t border-white/5">
                <div class="space-y-1">
                  <span
                    class="text-[7px] font-black text-surface-600 uppercase tracking-widest"
                    >Comm. Velocity</span
                  >
                  <p class="text-[10px] font-black text-white uppercase italic">
                    Tier {{ program.university.commissionSpeed }}/05
                  </p>
                </div>
                <div class="space-y-1">
                  <span
                    class="text-[7px] font-black text-surface-600 uppercase tracking-widest"
                    >Contract Status</span
                  >
                  <p
                    class="text-[10px] font-black text-emerald-400 uppercase italic"
                  >
                    {{
                      program.university.hasDirectContract
                        ? "Direct"
                        : "Aggregator"
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Strategic Taxonomy -->
          <div
            v-if="
              program.strategicFlags?.length ||
              program.university.strategicTags?.length
            "
            class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-4"
          >
            <span
              class="text-[8px] font-black text-surface-600 uppercase tracking-widest block px-1"
              >Network Taxonomy</span
            >
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in [
                  ...(program.strategicFlags || []),
                  ...(program.university.strategicTags || []),
                ]"
                :key="tag"
                class="text-[9px] font-bold text-surface-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
                >#{{ tag }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Animated background gradients for premium feel */
.shadow-inner {
  box-shadow: inset 0 2px 40px rgba(0, 0, 0, 0.4);
}
</style>
