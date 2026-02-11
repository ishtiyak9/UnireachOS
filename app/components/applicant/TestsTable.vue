<script setup lang="ts">
import { ref, watch } from "vue";
import type { EnglishProficiency } from "@prisma/client";

// --- Props & Emits ---
const props = defineProps<{
  modelValue: Partial<EnglishProficiency>[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Partial<EnglishProficiency>[]): void;
}>();

// --- State ---
const localTests = ref<Partial<EnglishProficiency>[]>([]);
const isInitialized = ref(false);

const testTypes = ["IELTS", "TOEFL", "PTE", "DUOLINGO", "GRE", "GMAT", "OTHER"];

// --- Helpers ---
function createEmptyTest(): Partial<EnglishProficiency> {
  return {
    testName: "IELTS" as any,
    examDate: undefined,
    overallScore: 0,
    reading: null,
    writing: null,
    listening: null,
    speaking: null,
    trfNumber: "",
    scoreDetails: {}, // For GRE/GMAT/Duolingo specifics
  };
}

function ensureMinimumEntries() {
  if (localTests.value.length === 0) {
    localTests.value.push(createEmptyTest());
  }
}

// --- Watchers ---
watch(
  () => props.modelValue,
  (newVal) => {
    if (JSON.stringify(newVal) === JSON.stringify(localTests.value)) return;

    // Deep copy and parse dates
    const copy = JSON.parse(JSON.stringify(newVal || []));
    copy.forEach((t: any) => {
      if (t.examDate) t.examDate = new Date(t.examDate);
      // Ensure scoreDetails is an object
      if (!t.scoreDetails) t.scoreDetails = {};
    });

    localTests.value = copy;
    ensureMinimumEntries();
    isInitialized.value = true;
  },
  { immediate: true, deep: true }
);

watch(
  localTests,
  (newVal) => {
    if (!isInitialized.value) return;
    emit("update:modelValue", newVal);
  },
  { deep: true }
);

// --- Actions ---
const addTest = () => {
  localTests.value.push(createEmptyTest());
};

const removeTest = (index: number) => {
  localTests.value.splice(index, 1);
  ensureMinimumEntries();
};

const isStandardTest = (type: string) =>
  ["IELTS", "TOEFL", "PTE"].includes(type);
const isDuolingo = (type: string) => type === "DUOLINGO";
const isGRE = (type: string) => type === "GRE";
const isGMAT = (type: string) => type === "GMAT";

// Handler to reset fields when type changes?
// Maybe nice to keep overall, but fields differ.
const handleTypeChange = (index: number) => {
  const test = localTests.value[index];
  test.reading = null;
  test.writing = null;
  test.listening = null;
  test.speaking = null;
  test.scoreDetails = {};
  test.overallScore = 0;
};
</script>

<template>
  <div class="space-y-8">
    <div
      v-for="(test, index) in localTests"
      :key="index"
      class="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group animate-fade-in-up"
    >
      <!-- Remove Button -->
      <button
        v-if="localTests.length > 0"
        @click="removeTest(index)"
        class="absolute top-4 right-4 text-surface-500 hover:text-red-400 transition-colors"
        title="Remove Test"
      >
        <i class="pi pi-trash" />
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Test Type -->
        <div class="col-span-1 md:col-span-2 lg:col-span-1 space-y-2">
          <label
            class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Test Type <span class="text-red-400">*</span>
          </label>
          <Dropdown
            v-model="test.testName"
            :options="testTypes"
            placeholder="Select Test"
            class="w-full !bg-white/5 !border-white/10 !text-white text-sm"
            @change="handleTypeChange(index)"
          />
        </div>

        <!-- Exam Date -->
        <div class="col-span-1 md:col-span-2 lg:col-span-1 space-y-2">
          <label
            class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
          >
            Exam Date <span class="text-red-400">*</span>
          </label>
          <Calendar
            v-model="test.examDate"
            dateFormat="dd/mm/yy"
            placeholder="Select Date"
            showIcon
            class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white [&>input]:text-sm"
          />
        </div>

        <!-- TRF / Reg Number -->
        <div class="col-span-1 md:col-span-2 space-y-2">
          <label
            class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
          >
            TRF / Registration No.
          </label>
          <InputText
            v-model="test.trfNumber"
            placeholder="e.g. 123456789"
            class="w-full !bg-white/5 !border-white/10 !text-white text-sm focus:!border-primary-500/50 focus:!ring-0"
          />
        </div>

        <!-- Extra Flags -->
        <div
          class="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
          >
            <Checkbox
              v-model="test.certificatePending"
              :binary="true"
              inputId="certPending"
            />
            <label
              for="certPending"
              class="text-xs text-surface-200 cursor-pointer select-none"
            >
              Yet to Receive Certificate?
            </label>
          </div>
          <div
            class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
          >
            <Checkbox v-model="test.hasMOI" :binary="true" inputId="hasMOI" />
            <label
              for="hasMOI"
              class="text-xs text-surface-200 cursor-pointer select-none"
            >
              Have Medium of Instruction (MOI)?
            </label>
          </div>
        </div>

        <!-- Standard Scores (IELTS/TOEFL/PTE) -->
        <template v-if="!test.certificatePending">
          <template v-if="isStandardTest(test.testName as string)">
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Overall</label
              >
              <InputNumber
                v-model="test.overallScore"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Listening</label
              >
              <InputNumber
                v-model="test.listening"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Reading</label
              >
              <InputNumber
                v-model="test.reading"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Writing</label
              >
              <InputNumber
                v-model="test.writing"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Speaking</label
              >
              <InputNumber
                v-model="test.speaking"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
          </template>

          <!-- Use scoreDetails for others -->
          <!-- DUOLINGO -->
          <template v-if="isDuolingo(test.testName as string)">
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Overall Score</label
              >
              <InputNumber
                v-model="test.overallScore"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <!-- Duolingo Subscores stored in scoreDetails -->
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Literacy</label
              >
              <InputNumber
                v-model="test.scoreDetails.literacy"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Comprehension</label
              >
              <InputNumber
                v-model="test.scoreDetails.comprehension"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Conversation</label
              >
              <InputNumber
                v-model="test.scoreDetails.conversation"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Production</label
              >
              <InputNumber
                v-model="test.scoreDetails.production"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
          </template>

          <!-- GRE -->
          <template v-if="isGRE(test.testName as string)">
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Total Score</label
              >
              <InputNumber
                v-model="test.overallScore"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
                placeholder="e.g. 320"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Verbal Reasoning</label
              >
              <InputNumber
                v-model="test.scoreDetails.verbal"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
                placeholder="130-170"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Quant Reasoning</label
              >
              <InputNumber
                v-model="test.scoreDetails.quant"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
                placeholder="130-170"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Analytical Writing</label
              >
              <InputNumber
                v-model="test.scoreDetails.awa"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
                placeholder="0-6.0"
              />
            </div>
          </template>

          <!-- GMAT -->
          <template v-if="isGMAT(test.testName as string)">
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Total Score</label
              >
              <InputNumber
                v-model="test.overallScore"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
                placeholder="200-800"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Verbal</label
              >
              <InputNumber
                v-model="test.scoreDetails.verbal"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >Quant</label
              >
              <InputNumber
                v-model="test.scoreDetails.quant"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >IR</label
              >
              <InputNumber
                v-model="test.scoreDetails.ir"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
            <div class="col-span-1 space-y-2">
              <label
                class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
                >AWA</label
              >
              <InputNumber
                v-model="test.scoreDetails.awa"
                :minFractionDigits="1"
                :maxFractionDigits="1"
                class="w-full [&>input]:!bg-white/5 [&>input]:!border-white/10 [&>input]:!text-white"
              />
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Add Button -->
    <div class="flex justify-center">
      <Button
        label="Add Test"
        icon="pi pi-plus"
        size="small"
        text
        @click="addTest"
        class="!text-primary-400 hover:!text-primary-300 !text-xs uppercase tracking-widest font-black"
      />
    </div>
  </div>
</template>
