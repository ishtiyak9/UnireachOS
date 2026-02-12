<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "User Directory | UniReach OS",
});

const toast = useToast();
const confirm = useConfirm();

// Menu State
const menu = ref();
const selectedUser = ref();

const menuItems = [
  {
    label: "View Profile",
    icon: "pi pi-eye",
    command: () => viewUser(selectedUser.value),
  },
  {
    label: "Update Credentials",
    icon: "pi pi-file-edit",
    command: () => editUser(selectedUser.value),
  },
  {
    separator: true,
  },
  {
    label: "Eliminate Node",
    icon: "pi pi-trash",
    class: "text-red-400",
    command: () => deleteUser(selectedUser.value),
  },
];

// Actions
const toggleMenu = (event: any, user: any) => {
  selectedUser.value = user;
  menu.value.toggle(event);
};

const viewUser = (user: any) => {
  toast.add({
    severity: "info",
    summary: "View Profile",
    detail: `Viewing ${user.firstName}'s neural profile`,
    life: 3000,
  });
};

const editUser = (user: any) => {
  toast.add({
    severity: "info",
    summary: "Update",
    detail: "Credential update protocol initiated",
    life: 3000,
  });
};

const deleteUser = (user: any) => {
  if (user.roleCode === "super_admin") {
    toast.add({
      severity: "warn",
      summary: "Immunity Active",
      detail: "Super Admin nodes cannot be dismantled.",
      life: 3000,
    });
    return;
  }

  confirm.require({
    message: `Are you sure you want to eliminate the node ${user.email}?`,
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
      // Optimistic UI Update
      const previousUsers = [...(users.value || [])];
      users.value = users.value?.filter((u: any) => u.id !== user.id);

      toast.add({
        severity: "success",
        summary: "Eliminated",
        detail: "Node removed from the matrix.",
        life: 3000,
      });

      try {
        await $fetch("/api/admin/users/delete", {
          method: "DELETE",
          query: { id: user.id },
        });
        refreshUsers();
      } catch (error: any) {
        // Rollback
        users.value = previousUsers;
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to eliminate node.",
          life: 3000,
        });
      }
    },
  });
};

// Create User Logic
const showCreateDialog = ref(false);
const creatingUser = ref(false);
const newUser = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "STAFF", // Default
  roleId: null,
});

const openCreateDialog = () => {
  newUser.firstName = "";
  newUser.lastName = "";
  newUser.email = "";
  newUser.password = "Employee123!"; // Default suggestion
  newUser.role = "STAFF";
  newUser.roleId = systemRoles.value?.[0]?.id || null;
  showCreateDialog.value = true;
};

const addUser = async () => {
  if (
    !newUser.email ||
    !newUser.password ||
    !newUser.firstName ||
    !newUser.roleId
  )
    return;
  creatingUser.value = true;
  try {
    await $fetch("/api/admin/users/create", {
      method: "POST",
      body: newUser,
    });
    toast.add({
      severity: "success",
      summary: "User Created",
      detail: "New official node added to the matrix.",
    });
    showCreateDialog.value = false;
    refreshUsers();
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: e.data?.message || e.message || "Construction failed.",
    });
  } finally {
    creatingUser.value = false;
  }
};

// Data Fetching
const {
  data: users,
  refresh: refreshUsers,
  pending,
} = useFetch("/api/admin/users", {
  query: { categories: ["SYSTEM", "STAFF"] },
});

const { data: systemRoles } = useFetch("/api/admin/authority/roles", {
  transform: (roles: any) =>
    roles.filter((r: any) => ["SYSTEM", "STAFF"].includes(r.category)),
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Stats Calculation
const stats = computed(() => {
  const total = users.value?.length || 0;
  const active =
    users.value?.filter((u: any) => u.status === "ACTIVE").length || 0;
  const pendingUsers =
    users.value?.filter((u: any) => u.status === "PENDING").length || 0;
  // const agents = users.value?.filter((u: any) => u.roleCategory === "AGENT").length || 0;

  return [
    {
      label: "System Operators",
      value: total,
      icon: "pi pi-shield",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Active Nodes",
      value: active,
      icon: "pi pi-check-circle",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Awaiting Sync",
      value: pendingUsers,
      icon: "pi pi-clock",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Security Level",
      value: "HIGH",
      icon: "pi pi-lock",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];
});

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "SUSPENDED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-surface-500/10 text-surface-400 border-surface-500/20";
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
          User Directory
        </h1>
        <p class="text-sm text-surface-500 font-medium">
          Manage and monitor system population.
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatsCard
        v-for="stat in stats"
        :key="stat.label"
        v-bind="stat"
        :loading="pending"
      />
    </div>

    <!-- Main Table Card -->
    <DashboardGlassTable
      :value="pending ? Array(5).fill({}) : users"
      v-model:filters="filters"
      dataKey="id"
      :paginator="true"
      :rows="10"
      :loading="pending"
    >
      <template #header>
        <div
          class="flex flex-col md:flex-row justify-between items-center px-4 py-3 border-b border-white/5 bg-white/2 gap-3"
        >
          <div class="flex items-center gap-2">
            <i class="pi pi-users text-primary-500" />
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 italic"
              >Population Matrix</span
            >
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <Button
              label="New Node"
              icon="pi pi-plus"
              size="small"
              class="whitespace-nowrap"
              @click="openCreateDialog"
            />
            <div class="p-input-icon-left w-full md:w-auto">
              <i class="pi pi-search text-surface-600" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search users..."
                class="bg-surface-950/50 border-white/10 text-xs w-full md:w-64 rounded-xl"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Avatar & Name -->
      <Column field="name" header="User Identity" sortable>
        <template #body="{ data }">
          <div v-if="pending" class="flex items-center gap-3">
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
                >{{ data.firstName }}
                {{ data.lastName ? data.lastName : "" }}</span
              >
              <span class="text-[10px] text-surface-500">{{ data.email }}</span>
            </div>
          </div>
        </template>
      </Column>

      <!-- Role -->
      <Column field="role" header="Access Role" sortable>
        <template #body="{ data }">
          <Skeleton v-if="pending" width="6rem" height="1.5rem" />
          <div v-else class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white">{{ data.role }}</span>
              <div
                :class="[
                  'w-1.5 h-1.5 rounded-full',
                  data.roleCategory === 'SYSTEM'
                    ? 'bg-blue-500'
                    : data.roleCategory === 'AGENT'
                    ? 'bg-purple-500'
                    : 'bg-amber-500',
                ]"
              />
            </div>
            <span class="text-[9px] font-mono text-surface-500">{{
              data.roleCode
            }}</span>
          </div>
        </template>
      </Column>

      <!-- Status -->
      <Column field="status" header="Node Status" sortable>
        <template #body="{ data }">
          <Skeleton v-if="pending" width="4rem" height="1.5rem" />
          <div
            v-else
            :class="[
              'inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase border',
              getStatusBadge(data.status),
            ]"
          >
            {{ data.status }}
          </div>
        </template>
      </Column>

      <!-- Last Login -->
      <Column field="lastLogin" header="Last Login" sortable>
        <template #body="{ data }">
          <Skeleton v-if="pending" width="5rem" height="1rem" />
          <div v-else class="text-[10px] text-surface-400 font-mono">
            {{
              data.lastLogin
                ? new Date(data.lastLogin).toLocaleDateString()
                : "NEVER"
            }}
          </div>
        </template>
      </Column>

      <!-- Actions -->
      <Column header="Actions" headerStyle="width: 5rem;">
        <template #body="{ data }">
          <Skeleton v-if="pending" width="2rem" height="2rem" />
          <Button
            v-else
            icon="pi pi-ellipsis-v"
            class="p-button-text p-button-sm text-surface-400 hover:text-white"
            @click="toggleMenu($event, data)"
          />
        </template>
      </Column>
    </DashboardGlassTable>
    <Menu ref="menu" :model="menuItems" :popup="true" class="w-48" />
    <ConfirmDialog
      class="backdrop-blur-md bg-surface-900/80 border border-white/10"
    />

    <!-- Create User Dialog -->
    <Dialog
      v-model:visible="showCreateDialog"
      header="Provision New Node"
      class="w-full max-w-md backdrop-blur-xl bg-surface-900/90 border border-white/10"
      modal
    >
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-xs font-bold text-surface-400 mb-1"
              >First Name</label
            >
            <InputText v-model="newUser.firstName" class="w-full" />
          </div>
          <div class="flex-1">
            <label class="block text-xs font-bold text-surface-400 mb-1"
              >Last Name</label
            >
            <InputText v-model="newUser.lastName" class="w-full" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >Email Identity</label
          >
          <InputText v-model="newUser.email" class="w-full" type="email" />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >Initial Access Key</label
          >
          <InputText v-model="newUser.password" class="w-full" />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >Role Archetype</label
          >
          <Dropdown
            v-model="newUser.roleId"
            :options="systemRoles || []"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Role"
            :filter="true"
            class="w-full bg-surface-950/50 border-white/10"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            severity="secondary"
            text
            @click="showCreateDialog = false"
          />
          <Button
            label="Provision"
            icon="pi pi-check"
            :loading="creatingUser"
            @click="addUser"
          />
        </div>
      </template>
    </Dialog>
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
  vertical-align: middle !important;
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
</style>
