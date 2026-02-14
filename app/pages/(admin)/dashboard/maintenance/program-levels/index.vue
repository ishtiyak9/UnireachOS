<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const defaultForm = {
  id: "",
  name: "",
  code: "",
  rank: 0,
  category: "GENERAL",
  isActive: true,
};

const categoryOptions = [
  { label: "GENERAL", value: "GENERAL" },
  { label: "DEGREE", value: "DEGREE" },
  { label: "PATHWAY", value: "PATHWAY" },
  { label: "SHORT_TERM", value: "SHORT_TERM" },
  { label: "VOCATIONAL", value: "VOCATIONAL" },
];
</script>

<template>
  <DashboardMaintenanceNexus
    title="PROGRAM LEVELS"
    subtitle="Manage qualification tiers & hierarchy"
    api-endpoint="/api/admin/maintenance/program-levels"
    entity-name="Program Level"
    search-placeholder="Search Levels..."
    new-item-label="New Level"
    :default-form="defaultForm"
    dialog-width="450px"
  >
    <template #header-title>
      PROGRAM <span class="text-primary-500 italic">LEVELS.</span>
    </template>

    <template #columns>
      <Column field="rank" header="Rank" sortable class="w-20">
        <template #body="slotProps">
          <span
            class="text-[10px] font-black text-surface-500 bg-white/5 w-6 h-6 flex items-center justify-center rounded-lg border border-white/5"
          >
            {{ slotProps.data.rank }}
          </span>
        </template>
      </Column>
      <Column field="name" header="Name" sortable></Column>
      <Column field="code" header="Reference Code" sortable>
        <template #body="slotProps">
          <span
            class="font-mono text-primary-400 text-[10px] font-bold tracking-wider"
          >
            {{ slotProps.data.code }}
          </span>
        </template>
      </Column>
      <Column field="category" header="Classification" sortable>
        <template #body="slotProps">
          <span
            class="text-[9px] font-bold text-surface-400 uppercase tracking-widest"
          >
            {{ slotProps.data.category }}
          </span>
        </template>
      </Column>
    </template>

    <template #form="{ form, submitted }">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2 col-span-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
            >Formal Name</label
          >
          <InputText
            v-model.trim="form.name"
            required="true"
            class="neural-input"
            :class="{ 'p-invalid': submitted && !form.name }"
            placeholder="e.g. Under-Graduate Honors"
          />
          <small class="text-red-500" v-if="submitted && !form.name"
            >Name is required.</small
          >
        </div>

        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
            >Internal code</label
          >
          <InputText
            v-model.trim="form.code"
            required="true"
            class="neural-input"
            :class="{ 'p-invalid': submitted && !form.code }"
            placeholder="e.g. UG_HON"
          />
          <small class="text-red-500" v-if="submitted && !form.code"
            >Code is required.</small
          >
        </div>

        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
            >Strategic Rank</label
          >
          <InputNumber
            v-model="form.rank"
            showButtons
            :min="0"
            class="neural-input-number"
            inputClass="neural-input"
          />
        </div>

        <div class="flex flex-col gap-2 col-span-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
            >Category Cluster</label
          >
          <Select
            v-model="form.category"
            :options="categoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Category"
            class="neural-select"
          />
        </div>
      </div>
    </template>
  </DashboardMaintenanceNexus>
</template>
