<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEditing = computed(() => !!route.query.id);
const isSaving = ref(false);
const isLoading = ref(true);

// Registry Knowledge Bases
const universities = ref<any[]>([]);
const programLevels = ref<any[]>([]);
const studyAreas = ref<any[]>([]);
const disciplines = ref<any[]>([]);
const filteredDisciplines = computed(() => {
  if (!form.value.studyAreaId) return disciplines.value;
  return disciplines.value.filter(
    (d) => d.studyAreaId === form.value.studyAreaId
  );
});

const fetchRegistries = async () => {
  try {
    const [uRes, lRes, saRes, dRes] = await Promise.all([
      $fetch("/api/admin/universities"),
      $fetch("/api/admin/program-levels"),
      $fetch("/api/admin/maintenance/study-areas"),
      $fetch("/api/admin/maintenance/disciplines"),
    ]);

    // Registry Mapping
    universities.value = Array.isArray(uRes) ? uRes : (uRes as any)?.data || [];
    programLevels.value =
      (lRes as any)?.data || (Array.isArray(lRes) ? lRes : []);
    studyAreas.value = (saRes as any)?.data || [];
    disciplines.value = (dRes as any)?.data || [];

    console.log("Registries Synchronized:", {
      unis: universities.value.length,
      levels: programLevels.value.length,
      areas: studyAreas.value.length,
      disciplines: disciplines.value.length,
    });
  } catch (error: any) {
    console.error("Registry Sync Failure:", error);
    toast.add({
      severity: "error",
      summary: "Registry Error",
      detail:
        error.data?.message ||
        "Failed to synchronize institutional intelligence.",
      life: 5000,
    });
  }
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currencies = ["USD", "EUR", "GBP", "AUD", "CAD", "BDT", "INR"];

const form = ref({
  id: "",
  universityId: "",
  levelId: "",
  name: "",
  code: "",
  duration: "",
  campus: "",
  courseUrl: "",
  intakeMonths: [] as string[],
  tuitionFee: 0,
  applicationFee: 0,
  currency: "USD",
  expectedCommission: "",
  applicationDeadline: "",
  isActive: true,

  // Tactical Intelligence Flags
  isFastTrack: false,
  hasScholarship: false,
  highAcceptanceRate: false,
  isStem: false,
  isInterviewOptional: false,
  hasEnglishWaiver: false,
  hasAppFeeWaiver: false,
  lowTuitionDeposit: false,
  hasLoanSupport: false,
  isAffordable: false,
  isMajorCity: false,
  isRegional: false,
  hasCoop: false,
  highJobDemand: false,
  hasMathsWaiver: false,
  hasGreGmatWaiver: false,
  requiresWorkExp: false,
  strategicFlags: [] as string[],

  studyAreaId: "",
  disciplineId: "",
  entryRequirements: "",
  englishRequirements: "",
  moiAccepted: false,
  standardizedTests: "",
  remarks: "",
  extraNotes: "",
  additionalRequirements: {} as Record<string, any>,
});

const strategicAttributeOptions = [
  "MBA Programs",
  "Russel Group Universities (UK)",
  "Higher Backlog Acceptance",
  "Uni has own English Test",
  "PTE Acceptable",
  "DET Acceptable",
  "Open Programs",
  "With 15 Years of Education",
  "GS Approval with KC (Aus)",
  "No Tuition Deposit (US)",
];

const newRequirementKey = ref("");

const addRequirement = () => {
  if (
    newRequirementKey.value &&
    !form.value.additionalRequirements[newRequirementKey.value]
  ) {
    form.value.additionalRequirements[newRequirementKey.value] = "";
    newRequirementKey.value = "";
  }
};

onMounted(async () => {
  await fetchRegistries();

  if (isEditing.value) {
    try {
      const data = (await $fetch(
        `/api/admin/courses/${route.query.id}`
      )) as any;
      form.value = {
        ...data,
      };
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Registry Failure",
        detail: "Failed to load course intelligence.",
        life: 5000,
      });
      router.push("/dashboard/inventory/courses");
    } finally {
      isLoading.value = false;
    }
  } else {
    isLoading.value = false;
  }
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    const endpoint = isEditing.value
      ? `/api/admin/courses/${route.query.id}`
      : "/api/admin/courses";

    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(endpoint, {
      method,
      body: form.value,
    });

    toast.add({
      severity: "success",
      summary: "Registry Synchronized",
      detail: `Academic asset ${
        isEditing.value ? "updated" : "provisioned"
      } successfully.`,
      life: 3000,
    });
    router.push("/dashboard/inventory/courses");
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Sync Failure",
      detail: error.data?.message || "Critical error during registry update.",
      life: 5000,
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 pb-20">
    <!-- Tactical Navigation -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/dashboard/inventory/courses"
        class="group flex items-center gap-3 text-surface-500 hover:text-white transition-all"
      >
        <div
          class="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all"
        >
          <i class="pi pi-arrow-left text-[10px]" />
        </div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em]"
          >Return to Catalog</span
        >
      </NuxtLink>

      <div class="flex items-center gap-4 text-right">
        <div>
          <h1 class="text-2xl font-black text-white uppercase tracking-tighter">
            PROVISION <span class="text-primary-500 italic">ASSET.</span>
          </h1>
          <p
            class="text-[9px] text-surface-500 font-bold uppercase tracking-[0.3em] mt-1"
          >
            Institutional Program Deployment Protocol
          </p>
        </div>
      </div>
    </div>

    <!-- Core Intelligence Matrix -->
    <div v-if="isLoading" class="space-y-6">
      <Skeleton height="400px" border-radius="24px" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Core Definition -->
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
            >
              <i class="pi pi-info-circle text-primary-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Core Program Identity
              </h2>
              <p
                class="text-[9px] text-surface-500 font-medium uppercase tracking-widest mt-1 italic"
              >
                Define the primary academic parameters
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Academic Institution</label
              >
              <Select
                v-model="form.universityId"
                :options="universities"
                optionLabel="name"
                optionValue="id"
                placeholder="Select University"
                class="neural-select"
                filter
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Program Level</label
              >
              <Select
                v-model="form.levelId"
                :options="programLevels"
                optionLabel="name"
                optionValue="id"
                placeholder="Qualification Tier"
                class="neural-select"
                filter
              />
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Program Name</label
              >
              <InputText
                v-model="form.name"
                placeholder="e.g. B.Sc. in Computer Science & Engineering"
                class="neural-input"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Course Code (Internal)</label
              >
              <InputText
                v-model="form.code"
                placeholder="e.g. CSE_OXF_01"
                class="neural-input"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Campus Location</label
              >
              <InputText
                v-model="form.campus"
                placeholder="e.g. Main Campus / City Center"
                class="neural-input"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Study Area</label
              >
              <Select
                v-model="form.studyAreaId"
                :options="studyAreas"
                optionLabel="name"
                optionValue="id"
                placeholder="Select Field"
                class="neural-select"
                filter
                @change="form.disciplineId = ''"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Discipline Area</label
              >
              <Select
                v-model="form.disciplineId"
                :options="filteredDisciplines"
                optionLabel="name"
                optionValue="id"
                placeholder="Specific Branch"
                class="neural-select"
                filter
                :disabled="!form.studyAreaId"
              />
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Course Primary URL</label
              >
              <InputText
                v-model="form.courseUrl"
                placeholder="https://university.edu/courses/specific-course-link"
                class="neural-input"
              />
            </div>
          </div>
        </div>

        <!-- Operational Matrix -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center"
            >
              <i class="pi pi-calendar text-orange-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Operational Cadence
              </h2>
              <p
                class="text-[9px] text-surface-500 font-medium uppercase tracking-widest mt-1 italic"
              >
                Temporal and duration parameters
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Program Duration</label
              >
              <InputText
                v-model="form.duration"
                placeholder="e.g. 3 Years / 6 Semesters"
                class="neural-input"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Application Deadline</label
              >
              <InputText
                v-model="form.applicationDeadline"
                placeholder="e.g. 15th July for Autumn Intake"
                class="neural-input"
              />
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Intake Windows</label
              >
              <MultiSelect
                v-model="form.intakeMonths"
                :options="months"
                placeholder="Select Cycles"
                class="neural-select"
                display="chip"
              />
            </div>
          </div>
        </div>

        <!-- Financial Matrix -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            >
              <i class="pi pi-dollar text-emerald-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Financial Intelligence
              </h2>
              <p
                class="text-[9px] text-surface-500 font-medium uppercase tracking-widest mt-1 italic"
              >
                Investment and commission structure
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest block"
                >Yearly Tuition Fee</label
              >
              <div class="flex gap-2">
                <Select
                  v-model="form.currency"
                  :options="currencies"
                  class="neural-select !w-32"
                />
                <InputNumber
                  v-model="form.tuitionFee"
                  placeholder="0.00"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="flex-1"
                  inputClass="neural-input"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Application Fee</label
              >
              <InputNumber
                v-model="form.applicationFee"
                placeholder="0.00"
                mode="decimal"
                :minFractionDigits="2"
                inputClass="neural-input"
              />
            </div>

            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Expected Commission</label
              >
              <InputText
                v-model="form.expectedCommission"
                placeholder="e.g. 10% or 500 USD per intake"
                class="neural-input"
              />
            </div>
          </div>
        </div>

        <!-- Academic Prerequisites -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center"
            >
              <i class="pi pi-book text-purple-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Academic Prerequisites
              </h2>
              <p
                class="text-[9px] text-surface-500 font-medium uppercase tracking-widest mt-1 italic"
              >
                Entry and proficiency requirements
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >General Entry Requirements</label
              >
              <Textarea
                v-model="form.entryRequirements"
                rows="4"
                placeholder="Describe academic backgrounds required..."
                class="neural-input resize-none!"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >English Proficiency Requirements</label
              >
              <InputText
                v-model="form.englishRequirements"
                placeholder="e.g. IELTS 6.5 (No band less than 6.0)"
                class="neural-input"
              />
            </div>

            <div
              class="flex items-center justify-between p-4 bg-white/3 rounded-2xl border border-white/5"
            >
              <div class="flex flex-col gap-0.5">
                <span
                  class="text-[10px] font-black text-white uppercase tracking-wider"
                  >MOI Accepted</span
                >
                <span
                  class="text-[9px] text-surface-500 font-bold uppercase tracking-widest"
                  >Medium of Instruction Waiver Available</span
                >
              </div>
              <ToggleSwitch v-model="form.moiAccepted" />
            </div>

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Standardized Test Requirements</label
              >
              <InputText
                v-model="form.standardizedTests"
                placeholder="e.g. SAT, GRE, GMAT (if applicable)"
                class="neural-input"
              />
            </div>
          </div>
        </div>

        <!-- Strategic Conversion Flags -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
            >
              <i class="pi pi-bolt text-cyan-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Strategic Conversion Hooks
              </h2>
              <p
                class="text-[9px] text-surface-500 font-medium uppercase tracking-widest mt-1 italic"
              >
                Primary filters for the Recommendation Engine
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <!-- Admission Group -->
            <div class="space-y-4">
              <h3
                class="text-[10px] font-black text-primary-500 uppercase tracking-widest border-b border-primary-500/10 pb-2"
              >
                Admission Velocity
              </h3>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Faster Offer TAT</span
                >
                <ToggleSwitch v-model="form.isFastTrack" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Scholarship Available</span
                >
                <ToggleSwitch v-model="form.hasScholarship" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >High Acceptance Rate</span
                >
                <ToggleSwitch v-model="form.highAcceptanceRate" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >STEM Designation</span
                >
                <ToggleSwitch v-model="form.isStem" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >No Interview Required</span
                >
                <ToggleSwitch v-model="form.isInterviewOptional" />
              </div>
            </div>

            <!-- Financial Group -->
            <div class="space-y-4">
              <h3
                class="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-500/10 pb-2"
              >
                Financial Hooks
              </h3>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >App Fee Waiver</span
                >
                <ToggleSwitch v-model="form.hasAppFeeWaiver" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Low Tuition Deposit</span
                >
                <ToggleSwitch v-model="form.lowTuitionDeposit" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Loan Support (Non-Coll)</span
                >
                <ToggleSwitch v-model="form.hasLoanSupport" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Affordable Tier</span
                >
                <ToggleSwitch v-model="form.isAffordable" />
              </div>
            </div>

            <!-- Career & Location Group -->
            <div class="space-y-4">
              <h3
                class="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-blue-500/10 pb-2"
              >
                Location & Career
              </h3>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Major City Location</span
                >
                <ToggleSwitch v-model="form.isMajorCity" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Regional Advantage</span
                >
                <ToggleSwitch v-model="form.isRegional" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Co-op/Internship Inc</span
                >
                <ToggleSwitch v-model="form.hasCoop" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >High Job Demand Field</span
                >
                <ToggleSwitch v-model="form.highJobDemand" />
              </div>
            </div>

            <!-- Academic Group -->
            <div class="space-y-4">
              <h3
                class="text-[10px] font-black text-purple-500 uppercase tracking-widest border-b border-purple-500/10 pb-2"
              >
                Requirement Architecture
              </h3>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >English Exam Waiver</span
                >
                <ToggleSwitch v-model="form.hasEnglishWaiver" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Without Mathematics</span
                >
                <ToggleSwitch v-model="form.hasMathsWaiver" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Without GRE/GMAT</span
                >
                <ToggleSwitch v-model="form.hasGreGmatWaiver" />
              </div>
              <div
                class="flex items-center justify-between p-3 bg-white/2 rounded-xl border border-white/5"
              >
                <span
                  class="text-[9px] font-black text-surface-300 uppercase tracking-widest"
                  >Work Exp. Required</span
                >
                <ToggleSwitch v-model="form.requiresWorkExp" />
              </div>
            </div>

            <!-- Dynamic Intelligence Tags -->
            <div
              class="flex flex-col gap-2 md:col-span-2 mt-4 pt-6 border-t border-white/5"
            >
              <label
                class="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]"
                >Strategic Intelligence Tags</label
              >
              <MultiSelect
                v-model="form.strategicFlags"
                :options="strategicAttributeOptions"
                placeholder="Assign Strategic Attributes"
                class="neural-select mt-2"
                display="chip"
              />
              <p
                class="text-[8px] text-surface-500 font-medium tracking-widest mt-2 uppercase italic"
              >
                Select additional institutional markers for applicant
                recommendation
              </p>
            </div>
          </div>
        </div>

        <!-- Dynamic Asset Registry -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
            >
              <i class="pi pi-tags text-cyan-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Metadata Registry
              </h2>
              <p
                class="text-[9px] text-surface-500 font-medium uppercase tracking-widest mt-1 italic"
              >
                Flexible admission requirements and edge-case intelligence
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="(value, key) in form.additionalRequirements"
              :key="key"
              class="flex gap-4 items-start"
            >
              <InputText
                :value="key"
                readonly
                class="neural-input w-1/3! bg-white/5!"
              />
              <InputText
                v-model="form.additionalRequirements[key]"
                class="neural-input flex-1"
              />
              <button
                @click="delete form.additionalRequirements[key]"
                class="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500/20 transition-all flex items-center justify-center"
              >
                <i class="pi pi-times" />
              </button>
            </div>

            <div class="flex gap-4 pt-4 border-t border-white/5">
              <InputText
                v-model="newRequirementKey"
                placeholder="Requirement Label (e.g. Portfolio)"
                class="neural-input flex-1"
              />
              <button
                @click="addRequirement"
                class="px-6 h-12 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all"
              >
                Add Registry Link
              </button>
            </div>
          </div>
        </div>

        <!-- Intelligence Workspace -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
            >
              <i class="pi pi-pencil text-blue-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Intelligence Workspace
              </h2>
              <p
                class="text-[9px] text-surface-500 font-medium uppercase tracking-widest mt-1 italic"
              >
                Internal remarks and additional intelligence
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Remarks</label
              >
              <Textarea
                v-model="form.remarks"
                rows="2"
                class="neural-input resize-none!"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
                >Extra Notes</label
              >
              <Textarea
                v-model="form.extraNotes"
                rows="2"
                class="neural-input resize-none!"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Status & Finalize -->
      <div class="space-y-6">
        <div
          class="bg-surface-900/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-xl space-y-8 sticky top-6"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"
            >
              <i class="pi pi-shield text-blue-400" />
            </div>
            <div>
              <h2
                class="text-sm font-black text-white uppercase tracking-widest"
              >
                Registry Status
              </h2>
            </div>
          </div>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 bg-white/3 rounded-2xl border border-white/5"
            >
              <div class="flex flex-col gap-0.5">
                <span
                  class="text-[10px] font-black text-white uppercase tracking-wider"
                  >Registry Visibility</span
                >
              </div>
              <ToggleSwitch v-model="form.isActive" />
            </div>
          </div>

          <div class="space-y-4 pt-4 border-t border-white/5">
            <button
              @click="handleSave"
              :disabled="isSaving"
              class="w-full py-4 bg-primary-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-400 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <i v-if="isSaving" class="pi pi-spin pi-spinner" />
              <i v-else class="pi pi-check" />
              {{ isEditing ? "Update Asset" : "Deploy Program" }}
            </button>
            <button
              @click="router.push('/dashboard/inventory/courses')"
              class="w-full py-4 bg-white/5 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all border border-white/5"
            >
              Cancel
            </button>
          </div>

          <div
            v-if="isEditing"
            class="bg-surface-500/5 rounded-2xl p-4 border border-white/5"
          >
            <div class="flex flex-col gap-1">
              <span
                class="text-[8px] font-bold text-surface-500 uppercase tracking-widest"
                >Registry ID</span
              >
              <span
                class="text-[9px] font-mono text-primary-400 break-all uppercase"
                >{{ form.id }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.neural-input),
:deep(.neural-select) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 16px !important;
  padding: 0.85rem 1.25rem !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: white !important;
  transition: all 0.2s !important;
  width: 100% !important;
}

:deep(.neural-select) {
  padding: 0 !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.p-select-label),
:deep(.p-multiselect-label) {
  padding: 0.85rem 1.25rem !important;
  background: transparent !important;
  color: white !important;
  font-size: 11px !important;
}

:deep(.p-multiselect-label) {
  display: flex !important;
  gap: 0.5rem !important;
  flex-wrap: wrap !important;
}

:deep(.p-multiselect-chip) {
  background: rgba(99, 102, 241, 0.2) !important;
  border: 1px solid rgba(99, 102, 241, 0.3) !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 8px !important;
}

:deep(.p-multiselect-chip-text) {
  font-size: 9px !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  color: #a5b4fc !important;
}

:deep(.p-select-dropdown),
:deep(.p-multiselect-dropdown) {
  width: 3.5rem !important;
}

:deep(.neural-input:focus),
:deep(.neural-select:focus-within) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(99, 102, 241, 0.5) !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.p-select-panel),
:deep(.p-multiselect-panel) {
  background: rgba(10, 10, 10, 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  border-radius: 20px !important;
  padding: 0.5rem !important;
}

:deep(.p-select-filter-container),
:deep(.p-multiselect-filter-container) {
  padding: 0.75rem !important;
}

:deep(.p-select-filter),
:deep(.p-multiselect-filter) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
  padding: 0.6rem 0.85rem !important;
  font-size: 11px !important;
  color: white !important;
}

:deep(.p-select-option),
:deep(.p-multiselect-option) {
  padding: 0.75rem 1rem !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #94a3b8 !important;
  border-radius: 10px !important;
  margin-bottom: 2px !important;
  transition: all 0.2s !important;
}

:deep(.p-select-option:hover),
:deep(.p-select-option.p-highlight),
:deep(.p-multiselect-option:hover),
:deep(.p-multiselect-option.p-highlight) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}

:deep(.p-toggle-switch) {
  width: 40px !important;
  height: 20px !important;
}

:deep(.p-toggle-switch-slider) {
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.p-toggle-switch-slider:before) {
  width: 14px !important;
  height: 14px !important;
  left: 3px !important;
  bottom: 3px !important;
}

:deep(.p-toggle-switch.p-highlight .p-toggle-switch-slider) {
  background: #6366f1 !important;
}
</style>
