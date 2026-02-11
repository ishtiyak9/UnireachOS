<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Education {
  id?: string;
  level: string;
  country: string;
  state: string;
  city: string;
  institutionName: string;
  boardOrUniversity: string;
  qualification?: string;
  gradingSystem: string;
  score: string;
  primaryLanguage: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  isPursuing?: boolean;
}

const props = defineProps<{
  modelValue: Education[];
  loading?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

// Ensure local reactive copy
const localEducation = ref<Education[]>([]);

// Initialize or Sync
watch(
  () => props.modelValue,
  (newVal) => {
    // Deep copy to avoid mutation issues until emit
    const copy = JSON.parse(JSON.stringify(newVal || []));

    // Convert string dates to Date objects for Calendar compatibility
    copy.forEach((e: any) => {
      if (e.startDate) e.startDate = new Date(e.startDate);
      if (e.endDate) e.endDate = new Date(e.endDate);
    });

    // Ensure Grade 10 exists
    if (!copy.find((e: Education) => e.level === "GRADE_10")) {
      copy.push(createEmptyEducation("GRADE_10"));
    }
    // Ensure Grade 12 exists
    if (!copy.find((e: Education) => e.level === "GRADE_12")) {
      copy.push(createEmptyEducation("GRADE_12"));
    }

    // Sort: Grade 10, Grade 12, then others by date or creation?
    // Let's just keep 10 and 12 at top for display logic

    localEducation.value = copy;
  },
  { immediate: true, deep: true }
);

// Watch for changes to emit back
watch(
  localEducation,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { deep: true }
);

function createEmptyEducation(level: string = ""): Education {
  return {
    level,
    country: "",
    state: "",
    city: "",
    institutionName: "",
    boardOrUniversity: "",
    qualification: "",
    gradingSystem: "",
    score: "",
    primaryLanguage: "",
    startDate: null,
    endDate: null,
    isPursuing: false,
  };
}

// -- Computed Groups --

const grade10 = computed(() =>
  localEducation.value.find((e) => e.level === "GRADE_10")
);

const grade12 = computed(() =>
  localEducation.value.find((e) => e.level === "GRADE_12")
);

// Other qualifications (Undergrad, Postgrad, Diploma, etc.)
const otherEducation = computed(() =>
  localEducation.value.filter(
    (e) => e.level !== "GRADE_10" && e.level !== "GRADE_12"
  )
);

// -- Options --
const educationLevels = [
  { label: "Undergraduate", value: "UNDERGRADUATE" },
  { label: "Postgraduate", value: "POSTGRADUATE" },
  { label: "Diploma", value: "DIPLOMA" },
  { label: "PhD", value: "PHD" },
  { label: "Other", value: "OTHER" },
];

const gradingSystems = [
  { label: "GPA (4.0 Scale)", value: "GPA_4" },
  { label: "GPA (5.0 Scale)", value: "GPA_5" },
  { label: "Percentage %", value: "PERCENTAGE" },
  { label: "Letter Grade", value: "LETTER" },
  { label: "Division/Class", value: "CLASS" },
  { label: "Other", value: "OTHER" },
];

// -- Actions --

const addQualification = () => {
  localEducation.value.push(createEmptyEducation("UNDERGRADUATE"));
};

const removeQualification = (indexInOther: number) => {
  // Find the actual item in the main array
  const item = otherEducation.value[indexInOther];
  if (!item) return;

  const mainIndex = localEducation.value.indexOf(item);
  if (mainIndex > -1) {
    localEducation.value.splice(mainIndex, 1);
  }
};
</script>

<template>
  <div class="space-y-8">
    <!-- 1. Grade 10 (Mandatory) -->
    <div
      v-if="grade10"
      class="bg-white/[0.02] border border-white/10 rounded-2xl p-6"
    >
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs"
        >
          10
        </div>
        <div>
          <h3 class="text-sm font-bold text-white">
            Grade 10 / Secondary Schooling
          </h3>
          <p class="text-xs text-surface-400">Mandatory</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Institution -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Name of Institution *</label
          >
          <InputText
            v-model="grade10.institutionName"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="School Name"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Board / University *</label
          >
          <InputText
            v-model="grade10.boardOrUniversity"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. CBSE, IB, State Board"
          />
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Country *</label
          >
          <InputText
            v-model="grade10.country"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >State *</label
          >
          <InputText
            v-model="grade10.state"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >City *</label
          >
          <InputText
            v-model="grade10.city"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>

        <!-- Academic Details -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Primary Language *</label
          >
          <InputText
            v-model="grade10.primaryLanguage"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. English"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Grading System *</label
          >
          <Select
            v-model="grade10.gradingSystem"
            :options="gradingSystems"
            optionLabel="label"
            optionValue="value"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="Select System"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Score / CGPA *</label
          >
          <InputText
            v-model="grade10.score"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. 3.8 or 85%"
          />
        </div>

        <!-- Dates -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Start Date *</label
          >
          <Calendar v-model="grade10.startDate" class="w-full" showIcon />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >End Date</label
          >
          <Calendar v-model="grade10.endDate" class="w-full" showIcon />
        </div>
      </div>
    </div>

    <!-- 2. Grade 12 (Mandatory) -->
    <div
      v-if="grade12"
      class="bg-white/[0.02] border border-white/10 rounded-2xl p-6"
    >
      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs"
        >
          12
        </div>
        <div>
          <h3 class="text-sm font-bold text-white">
            Grade 12 / Higher Secondary
          </h3>
          <p class="text-xs text-surface-400">Mandatory</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Institution -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Name of Institution *</label
          >
          <InputText
            v-model="grade12.institutionName"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="College Name"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Board / University *</label
          >
          <InputText
            v-model="grade12.boardOrUniversity"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. CBSE, ISC"
          />
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Country *</label
          >
          <InputText
            v-model="grade12.country"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >State *</label
          >
          <InputText
            v-model="grade12.state"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >City *</label
          >
          <InputText
            v-model="grade12.city"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>

        <!-- Academic Details -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Primary Language *</label
          >
          <InputText
            v-model="grade12.primaryLanguage"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. English"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Grading System *</label
          >
          <Select
            v-model="grade12.gradingSystem"
            :options="gradingSystems"
            optionLabel="label"
            optionValue="value"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="Select System"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Score / CGPA *</label
          >
          <InputText
            v-model="grade12.score"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. 3.8 or 85%"
          />
        </div>

        <!-- Qualification Title (Optional distinction like "Science Stream") -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Qualification / Stream</label
          >
          <InputText
            v-model="grade12.qualification"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. Science, Commerce"
          />
        </div>

        <!-- Dates -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Start Date *</label
          >
          <Calendar v-model="grade12.startDate" class="w-full" showIcon />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >End Date</label
          >
          <Calendar v-model="grade12.endDate" class="w-full" showIcon />
        </div>
      </div>
    </div>

    <!-- 3. Higher Education Loop -->
    <div
      v-for="(edu, index) in otherEducation"
      :key="edu.id || index"
      class="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative group"
    >
      <!-- Remove Button -->
      <button
        @click="removeQualification(index)"
        class="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-surface-400 hover:text-red-400 transition-colors"
        type="button"
      >
        <i class="pi pi-trash text-sm" />
      </button>

      <div class="flex items-center gap-3 mb-6">
        <div
          class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs"
        >
          {{ index + 1 }}
        </div>
        <div class="flex flex-col">
          <h3 class="text-sm font-bold text-white">Additional Qualification</h3>
          <div class="mt-1">
            <Select
              v-model="edu.level"
              :options="educationLevels"
              optionLabel="label"
              optionValue="value"
              class="!h-8 !text-xs w-40"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Institution -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Name of Institution *</label
          >
          <InputText
            v-model="edu.institutionName"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="University Name"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Board / University *</label
          >
          <InputText
            v-model="edu.boardOrUniversity"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="Affiliating University"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Degree / Qualification *</label
          >
          <InputText
            v-model="edu.qualification"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. B.Tech Computer Science"
          />
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Country *</label
          >
          <InputText
            v-model="edu.country"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >State *</label
          >
          <InputText
            v-model="edu.state"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >City *</label
          >
          <InputText
            v-model="edu.city"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>

        <!-- Academic Details -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Primary Language *</label
          >
          <InputText
            v-model="edu.primaryLanguage"
            class="w-full !bg-white/5 !border-white/10"
            placeholder="e.g. English"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Grading System *</label
          >
          <Select
            v-model="edu.gradingSystem"
            :options="gradingSystems"
            optionLabel="label"
            optionValue="value"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Score / CGPA *</label
          >
          <InputText
            v-model="edu.score"
            class="w-full !bg-white/5 !border-white/10"
          />
        </div>

        <!-- Dates -->
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >Start Date *</label
          >
          <Calendar v-model="edu.startDate" class="w-full" showIcon />
        </div>
        <div class="space-y-2">
          <label
            class="text-[10px] uppercase font-bold text-surface-400 tracking-wider"
            >End Date</label
          >
          <Calendar
            v-model="edu.endDate"
            class="w-full"
            showIcon
            :disabled="edu.isPursuing"
          />
        </div>
        <div class="flex items-center gap-2 pt-6">
          <Checkbox v-model="edu.isPursuing" :binary="true" />
          <label class="text-xs text-white">Currently Pursuing</label>
        </div>
      </div>
    </div>

    <!-- Add Button -->
    <button
      @click="addQualification"
      type="button"
      class="w-full py-4 rounded-2xl border border-dashed border-white/10 text-surface-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-bold flex items-center justify-center gap-2"
    >
      <i class="pi pi-plus" />
      Add Qualification (Undergrad, Postgrad, etc.)
    </button>
  </div>
</template>
