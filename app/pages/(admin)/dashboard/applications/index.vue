<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { APPLICATION_PRIORITIES } from "~/../shared/constants";

definePageMeta({
  layout: "dashboard",
});

const {
  data: applicationsData,
  refresh,
  pending,
} = await useFetch("/api/admin/applications");
const applications = computed(() => applicationsData.value?.applications || []);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Stats Calculation
const stats = computed(() => {
  const total = applications.value.length;
  const urgent = applications.value.filter(
    (a) => a.priority === "URGENT"
  ).length;
  const underReview = applications.value.filter((a) =>
    a.status.includes("Review")
  ).length;

  return [
    {
      label: "Total Applications",
      value: total,
      icon: "pi pi-folder",
      color: "text-blue-400",
    },
    {
      label: "Urgent Cases",
      value: urgent,
      icon: "pi pi-fire",
      color: "text-rose-400",
    },
    {
      label: "Under Review",
      value: underReview,
      icon: "pi pi-search",
      color: "text-amber-400",
    },
  ];
});

const viewApplication = (id: string) => {
  navigateTo(`/(admin)/dashboard/applications/${id}`);
};

const showCreateModal = ref(false);

const handleCreated = async () => {
  await refresh();
  showCreateModal.value = false;
};
</script>

<template>
  <div
    class="p-6 space-y-8 bg-surface-950 min-h-screen text-surface-0 font-[Outfit]"
  >
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent"
        >
          Application Registry
        </h1>
        <p class="text-surface-400 mt-1">
          Manage institutional admissions and case velocity.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-refresh"
          outlined
          severity="secondary"
          label="Sync Data"
          @click="refresh"
          :loading="pending"
          class="!border-surface-700 !text-surface-300"
        />
        <Button
          icon="pi pi-plus"
          label="New Application"
          @click="showCreateModal = true"
          class="!bg-blue-600 !border-none hover:!bg-blue-500 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        />
      </div>
    </div>

    <!-- Genesis Modal -->
    <ApplicationsCreateModal
      v-model:visible="showCreateModal"
      @created="handleCreated"
    />

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-6 rounded-2xl bg-surface-900/50 border border-surface-800 backdrop-blur-xl flex items-center justify-between group hover:border-surface-600 transition-all duration-300"
      >
        <div class="space-y-1">
          <p
            class="text-sm font-medium text-surface-400 uppercase tracking-wider"
          >
            {{ stat.label }}
          </p>
          <p class="text-3xl font-bold font-mono">{{ stat.value }}</p>
        </div>
        <div
          :class="[
            stat.color,
            'p-4 rounded-xl bg-surface-800/50 group-hover:scale-110 transition-transform duration-300',
          ]"
        >
          <i :class="[stat.icon, 'text-2xl']"></i>
        </div>
      </div>
    </div>

    <!-- Main Datatable -->
    <div
      class="rounded-2xl border border-surface-800 bg-surface-900/30 backdrop-blur-md overflow-hidden shadow-2xl"
    >
      <DataTable
        :value="applications"
        :loading="pending"
        v-model:filters="filters"
        dataKey="id"
        class="p-datatable-sm"
        paginator
        :rows="10"
        stripedRows
        filterDisplay="menu"
        :globalFilterFields="[
          'code',
          'applicant.firstName',
          'applicant.lastName',
          'course.name',
          'course.university.name',
        ]"
      >
        <template #header>
          <div class="flex justify-between items-center p-2">
            <span class="relative w-full max-w-md">
              <i
                class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-500"
              ></i>
              <InputText
                v-model="filters['global'].value"
                placeholder="Search code, student, or university..."
                class="w-full pl-10 !bg-surface-950 !border-surface-700 focus:!border-blue-500 transition-all !rounded-xl"
              />
            </span>
            <div class="flex gap-2">
              <Button
                icon="pi pi-filter"
                outlined
                severity="secondary"
                label="Filters"
                class="!border-surface-700 !text-surface-400"
              />
              <Button
                icon="pi pi-download"
                outlined
                severity="secondary"
                label="Export"
                class="!border-surface-700 !text-surface-400"
              />
            </div>
          </div>
        </template>

        <template #empty>
          <div class="p-20 text-center space-y-4">
            <i class="pi pi-folder-open text-6xl text-surface-700"></i>
            <p class="text-surface-500">
              No institutional applications found in the registry.
            </p>
          </div>
        </template>

        <!-- Columns -->
        <Column
          field="code"
          header="CODE"
          sortable
          class="font-mono text-blue-400 text-xs font-bold"
        />

        <Column header="APPLICANT" sortable sortField="applicant.firstName">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="font-bold text-surface-100"
                >{{ data.applicant.firstName }}
                {{ data.applicant.lastName }}</span
              >
              <span class="text-[10px] text-surface-500 italic">{{
                data.applicant.email
              }}</span>
            </div>
          </template>
        </Column>

        <Column header="COURSE / UNIVERSITY" sortable sortField="course.name">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-surface-200">{{
                data.course.name
              }}</span>
              <span
                class="text-[11px] text-surface-400 font-mono tracking-tighter"
                >{{ data.course.university.name }}</span
              >
            </div>
          </template>
        </Column>

        <Column field="priority" header="PRIORITY" sortable>
          <template #body="{ data }">
            <ApplicationsPriorityBadge :priority="data.priority" />
          </template>
        </Column>

        <Column field="status" header="INTERNAL STATUS" sortable>
          <template #body="{ data }">
            <ApplicationsStatusBadge :status="data.status" />
          </template>
        </Column>

        <Column header="ACTION" class="text-center">
          <template #body="{ data }">
            <Button
              icon="pi pi-arrow-right"
              outlined
              rounded
              severity="secondary"
              @click="viewApplication(data.id)"
              class="!w-8 !h-8 !border-surface-700 !text-surface-400 hover:!bg-blue-500/10 hover:!text-blue-400 transition-colors"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
@reference "../../../../assets/css/main.css";

:deep(.p-datatable-thead > tr > th) {
  @apply bg-surface-900 text-surface-400 uppercase text-[10px] tracking-widest py-4 border-surface-800;
}
:deep(.p-datatable-tbody > tr) {
  @apply bg-surface-950/20 border-surface-800 hover:bg-surface-800/30 transition-colors duration-200;
}
:deep(.p-datatable-tbody > tr > td) {
  @apply border-surface-800 py-4;
}
:deep(.p-paginator) {
  @apply bg-transparent border-t border-surface-800 py-3;
}
</style>
