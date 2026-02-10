<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Role Directory | UniReach OS",
});

const toast = useToast();
const confirm = useConfirm();

// Data Fetching
const {
  data: roles,
  refresh: refreshRoles,
  pending,
} = useFetch("/api/admin/authority/roles");
const { data: groups } = useFetch("/api/admin/authority/groups");

// State
const roleDialog = ref(false);
const submitted = ref(false);
const isLoading = ref(false);
const role = ref<any>({
  name: "",
  code: "",
  description: "",
  category: "APPLICANT",
  groupId: null,
});

const categories = [
  { label: "System / Staff", value: "SYSTEM" },
  { label: "Agency / Partner", value: "AGENT" },
  { label: "Client / Applicant", value: "APPLICANT" },
];

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Actions
const openNew = () => {
  role.value = {
    name: "",
    code: "",
    description: "",
    category: "APPLICANT",
    groupId: null,
  };
  submitted.value = false;
  roleDialog.value = true;
};

const editRole = (r: any) => {
  role.value = {
    ...r,
    groupId: r.groups && r.groups.length > 0 ? r.groups[0].groupId : null,
  };
  roleDialog.value = true;
};

const saveRole = async () => {
  submitted.value = true;
  if (!role.value.name || !role.value.code) return;

  const newRole = { ...role.value }; // Clone for optimistic update
  const previousRoles = [...(roles.value || [])];

  // Optimistic UI Update
  if (newRole.id) {
    // Edit Mode
    const index = roles.value?.findIndex((r: any) => r.id === newRole.id);
    if (index !== -1 && roles.value) {
      roles.value[index] = {
        ...roles.value[index],
        ...newRole,
        _count: roles.value[index]._count,
      };
    }
  } else {
    // Create Mode (Temporary ID for UI)
    const tempRole = {
      ...newRole,
      id: `temp-${Date.now()}`,
      _count: { users: 0 },
    };
    roles.value = [tempRole, ...(roles.value || [])];
  }

  // Close dialog immediately for better UX
  roleDialog.value = false;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Role Matrix Synchronized",
    life: 3000,
  });

  try {
    const payload = {
      id: role.value.id,
      name: role.value.name,
      code: role.value.code,
      description: role.value.description,
      category: role.value.category,
      groupIds: role.value.groupId ? [role.value.groupId] : [],
    };

    await $fetch("/api/admin/authority/roles", {
      method: "POST",
      body: payload,
    });

    // Refresh to ensure server consistency (IDs, etc.)
    refreshRoles();
  } catch (error: any) {
    // Rollback changes on error
    roles.value = previousRoles;
    roleDialog.value = true; // Re-open dialog so user can retry

    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || "Action failed",
      life: 3000,
    });
  }
};

const deleteRole = (role: any) => {
  confirm.require({
    message: `Are you sure you want to eliminate the ${role.name} identity?`,
    header: "Confirm Elimination",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Eliminate",
      severity: "danger",
    },
    accept: async () => {
      // Optimistic Update: Remove locally first
      const previousRoles = [...(roles.value || [])];
      roles.value = roles.value?.filter((r: any) => r.id !== role.id);

      toast.add({
        severity: "success",
        summary: "Eliminated",
        detail: "Identity Archetype removed.",
        life: 3000,
      });

      try {
        await $fetch(`/api/admin/authority/roles`, {
          method: "DELETE",
          query: { id: role.id },
        });
        // Success: No further action needed as local state is already updated
      } catch (error: any) {
        // Rollback on error
        roles.value = previousRoles;
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to delete role",
          life: 3000,
        });
      }
    },
  });
};

const getCategoryBadge = (cat: string) => {
  switch (cat) {
    case "SYSTEM":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "AGENT":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "APPLICANT":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-surface-500/10 text-surface-400 border-surface-500/20";
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-black text-white tracking-tight uppercase italic"
        >
          Role Directory
        </h1>
        <p class="text-sm text-surface-500 font-medium">
          Define and configure identity archetypes.
        </p>
      </div>
      <Button
        label="Generate Role"
        icon="pi pi-shield"
        class="bg-primary-500 border-none text-black font-bold uppercase text-xs px-6 py-2.5 rounded-xl hover:bg-primary-400"
        @click="openNew"
      />
    </div>

    <!-- Main Table Card -->
    <div
      class="card rounded-2xl bg-surface-900/40 border border-white/5 overflow-hidden backdrop-blur-3xl"
    >
      <div class="overflow-x-auto">
        <DataTable
          :value="pending ? Array(5).fill({}) : roles"
          v-model:filters="filters"
          dataKey="id"
          :paginator="true"
          :rows="10"
          class="role-matrix-table"
        >
          <template #header>
            <div
              class="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-b border-white/5 bg-white/2 gap-3"
            >
              <span
                class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 italic"
                >Identity Matrix v4.0</span
              >
              <div class="p-input-icon-left w-full md:w-auto">
                <i class="pi pi-search text-surface-600" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search roles..."
                  class="bg-surface-950/50 border-white/10 text-xs w-full md:w-64 rounded-xl"
                />
              </div>
            </div>
          </template>

          <Column field="name" header="Role Identity" sortable>
            <template #body="{ data }">
              <div v-if="pending" class="py-2">
                <Skeleton width="10rem" height="1rem" class="mb-2" />
                <Skeleton width="6rem" height="0.5rem" />
              </div>
              <div v-else class="flex flex-col">
                <span
                  class="text-white font-bold text-sm flex items-center gap-2"
                >
                  {{ data.name }}
                  <Tag
                    v-if="data.isSystem"
                    value="Core"
                    class="bg-primary-500/10 text-primary-500 border border-primary-500/20 text-[8px] font-black px-1"
                  />
                </span>
                <span class="text-[10px] text-surface-500 font-mono">{{
                  data.code
                }}</span>
              </div>
            </template>
          </Column>

          <Column field="category" header="Category" sortable>
            <template #body="{ data }">
              <Skeleton v-if="pending" width="5rem" height="1.5rem" />
              <div
                v-else
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase border',
                  getCategoryBadge(data.category),
                ]"
              >
                {{ data.category }}
              </div>
            </template>
          </Column>

          <Column header="Population">
            <template #body="{ data }">
              <div v-if="pending" class="flex justify-center">
                <Skeleton shape="circle" size="2rem" />
              </div>
              <div v-else class="text-center">
                <span
                  class="text-xs font-mono text-white bg-white/5 px-2 py-1 rounded"
                  >{{ data._count?.users || 0 }}</span
                >
              </div>
            </template>
          </Column>

          <Column header="Actions" headerStyle="width: 5rem;">
            <template #body="{ data }">
              <Skeleton v-if="pending" width="3rem" height="2rem" />
              <div v-else class="flex gap-1">
                <Button
                  icon="pi pi-cog"
                  class="p-button-text p-button-sm text-surface-400 hover:text-primary-500"
                  @click="editRole(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-sm text-surface-400 hover:text-red-500"
                  @click="deleteRole(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Role Config Dialog -->
    <!-- Role Config Drawer -->
    <Drawer
      v-model:visible="roleDialog"
      :header="role.id ? 'Reconfigure DNA' : 'Generate Identity DNA'"
      position="right"
      class="!w-full md:!w-[30rem]"
    >
      <div class="flex flex-col h-full">
        <div class="space-y-6 py-4 flex-1">
          <div class="field">
            <label
              class="text-[10px] font-black uppercase text-surface-500 tracking-widest mb-2 block"
              >Identity Title</label
            >
            <InputText
              v-model.trim="role.name"
              required
              class="bg-surface-950/50 border-white/10 rounded-xl w-full"
              placeholder="e.g. Regional Admission Scout"
            />
          </div>

          <div class="field">
            <label
              class="text-[10px] font-black uppercase text-surface-500 tracking-widest mb-2 block"
              >System Code</label
            >
            <InputText
              v-model.trim="role.code"
              :disabled="!!role.id"
              class="bg-surface-950/50 border-white/10 rounded-xl font-mono text-xs w-full"
              placeholder="e.g. scout_regional"
            />
          </div>

          <div class="field">
            <label
              class="text-[10px] font-black uppercase text-surface-500 tracking-widest mb-2 block"
              >Archetype Category</label
            >
            <Dropdown
              v-model="role.category"
              :options="categories"
              optionLabel="label"
              optionValue="value"
              class="bg-surface-950/50 border-white/10 rounded-xl text-xs w-full"
            />
          </div>

          <div class="field">
            <label
              class="text-[10px] font-black uppercase text-surface-500 tracking-widest mb-2 block"
              >Functional Cluster</label
            >
            <Dropdown
              v-model="role.groupId"
              :options="groups"
              optionLabel="name"
              optionValue="id"
              placeholder="Link Permission Cluster"
              class="bg-surface-950/50 border-white/10 rounded-xl w-full"
              filter
            />
          </div>
        </div>

        <div
          class="flex gap-3 justify-end pt-4 border-t border-white/5 mt-auto"
        >
          <Button
            label="Abort"
            class="p-button-text text-surface-500 uppercase font-black text-[10px]"
            @click="roleDialog = false"
          />
          <Button
            label="Execute Sync"
            :loading="isLoading"
            class="bg-primary-500 border-none text-black font-black uppercase text-[10px] px-8 rounded-xl"
            @click="saveRole"
          />
        </div>
      </div>
    </Drawer>

    <ConfirmDialog
      class="backdrop-blur-md bg-surface-900/80 border border-white/10"
    />
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
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(var(--p-primary-500-rgb), 0.03) !important;
}

:deep(.p-paginator) {
  background: transparent !important;
  padding: 1rem !important;
  border: none !important;
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
}

:deep(.p-paginator-page.p-highlight) {
  background: rgba(var(--p-primary-500-rgb), 0.1) !important;
  color: var(--p-primary-400) !important;
}

:deep(.p-inputtext:focus) {
  border-color: var(--p-primary-500) !important;
  box-shadow: 0 0 0 2px rgba(var(--p-primary-500-rgb), 0.1) !important;
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
  background: #0a0a0a !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
</style>
