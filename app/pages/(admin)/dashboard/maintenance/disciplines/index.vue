<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { data: studyAreasRes } = useFetch(
  "/api/admin/maintenance/study-areas"
) as any;

const studyAreas = computed(() => studyAreasRes.value?.data || []);

const getStudyAreaName = (id: string) => {
  const area = studyAreas.value.find((a: any) => a.id === id);
  return area ? area.name : "Unknown";
};

const defaultForm = {
  id: "",
  name: "",
  studyAreaId: "",
  isActive: true,
};
</script>

<template>
  <DashboardMaintenanceNexus
    title="DISCIPLINES"
    subtitle="Manage specific academic branches"
    api-endpoint="/api/admin/maintenance/disciplines"
    entity-name="Discipline"
    search-placeholder="Search Disciplines..."
    new-item-label="New Discipline"
    :default-form="defaultForm"
    dialog-width="400px"
  >
    <template #header-title>
      DISCIPLINES <span class="text-primary-500 italic">REGISTRY.</span>
    </template>

    <template #columns>
      <Column field="name" header="Name" sortable></Column>
      <Column field="studyAreaId" header="Study Area" sortable>
        <template #body="slotProps">
          <span
            class="text-[10px] font-black text-primary-400 uppercase tracking-widest bg-primary-500/5 px-2 py-1 rounded-lg border border-primary-500/10"
          >
            {{ getStudyAreaName(slotProps.data.studyAreaId) }}
          </span>
        </template>
      </Column>
    </template>

    <template #form="{ form, submitted }">
      <div class="flex flex-col gap-2">
        <label
          for="name"
          class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
          >Name</label
        >
        <InputText
          id="name"
          v-model.trim="form.name"
          required="true"
          autofocus
          :class="['neural-input', { 'p-invalid': submitted && !form.name }]"
          placeholder="e.g. Computer Science"
        />
        <small class="text-red-500" v-if="submitted && !form.name"
          >Name is required.</small
        >
      </div>

      <div class="flex flex-col gap-2">
        <label
          for="studyAreaId"
          class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
          >Study Area</label
        >
        <Select
          v-model="form.studyAreaId"
          :options="studyAreas"
          optionLabel="name"
          optionValue="id"
          placeholder="Select Parent Area"
          class="neural-select"
          :class="{ 'p-invalid': submitted && !form.studyAreaId }"
        />
        <small class="text-red-500" v-if="submitted && !form.studyAreaId"
          >Study Area is required.</small
        >
      </div>
    </template>
  </DashboardMaintenanceNexus>
</template>
