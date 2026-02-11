<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Student Directory | UniReach OS",
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
  { separator: true },
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

const router = useRouter();

const viewUser = (user: any) => {
  router.push(`/dashboard/user/applicants/${user.id}`);
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
  confirm.require({
    message: `Are you sure you want to eliminate the student node ${user.email}?`,
    header: "Confirm Elimination",
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "Cancel", severity: "secondary", outlined: true },
    acceptProps: { label: "Eliminate", severity: "danger" },
    accept: async () => {
      const previousUsers = [...(users.value || [])];
      users.value = users.value?.filter((u: any) => u.id !== user.id);
      try {
        await $fetch("/api/admin/users/delete", {
          method: "DELETE",
          query: { id: user.id },
        });
        toast.add({
          severity: "success",
          summary: "Eliminated",
          detail: "Student node removed.",
        });
        refreshUsers();
      } catch (error: any) {
        users.value = previousUsers;
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message || "Failed to eliminate node.",
        });
      }
    },
  });
};

// Create User Logic (Restricted to Students)
const showCreateDialog = ref(false);
const creatingUser = ref(false);
const newUser = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "STUDENT",
});

const openCreateDialog = () => {
  newUser.firstName = "";
  newUser.lastName = "";
  newUser.email = "";
  newUser.password = "ChangeMe123!";
  newUser.role = "STUDENT";
  showCreateDialog.value = true;
};

const addUser = async () => {
  if (!newUser.email || !newUser.password || !newUser.firstName) return;
  creatingUser.value = true;
  try {
    await $fetch("/api/admin/users/create", { method: "POST", body: newUser });
    toast.add({
      severity: "success",
      summary: "Student Created",
      detail: "New student node added.",
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
} = useFetch("/api/admin/users", { query: { category: "APPLICANT" } }); // Filter APPLICANT

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
      label: "Total Students",
      value: total,
      icon: "pi pi-users",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Active Students",
      value: active,
      icon: "pi pi-check-circle",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Pending Review",
      value: pendingUsers,
      icon: "pi pi-clock",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Enrollments",
      value: "0", // Placeholder for now
      icon: "pi pi-book",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
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
          Student Directory
        </h1>
        <p class="text-sm text-surface-500 font-medium">
          Manage and monitor student enrollments.
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
            <i class="pi pi-id-card text-primary-500" />
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 italic"
              >Student Matrix</span
            >
          </div>
          <div class="flex items-center gap-3 w-full md:w-auto">
            <Button
              label="New Student"
              icon="pi pi-plus"
              size="small"
              class="whitespace-nowrap"
              @click="openCreateDialog"
            />
            <div class="p-input-icon-left w-full md:w-auto">
              <i class="pi pi-search text-surface-600" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search students..."
                class="bg-surface-950/50 border-white/10 text-xs w-full md:w-64 rounded-xl"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Columns -->
      <Column field="name" header="Student Identity" sortable>
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
              <span class="text-[10px] text-surface-500">{{ data.email }}</span>
            </div>
          </div>
        </template>
      </Column>

      <Column header="Partner / Agent" sortable field="agentName">
        <template #body="{ data }">
          <div v-if="pending" class="text-xs text-surface-500 font-mono">
            <Skeleton width="6rem" height="1rem" />
          </div>
          <div
            v-else-if="!data.agentName"
            class="text-[10px] text-surface-600 font-black tracking-widest uppercase"
          >
            Direct
          </div>
          <div v-else class="flex items-center gap-2">
            <i class="pi pi-briefcase text-primary-400 text-xs" />
            <span class="text-xs text-white font-medium">{{
              data.agentName
            }}</span>
          </div>
        </template>
      </Column>

      <Column field="role" header="Program" sortable>
        <template #body="{ data }">
          <template v-if="pending"
            ><Skeleton width="6rem" height="1.5rem"
          /></template>
          <span v-else class="text-xs text-surface-400">General</span>
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
      header="Register New Student"
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
        <!-- Role is hidden/fixed -->
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
            label="Register"
            icon="pi pi-check"
            :loading="creatingUser"
            @click="addUser"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
