<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Role Assignments | UniReach OS",
});

const toast = useToast();

// Data Fetching
const {
  data: users,
  refresh: refreshUsers,
  pending: loadingUsers,
} = useFetch("/api/admin/users");

const { data: roles, pending: loadingRoles } = useFetch(
  "/api/admin/authority/roles"
);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Assignment State
const assignmentDialog = ref(false);
const isSaving = ref(false);
const selectedUser = ref<any>(null);
const selectedRoleId = ref("");

const openAssignment = (user: any) => {
  selectedUser.value = user;
  // Find the role ID by matching the role name or code
  // Note: our API returns role as a string (name), so we might need more details
  // Fortunately, /api/admin/users/index.get.ts returns roleName, roleCode, and roleCategory.
  // We need to find the ID in the roles list.
  const currentRole = roles.value?.find((r: any) => r.code === user.roleCode);
  selectedRoleId.value = currentRole?.id || "";
  assignmentDialog.value = true;
};

const executeAssignment = async () => {
  if (!selectedUser.value || !selectedRoleId.value) return;

  isSaving.value = true;
  try {
    await $fetch("/api/admin/users/assign-role", {
      method: "POST",
      body: {
        userId: selectedUser.value.id,
        roleId: selectedRoleId.value,
      },
    });

    toast.add({
      severity: "success",
      summary: "Synchronized",
      detail: "User identity archetype updated successfully.",
      life: 3000,
    });

    assignmentDialog.value = false;
    refreshUsers();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Sync Failed",
      detail: error.data?.message || "Failed to update node authority.",
      life: 3000,
    });
  } finally {
    isSaving.value = false;
  }
};

const getRoleBadge = (category: string) => {
  switch (category) {
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
          Authority Management
        </h1>
        <p class="text-sm text-surface-500 font-medium">
          Assign and reconfigure neural roles for existing population nodes.
        </p>
      </div>
    </div>

    <!-- Main Table Card -->
    <div
      class="card rounded-2xl bg-surface-900/40 border border-white/5 overflow-hidden backdrop-blur-3xl"
    >
      <DashboardGlassTable
        :value="loadingUsers ? Array(5).fill({}) : users"
        v-model:filters="filters"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :loading="loadingUsers"
      >
        <template #header>
          <div
            class="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-b border-white/5 bg-white/2 gap-3"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-shield text-primary-500" />
              <span
                class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 italic"
                >User Authority Matrix</span
              >
            </div>
            <div class="p-input-icon-left w-full md:w-auto">
              <i class="pi pi-search text-surface-600" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search population..."
                class="bg-surface-950/50 border-white/10 text-xs w-full md:w-64 rounded-xl"
              />
            </div>
          </div>
        </template>

        <!-- Identity -->
        <Column field="email" header="Population Node" sortable>
          <template #body="{ data }">
            <div v-if="loadingUsers" class="flex items-center gap-3">
              <Skeleton shape="circle" size="2.5rem" />
              <div>
                <Skeleton width="8rem" height="1rem" class="mb-2" />
                <Skeleton width="5rem" height="0.5rem" />
              </div>
            </div>
            <div v-else class="flex items-center gap-3">
              <Avatar
                :label="data.avatar"
                shape="circle"
                class="bg-surface-800 text-surface-300 border border-white/10 font-bold"
              />
              <div class="flex flex-col">
                <span class="text-white font-bold text-sm"
                  >{{ data.firstName }} {{ data.lastName }}</span
                >
                <span class="text-[10px] text-surface-500 font-mono">{{
                  data.email
                }}</span>
              </div>
            </div>
          </template>
        </Column>

        <!-- Current Role -->
        <Column field="role" header="Active Archetype" sortable>
          <template #body="{ data }">
            <Skeleton v-if="loadingUsers" width="6rem" height="1.5rem" />
            <div v-else class="flex items-center gap-2">
              <div
                :class="[
                  'px-2 py-0.5 rounded text-[9px] font-black uppercase border',
                  getRoleBadge(data.roleCategory),
                ]"
              >
                {{ data.role }}
              </div>
              <span
                class="text-[8px] font-mono text-surface-600 tracking-tighter"
                >{{ data.roleCode }}</span
              >
            </div>
          </template>
        </Column>

        <!-- Status -->
        <Column field="status" header="Node Status" sortable>
          <template #body="{ data }">
            <Skeleton v-if="loadingUsers" width="4rem" height="1.5rem" />
            <span
              v-else
              class="text-[9px] font-bold text-surface-400 uppercase tracking-widest"
              >{{ data.status }}</span
            >
          </template>
        </Column>

        <!-- Actions -->
        <Column header="Actions" headerStyle="width: 10rem;">
          <template #body="{ data }">
            <Skeleton v-if="loadingUsers" width="5rem" height="2rem" />
            <Button
              v-else
              label="Reassign Role"
              icon="pi pi-user-edit"
              class="p-button-text p-button-sm text-primary-500 hover:bg-primary-500/5 text-[10px] font-black uppercase tracking-wider"
              @click="openAssignment(data)"
            />
          </template>
        </Column>
      </DashboardGlassTable>
    </div>

    <!-- Assignment Dialog -->
    <Dialog
      v-model:visible="assignmentDialog"
      header="Reconfigure Neural Identity"
      class="w-full max-w-md backdrop-blur-xl bg-surface-900/90 border border-white/10"
      modal
    >
      <div v-if="selectedUser" class="flex flex-col gap-6 mt-2">
        <div
          class="p-4 rounded-xl bg-surface-950/50 border border-white/5 flex items-center gap-4"
        >
          <Avatar
            :label="selectedUser.avatar"
            shape="circle"
            size="large"
            class="bg-primary-500 text-black font-black"
          />
          <div>
            <div
              class="text-xs font-black text-white uppercase tracking-widest"
            >
              {{ selectedUser.firstName }} {{ selectedUser.lastName }}
            </div>
            <div class="text-[10px] text-surface-500 font-mono">
              {{ selectedUser.email }}
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label
            class="block text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
          >
            Target Identity Archetype
          </label>

          <Dropdown
            v-model="selectedRoleId"
            :options="roles || []"
            optionLabel="name"
            optionValue="id"
            placeholder="Search & Select Archetype..."
            :filter="true"
            filterPlaceholder="Scan registry..."
            class="w-full bg-surface-950/50 border-white/10 rounded-xl"
            scrollHeight="250px"
          >
            <template #option="slotProps">
              <div class="flex flex-col py-0.5">
                <span class="text-xs font-bold text-white">{{
                  slotProps.option.name
                }}</span>
                <span class="text-[9px] font-mono text-surface-500 uppercase">{{
                  slotProps.option.code
                }}</span>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
          <Button
            label="Abort"
            severity="secondary"
            text
            class="text-[10px] font-black uppercase tracking-widest"
            @click="assignmentDialog = false"
          />
          <Button
            label="Execute Sync"
            icon="pi pi-sync"
            :loading="isSaving"
            class="bg-primary-500 border-none text-black font-black text-[10px] uppercase tracking-widest px-6"
            @click="executeAssignment"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.card {
  background: rgba(var(--p-surface-900-rgb), 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
