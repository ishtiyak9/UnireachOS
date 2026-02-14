<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
  course: any;
  applicantId?: string | null;
}>();

const emit = defineEmits(["update:visible", "success"]);

const { user } = useUserSession();
const { data: students, pending: loadingStudents } = await useFetch(
  "/api/partners/students"
);

const selectedStudentId = ref<string | null>(props.applicantId || null);

watch(
  () => props.applicantId,
  (newId) => {
    if (newId) selectedStudentId.value = newId;
  }
);
const validationResults = ref(null);
const validating = ref(false);
const submitting = ref(false);

const checkReadiness = async (studentId: string) => {
  validating.value = true;
  validationResults.value = null;
  try {
    const data = await $fetch("/api/applicants/applications/validate", {
      query: { applicantId: studentId, courseId: props.course.id },
    });
    validationResults.value = data;
  } catch (e) {
    console.error("Sentinel failure", e);
  } finally {
    validating.value = false;
  }
};

watch(selectedStudentId, (newId) => {
  if (newId) checkReadiness(newId);
});

const submitApplication = async () => {
  if (!selectedStudentId.value || !props.course.id) return;
  submitting.value = true;
  try {
    const response = await $fetch("/api/applicants/applications/submit", {
      method: "POST",
      body: {
        applicantId: selectedStudentId.value,
        courseId: props.course.id,
      },
    });
    if (response.success) {
      emit("success", response.application);
      emit("update:visible", false);
    }
  } catch (e) {
    console.error("Submission failed", e);
  } finally {
    submitting.value = false;
  }
};

const isReady = computed(() => !!validationResults.value?.isCompliant);
const allMissingItems = computed(() => {
  if (!validationResults.value?.checks) return [];
  return Object.values(validationResults.value.checks).flatMap(
    (c: any) => c.missing
  );
});

const close = () => {
  emit("update:visible", false);
  selectedStudentId.value = null;
  validationResults.value = null;
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Strategic Enrollment Sentinel"
    :style="{ width: '30rem' }"
    class="partner-modal"
    @hide="close"
  >
    <div class="space-y-6 pt-4">
      <!-- Course Briefing -->
      <div
        class="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1"
      >
        <p
          class="text-[9px] font-black text-emerald-500 uppercase tracking-widest"
        >
          Target Objective
        </p>
        <p class="text-sm font-bold text-white">{{ course?.name }}</p>
        <p class="text-[10px] text-surface-400 font-mono">
          {{ course?.university?.name }}
        </p>
      </div>

      <!-- Student Selection -->
      <div class="space-y-2">
        <label
          class="text-[10px] font-black text-emerald-800 uppercase tracking-widest pl-1"
          >Assign Applicant</label
        >
        <Select
          v-model="selectedStudentId"
          :options="students || []"
          optionLabel="fullName"
          optionValue="id"
          placeholder="Select a student from your pipeline..."
          filter
          class="w-full bg-surface-950! border-emerald-900/20! text-sm!"
          :loading="loadingStudents"
        >
          <template #option="slotProps">
            <div class="flex flex-col">
              <span class="text-xs font-bold">{{
                slotProps.option.fullName
              }}</span>
              <span class="text-[9px] text-surface-500 font-mono">{{
                slotProps.option.email
              }}</span>
            </div>
          </template>
        </Select>
      </div>

      <!-- Sentinel Validation Output -->
      <div
        v-if="validating"
        class="flex flex-col items-center justify-center p-8 space-y-4"
      >
        <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="4" />
        <p
          class="text-[9px] font-black text-surface-500 uppercase tracking-widest animate-pulse"
        >
          Running Readiness Sentinel...
        </p>
      </div>

      <div
        v-else-if="validationResults"
        class="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500"
      >
        <div
          class="flex items-center gap-3 p-4 rounded-xl border"
          :class="
            isReady
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-rose-500/10 border-rose-500/20'
          "
        >
          <i
            :class="[
              isReady
                ? 'pi pi-check-circle text-emerald-500'
                : 'pi pi-exclamation-triangle text-rose-500',
              'text-xl',
            ]"
          ></i>
          <div>
            <p class="text-xs font-bold text-white">
              {{ isReady ? "Compliance Satisfied" : "Compliance Interrupted" }}
            </p>
            <p class="text-[10px] text-surface-400">
              {{
                isReady
                  ? "Profile meets all institutional requirements."
                  : "Missing critical data nodes."
              }}
            </p>
          </div>
        </div>

        <!-- Missing Items List -->
        <div v-if="!isReady" class="space-y-2">
          <p
            class="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-1"
          >
            Required Corrections
          </p>
          <div class="space-y-1">
            <div
              v-for="item in allMissingItems"
              :key="item"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-950 border border-white/5 text-[10px] text-surface-300 font-medium lowercase"
            >
              <i class="pi pi-times-circle text-rose-500 scale-75"></i>
              {{ item.replace(/_/g, " ") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Execution -->
      <div class="pt-4 flex gap-3">
        <Button
          label="Abort"
          text
          @click="close"
          class="flex-1 !text-surface-500"
        />
        <Button
          label="Authorize Submission"
          class="flex-1 bg-emerald-600! border-none! shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          @click="submitApplication"
          :loading="submitting"
          :disabled="!isReady"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
@reference "../../assets/css/main.css";

:deep(.p-dialog-header) {
  @apply bg-[#0a0f0d] border-b border-emerald-900/20 py-4;
}
:deep(.p-dialog-title) {
  @apply text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500;
}
:deep(.p-dialog-content) {
  @apply bg-[#0a0f0d];
}
</style>
