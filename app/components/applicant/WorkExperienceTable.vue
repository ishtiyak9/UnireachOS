<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { WorkExperience } from "@prisma/client";

// --- Props & Emits ---
const props = defineProps<{
  modelValue: Partial<WorkExperience>[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Partial<WorkExperience>[]): void;
}>();

// --- State ---
const localExperience = ref<Partial<WorkExperience>[]>([]);
const isInitialized = ref(false);

// --- Helpers ---
function createEmptyExperience(): Partial<WorkExperience> {
  return {
    employerName: "",
    address: "",
    designation: "",
    startDate: undefined,
    endDate: undefined,
    isCurrent: false,
    responsibilities: "",
  };
}

// Initialize with one empty block if list is empty
function ensureMinimumEntries() {
  if (localExperience.value.length === 0) {
    localExperience.value.push(createEmptyExperience());
  }
}

// --- Watchers ---

// 1. Sync Prop -> Local State
watch(
  () => props.modelValue,
  (newVal) => {
    // Prevent infinite loops or overwriting ongoing edits if structure is same
    // But we need to handle initial load where props might come in as JSON strings for dates
    if (JSON.stringify(newVal) === JSON.stringify(localExperience.value)) {
      return;
    }

    const copy = JSON.parse(JSON.stringify(newVal || []));

    // Fix Date objects if they are strings (JSON serialization)
    copy.forEach((exp: any) => {
      if (exp.startDate) exp.startDate = new Date(exp.startDate);
      if (exp.endDate) exp.endDate = new Date(exp.endDate);
    });

    localExperience.value = copy;
    ensureMinimumEntries();
    isInitialized.value = true;
  },
  { immediate: true, deep: true }
);

// 2. Sync Local State -> Prop
watch(
  localExperience,
  (newVal) => {
    if (!isInitialized.value) return;
    emit("update:modelValue", newVal);
  },
  { deep: true }
);

// --- Actions ---
const addExperience = () => {
  localExperience.value.push(createEmptyExperience());
};

const removeExperience = (index: number) => {
  localExperience.value.splice(index, 1);
  ensureMinimumEntries(); // Ensure at least one empty block remains if specific requirement, or strictly allow empty list?
  // User Requirement: "Applicant can add as many work history as possible"
  // Usually implies starting with one or zero. If zero, we might want a "Add Work Experience" button outside.
  // But strict requirement suggests "infomations field for each block", implying at least one block if they are in this tab.
  // Let's stick to list logic: if they remove all, we can leave it empty or show a placeholder "No work experience added".
  // Let's allow empty list for flexibility, but `ensureMinimumEntries` forces one. I'll relax that if they delete explicitly.
  // Actually, standard UI is: if list empty, show "Add". If list has items, show them.
};

// Handle "I am currently working here" toggle
const handleCurrentToggle = (index: number) => {
  const exp = localExperience.value[index];
  if (exp.isCurrent) {
    exp.endDate = null; // Clear end date if currently working
  }
};
</script>

<template>
  <div class="space-y-8">
    <div
      v-for="(exp, index) in localExperience"
      :key="index"
      class="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group animate-fade-in-up"
    >
      <!-- Remove Button -->
      <button
        v-if="localExperience.length > 0"
        @click="removeExperience(index)"
        class="absolute top-4 right-4 text-surface-500 hover:text-red-400 transition-colors"
        title="Remove Entry"
      >
        <i class="pi pi-trash" />
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Organization Name -->
        <div class="space-y-2">
          <label
            class="text-[12px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Name of the Organisation <span class="text-red-400">*</span>
          </label>
          <InputText
            v-model="exp.employerName"
            placeholder="e.g. Google, Unireach"
            class="w-full !bg-white/5 !border-white/10 !text-white text-sm focus:!border-primary-500/50 focus:!ring-0"
          />
        </div>

        <!-- Designation -->
        <div class="space-y-2">
          <label
            class="text-[12px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Designation <span class="text-red-400">*</span>
          </label>
          <InputText
            v-model="exp.designation"
            placeholder="e.g. Senior Software Engineer"
            class="w-full !bg-white/5 !border-white/10 !text-white text-sm focus:!border-primary-500/50 focus:!ring-0"
          />
        </div>

        <!-- Organization Address -->
        <div class="col-span-1 md:col-span-2 space-y-2">
          <label
            class="text-[12px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Organisation Address <span class="text-red-400">*</span>
          </label>
          <InputText
            v-model="exp.address"
            placeholder="Full address of the company"
            class="w-full !bg-white/5 !border-white/10 !text-white text-sm focus:!border-primary-500/50 focus:!ring-0"
          />
        </div>

        <!-- Working From -->
        <div class="space-y-2">
          <label
            class="text-[12px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Working From <span class="text-red-400">*</span>
          </label>
          <Calendar
            v-model="exp.startDate"
            view="month"
            dateFormat="mm/yy"
            placeholder="Select Start Date"
            showIcon
            class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white [&>input]:text-sm"
          />
        </div>

        <!-- Working Till -->
        <div class="space-y-2">
          <label
            class="text-[12px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Working Till
          </label>
          <div class="flex flex-col gap-2">
            <Calendar
              v-model="exp.endDate"
              view="month"
              dateFormat="mm/yy"
              placeholder="Select End Date"
              showIcon
              :disabled="exp.isCurrent"
              class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white [&>input]:text-sm disabled:[&>input]:opacity-50"
            />
            <div class="flex items-center gap-2">
              <Checkbox
                v-model="exp.isCurrent"
                :binary="true"
                inputId="current-{{index}}"
                @change="handleCurrentToggle(index)"
                class="!border-white/10"
              />
              <label
                :for="'current-' + index"
                class="text-xs text-surface-300 cursor-pointer select-none"
              >
                I am currently working here
              </label>
            </div>
          </div>
        </div>

        <!-- Responsibilities -->
        <div class="col-span-1 md:col-span-2 space-y-2">
          <label
            class="text-[12px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Responsibilities (Description)
          </label>
          <Textarea
            v-model="exp.responsibilities"
            rows="3"
            placeholder="Describe your key roles and achievements..."
            class="w-full !bg-white/5 !border-white/10 !text-white text-sm focus:!border-primary-500/50 focus:!ring-0"
          />
        </div>
      </div>
    </div>

    <!-- Add Button -->
    <div class="flex justify-center">
      <Button
        label="Add Work History"
        icon="pi pi-plus"
        size="small"
        text
        @click="addExperience"
        class="!text-primary-400 hover:!text-primary-300 !text-[12px] uppercase tracking-widest font-black"
      />
    </div>
  </div>
</template>
