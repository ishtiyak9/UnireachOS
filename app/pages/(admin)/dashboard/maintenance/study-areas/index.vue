<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const defaultForm = {
  id: "",
  name: "",
  isActive: true,
};
</script>

<template>
  <DashboardMaintenanceNexus
    title="STUDY AREAS"
    subtitle="Manage global academic classifications"
    api-endpoint="/api/admin/maintenance/study-areas"
    entity-name="Study Area"
    search-placeholder="Search Regions..."
    new-item-label="New Area"
    :default-form="defaultForm"
    dialog-width="400px"
  >
    <template #header-title>
      STUDY <span class="text-primary-500 italic">AREAS.</span>
    </template>

    <template #columns>
      <Column field="name" header="Name" sortable></Column>
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
          placeholder="e.g. Engineering"
        />
        <small class="text-red-500" v-if="submitted && !form.name"
          >Name is required.</small
        >
      </div>
    </template>
  </DashboardMaintenanceNexus>
</template>
