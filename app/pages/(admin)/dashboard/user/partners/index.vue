<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Partner Network | UniReach OS",
});

const toast = useToast();
const confirm = useConfirm();

// Menu State
const menu = ref();
// Partner Selection State
const selectedUser = ref();

const { user: sessionUser } = useUserSession();

const canResetPassword = computed(() => {
  return (
    sessionUser.value?.roleCode === "super_admin" ||
    sessionUser.value?.permissions?.includes("user:manage")
  );
});

// --- Password Reset ---
const passwordDialogVisible = ref(false);
const newPassword = ref("");

const handleResetPassword = async () => {
  if (newPassword.value.length < 8) {
    toast.add({
      severity: "warn",
      summary: "Weak Password",
      detail: "Password must be at least 8 characters.",
      life: 3000,
    });
    return;
  }

  try {
    await $fetch(`/api/admin/users/${selectedUser.value.id}/reset-password`, {
      method: "POST",
      body: { password: newPassword.value },
    });
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Password reset successfully",
      life: 3000,
    });
    passwordDialogVisible.value = false;
    newPassword.value = "";
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.statusMessage || "Failed to reset password",
      life: 3000,
    });
  }
};

const menuItems = computed(() => [
  {
    label: "Executive Intelligence",
    icon: "pi pi-building",
    command: () => viewUser(selectedUser.value),
  },
  {
    label: "Update Credentials",
    icon: "pi pi-file-edit",
    command: () => viewUser(selectedUser.value),
  },
  ...(canResetPassword.value
    ? [
        {
          label: "Reset Password",
          icon: "pi pi-key",
          command: () => {
            passwordDialogVisible.value = true;
            newPassword.value = "";
          },
        },
      ]
    : []),
  { separator: true },
  {
    label: "Status Management",
    icon: "pi pi-shield-check",
    items: [
      {
        label: "Set Active",
        icon: "pi pi-check-circle",
        class: "text-emerald-400",
        command: () => updateUserStatus(selectedUser.value, "ACTIVE"),
      },
      {
        label: "Set Inactive",
        icon: "pi pi-pause-circle",
        class: "text-surface-400",
        command: () => updateUserStatus(selectedUser.value, "INACTIVE"),
      },
      {
        label: "Suspend Portfolio",
        icon: "pi pi-ban",
        class: "text-rose-400",
        command: () => updateUserStatus(selectedUser.value, "SUSPENDED"),
      },
    ],
  },
]);

// Actions
const toggleMenu = (event: any, user: any) => {
  selectedUser.value = user;
  menu.value.toggle(event);
};

const viewUser = (user: any) => {
  navigateTo(`/dashboard/user/partners/${user.id}`);
};

const updateUserStatus = (user: any, newStatus: string) => {
  confirm.require({
    message: `Transition institutional node status to ${newStatus}?`,
    header: "Strategic Status Shift",
    icon: "pi pi-shield",
    rejectProps: { label: "Abort", severity: "secondary", outlined: true },
    acceptProps: {
      label: "Confirm Transition",
      severity:
        newStatus === "ACTIVE"
          ? "success"
          : newStatus === "INACTIVE"
          ? "secondary"
          : "danger",
    },
    accept: async () => {
      try {
        await $fetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          body: { status: newStatus },
        });
        toast.add({
          severity: "success",
          summary: "Status Synchronized",
          detail: `Institutional node is now ${newStatus}.`,
        });
        refreshUsers();
      } catch (error: any) {
        toast.add({
          severity: "error",
          summary: "Sync Error",
          detail: error.message || "Failed to update node status.",
        });
      }
    },
  });
};

// Create User Logic (Restricted to Agents)
const showCreateDialog = ref(false);
const creatingUser = ref(false);
const newUser = reactive({
  firstName: "", // Agency Name
  lastName: ".", // Placeholder
  email: "",
  phone: "",
  password: "",
  role: "AGENT",
  roleId: null,
});

const openCreateDialog = () => {
  newUser.firstName = "";
  newUser.lastName = ".";
  newUser.email = "";
  newUser.phone = "";
  newUser.password = "Partner123!";
  newUser.role = "AGENT";
  newUser.roleId = agentRoles.value?.[0]?.id || null;
  showCreateDialog.value = true;
};

const addUser = async () => {
  if (
    !newUser.email ||
    !newUser.password ||
    !newUser.firstName ||
    !newUser.phone ||
    !newUser.roleId
  )
    return;
  creatingUser.value = true;
  try {
    await $fetch("/api/admin/users/create", { method: "POST", body: newUser });
    toast.add({
      severity: "success",
      summary: "Partner Onboarded",
      detail: "New agency node active with assigned authorities.",
    });
    showCreateDialog.value = false;
    refreshUsers();
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: e.data?.message || e.message,
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
} = useFetch("/api/admin/users", { query: { category: "AGENT" } }); // Filter AGENT

const { data: agentRoles } = useFetch("/api/admin/authority/roles", {
  transform: (roles: any) => roles.filter((r: any) => r.category === "AGENT"),
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

  return [
    {
      label: "Total Partners",
      value: total,
      icon: "pi pi-briefcase",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Active Agencies",
      value: active,
      icon: "pi pi-check-circle",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Pending Verification",
      value: pendingUsers,
      icon: "pi pi-clock",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Performance",
      value: "SOLID", // Placeholder
      icon: "pi pi-chart-line",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  ];
});

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING":
    case "PENDING_VERIFICATION":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "SUSPENDED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "INACTIVE":
    case "DEACTIVATED":
      return "bg-surface-500/10 text-surface-400 border-surface-500/20";
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
          Partner Network
        </h1>
        <p class="text-sm text-surface-500 font-medium">
          Manage agency partnerships and affiliates.
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

    <!-- Main Table to GlassTable -->
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
            <i class="pi pi-briefcase text-primary-500" />
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 italic"
              >Agency Matrix</span
            >
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <Button
              label="New Partner"
              icon="pi pi-plus"
              size="small"
              class="whitespace-nowrap"
              @click="openCreateDialog"
            />
            <div class="p-input-icon-left w-full md:w-auto">
              <i class="pi pi-search text-surface-600" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search partners..."
                class="bg-surface-950/50 border-white/10 text-xs w-full md:w-64 rounded-xl"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Columns -->
      <Column field="name" header="Agency Identity" sortable>
        <template #body="{ data }">
          <div v-if="pending" class="flex items-center gap-3">
            <Skeleton shape="circle" size="2.5rem" />
            <div>
              <Skeleton width="8rem" height="1rem" class="mb-2" /><Skeleton
                width="5rem"
                height="0.5rem"
              />
            </div>
          </div>
          <div
            v-else
            class="flex items-center gap-3 cursor-pointer group"
            @click="viewUser(data)"
          >
            <Avatar
              :label="data.firstName?.[0] || 'A'"
              shape="circle"
              class="bg-surface-800 text-surface-300 border border-white/10 font-bold group-hover:border-primary-500/50"
            />
            <div class="flex flex-col">
              <span
                class="text-white font-bold text-sm group-hover:text-primary-400 transition-colors"
                >{{ data.firstName }}</span
              >
              <span class="text-[10px] text-surface-500">{{ data.email }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column field="role" header="Tier" sortable>
        <template #body="{ data }">
          <template v-if="pending"
            ><Skeleton width="6rem" height="1.5rem"
          /></template>
          <span v-else class="text-xs text-surface-400 font-mono"
            >Standard Partner</span
          >
        </template>
      </Column>

      <Column field="status" header="Status" sortable>
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

      <Column field="lastLogin" header="Last Active" sortable>
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
      header="Onboard New Partner"
      class="w-full max-w-md backdrop-blur-xl bg-surface-900/90 border border-white/10"
      modal
    >
      <div class="flex flex-col gap-4 mt-2">
        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >Agency Name</label
          >
          <InputText v-model="newUser.firstName" class="w-full" />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >Email Identity</label
          >
          <InputText v-model="newUser.email" class="w-full" type="email" />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >WhatsApp Number</label
          >
          <InputText
            v-model="newUser.phone"
            class="w-full"
            placeholder="+880 1XXX-XXXXXX (WhatsApp)"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >Role Archetype</label
          >
          <Dropdown
            v-model="newUser.roleId"
            :options="agentRoles || []"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Tier"
            :filter="true"
            class="w-full bg-surface-950/50 border-white/10"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-surface-400 mb-1"
            >Initial Access Key</label
          >
          <InputText v-model="newUser.password" class="w-full" />
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
            label="Onboard"
            icon="pi pi-check"
            :loading="creatingUser"
            @click="addUser"
          />
        </div>
      </template>
    </Dialog>

    <!-- Reset Password Dialog -->
    <Dialog
      v-model:visible="passwordDialogVisible"
      header="Reset User Password"
      modal
      class="w-full max-w-md backdrop-blur-xl bg-surface-900/90 border border-white/10"
      :draggable="false"
    >
      <div class="flex flex-col gap-4 py-4 mt-2">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-surface-400">New Password</label>
          <Password
            v-model="newPassword"
            toggleMask
            class="w-full"
            inputClass="w-full bg-surface-950/50 border-white/10"
            placeholder="Enter new strong password"
          />
          <small class="text-surface-500">Minimum 8 characters required.</small>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2 mt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            text
            @click="passwordDialogVisible = false"
            severity="secondary"
          />
          <Button
            label="Reset Now"
            icon="pi pi-key"
            severity="warn"
            @click="handleResetPassword"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
