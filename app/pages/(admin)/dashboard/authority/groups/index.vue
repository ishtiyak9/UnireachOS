<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Permission Groups | UniReach OS",
});

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

// Data Fetching
const {
  data: groups,
  refresh: refreshGroups,
  pending,
} = useFetch("/api/admin/authority/groups");

// State
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Actions
const openNew = () => {
  router.push("/dashboard/authority/groups/create");
};

const editGroup = (g: any) => {
  router.push(`/dashboard/authority/groups/${g.id}`);
};

const confirmDeleteGroup = (group: any) => {
  confirm.require({
    message: `Are you sure you want to dismantle the "${group.name}" cluster? This action effectively removes this permission bundle from the system.`,
    header: "Dismantle Cluster",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Dismantle",
      severity: "danger",
    },
    accept: () => deleteGroup(group),
  });
};

const deleteGroup = async (group: any) => {
  try {
    const response = await $fetch("/api/admin/authority/groups", {
      method: "DELETE",
      body: { id: group.id },
    });

    toast.add({
      severity: "success",
      summary: "Cluster Dismantled",
      detail:
        (response as any).message ||
        "The permission cluster has been successfully removed.",
      life: 3000,
    });

    refreshGroups();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Deletion Failed",
      detail:
        error.data?.message ||
        error.message ||
        "Could not dismantle the cluster.",
      life: 5000,
    });
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <ConfirmDialog />
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-black text-white tracking-tight uppercase italic"
        >
          Permission Clusters
        </h1>
        <p class="text-sm text-surface-500 font-medium">
          Manage and bundle system security nodes.
        </p>
      </div>
      <Button
        label="Create Cluster"
        icon="pi pi-plus-circle"
        class="bg-primary-500 border-none text-black font-bold uppercase text-xs px-6 py-2.5 rounded-xl hover:bg-primary-400"
        @click="openNew"
      />
    </div>

    <!-- Main Table Card -->
    <div
      class="card rounded-2xl bg-surface-900/40 border border-white/5 overflow-hidden backdrop-blur-3xl"
    >
      <DataTable
        :value="pending ? Array(5).fill({}) : groups"
        v-model:filters="filters"
        dataKey="id"
        :paginator="true"
        :rows="10"
        class="role-matrix-table"
      >
        <template #header>
          <div
            class="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-white/2"
          >
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 italic"
              >Registry v4.0</span
            >
            <div class="p-input-icon-left">
              <i class="pi pi-search text-surface-600" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search clusters..."
                class="bg-surface-950/50 border-white/10 text-xs w-64 rounded-xl"
              />
            </div>
          </div>
        </template>

        <Column field="name" header="Cluster Name" sortable>
          <template #body="{ data }">
            <div v-if="pending" class="py-2">
              <Skeleton width="10rem" height="1rem" class="mb-2" />
              <Skeleton width="6rem" height="0.5rem" />
            </div>
            <div v-else class="flex flex-col">
              <span class="text-white font-bold text-sm">{{ data.name }}</span>
              <span class="text-[10px] text-surface-500 font-mono">{{
                data.code
              }}</span>
            </div>
          </template>
        </Column>

        <Column field="description" header="Definition">
          <template #body="{ data }">
            <Skeleton v-if="pending" width="15rem" height="1rem" />
            <span v-else class="text-xs text-surface-400 capitalize">{{
              data.description || "No definition available"
            }}</span>
          </template>
        </Column>

        <Column header="Authority Flow" headerStyle="text-align: center;">
          <template #body="{ data }">
            <div v-if="pending" class="flex justify-center">
              <Skeleton shape="circle" size="2rem" />
            </div>
            <div v-else class="flex justify-center">
              <div
                class="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
              >
                <i class="pi pi-share-alt text-[10px] text-primary-500" />
              </div>
            </div>
          </template>
        </Column>

        <Column header="Actions" headerStyle="width: 8rem;">
          <template #body="{ data }">
            <Skeleton v-if="pending" width="6rem" height="2rem" />
            <div v-else class="flex gap-2">
              <Button
                icon="pi pi-sliders-h"
                class="p-button-text p-button-sm text-surface-400 hover:text-primary-500"
                v-tooltip.top="'Configure Cluster'"
                @click="editGroup(data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-sm text-surface-400 hover:text-red-500"
                v-tooltip.top="'Dismantle Cluster'"
                @click="confirmDeleteGroup(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
/* Translucent Content Card */
.card {
  background: rgba(var(--p-surface-900-rgb), 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* DataTable Custom Theming */
:deep(.p-datatable) {
  background: transparent !important;
}

:deep(.p-datatable-header) {
  background: rgba(255, 255, 255, 0.02) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

:deep(.p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.01) !important;
  color: var(--p-surface-400) !important;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1.25rem 1.5rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-right: none !important;
}

:deep(.p-datatable-tbody > tr) {
  background: transparent !important;
  color: var(--p-surface-100) !important;
  transition: all 0.3s;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02) !important;
  border-right: none !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(var(--p-primary-500-rgb), 0.03) !important;
}

:deep(.p-paginator) {
  background: transparent !important;
  border: none !important;
  padding: 1rem !important;
}

:deep(.p-paginator-page),
:deep(.p-paginator-next),
:deep(.p-paginator-last),
:deep(.p-paginator-first),
:deep(.p-paginator-prev) {
  background: transparent !important;
  color: var(--p-surface-400) !important;
  min-width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: bold;
}

:deep(.p-paginator-page.p-highlight) {
  background: rgba(var(--p-primary-500-rgb), 0.1) !important;
  color: var(--p-primary-400) !important;
}

:deep(.p-inputtext) {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s;
}

:deep(.p-inputtext:focus) {
  border-color: var(--p-primary-500) !important;
  box-shadow: 0 0 0 2px rgba(var(--p-primary-500-rgb), 0.1) !important;
}
</style>
