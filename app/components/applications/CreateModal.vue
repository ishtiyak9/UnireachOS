<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["update:visible", "created"]);

const loading = ref(false);
const submitting = ref(false);

const form = ref({
  applicantId: null,
  country: null,
  universityId: null,
  courseId: null,
});

// 1. Data Fetching
const { data: applicants } = await useFetch("/api/admin/users", {
  query: { category: "applicant" },
});

const { data: countries } = await useFetch("/api/admin/countries");

const universities = ref([]);
const courses = ref([]);

// 2. Cascade Logic
watch(
  () => form.value.country,
  async (newVal) => {
    form.value.universityId = null;
    form.value.courseId = null;
    universities.value = [];
    courses.value = [];
    if (newVal) {
      const data = await $fetch("/api/admin/universities", {
        query: { country: newVal },
      });
      universities.value = data;
    }
  }
);

watch(
  () => form.value.universityId,
  async (newVal) => {
    form.value.courseId = null;
    courses.value = [];
    if (newVal) {
      const data = await $fetch("/api/admin/courses", {
        query: { universityId: newVal },
      });
      courses.value = data;
    }
  }
);

const close = () => {
  emit("update:visible", false);
};

const submit = async () => {
  if (!form.value.applicantId || !form.value.courseId) return;

  submitting.value = true;
  try {
    const response = await $fetch("/api/applicants/applications/submit", {
      method: "POST",
      body: {
        applicantId: form.value.applicantId,
        courseId: form.value.courseId,
      },
    });

    if (response.success) {
      emit("created", response.application);
      close();
    }
  } catch (e: any) {
    console.error("Submission Failed", e);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Institutional Application Genesis"
    :style="{ width: '35rem' }"
    class="neural-modal"
  >
    <div class="space-y-6 pt-4">
      <!-- 1. Applicant Selection -->
      <div class="space-y-2">
        <label
          class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
          >Target Applicant</label
        >
        <Select
          v-model="form.applicantId"
          :options="applicants || []"
          optionLabel="email"
          optionValue="id"
          placeholder="Search by student email..."
          filter
          class="w-full bg-surface-950! border-surface-800! text-sm!"
        >
          <template #option="slotProps">
            <div class="flex flex-col">
              <span class="text-xs font-bold"
                >{{ slotProps.option.firstName }}
                {{ slotProps.option.lastName }}</span
              >
              <span class="text-[10px] text-surface-500 font-mono">{{
                slotProps.option.email
              }}</span>
            </div>
          </template>
        </Select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 2. Country Discovery -->
        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
            >Region</label
          >
          <Select
            v-model="form.country"
            :options="countries?.data || []"
            optionLabel="name"
            optionValue="name"
            placeholder="Select Country"
            class="w-full bg-surface-950! border-surface-800! text-sm!"
          />
        </div>

        <!-- 3. University node -->
        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
            >Institution</label
          >
          <Select
            v-model="form.universityId"
            :options="universities || []"
            optionLabel="name"
            optionValue="id"
            placeholder="Select University"
            :disabled="!form.country"
            class="w-full bg-surface-950! border-surface-800! text-sm!"
          />
        </div>
      </div>

      <!-- 4. Course Catalog -->
      <div class="space-y-2">
        <label
          class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
          >Program Selection</label
        >
        <Select
          v-model="form.courseId"
          :options="courses || []"
          optionLabel="name"
          optionValue="id"
          placeholder="Select Course"
          :disabled="!form.universityId"
          filter
          class="w-full bg-surface-950! border-surface-800! text-sm!"
        >
          <template #option="slotProps">
            <div class="flex flex-col">
              <span class="text-xs font-bold">{{ slotProps.option.name }}</span>
              <span class="text-[10px] text-blue-400 font-mono italic">{{
                slotProps.option.level?.name || "Standard"
              }}</span>
            </div>
          </template>
        </Select>
      </div>

      <div class="pt-4 flex gap-3">
        <Button
          label="Cancel"
          text
          @click="close"
          class="flex-1 !text-surface-400"
        />
        <Button
          label="Initialize Application"
          class="flex-1 bg-blue-600! border-none! shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          @click="submit"
          :loading="submitting"
          :disabled="!form.applicantId || !form.courseId"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
@reference "../../assets/css/main.css";

:deep(.p-dialog-header) {
  @apply bg-surface-950 border-b border-surface-800 py-4;
}
:deep(.p-dialog-title) {
  @apply text-xs font-black uppercase tracking-[0.2em] text-surface-400;
}
:deep(.p-dialog-content) {
  @apply bg-surface-900;
}
</style>
