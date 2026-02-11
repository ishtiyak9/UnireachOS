<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const toast = useToast();
const { user, data: sessionData } = useUserSession();
const { data, refresh, pending } = await useFetch("/api/admin/settings");

// RBAC
const canManageConfig = computed(() => {
  return (
    user.value?.roleCode === "super_admin" ||
    user.value?.permissions?.includes("system:control")
  );
});

const canManageMaintenance = computed(() => {
  return (
    user.value?.roleCode === "super_admin" ||
    user.value?.permissions?.includes("system:maintenance")
  );
});

const canManageAccess = computed(() => {
  return (
    user.value?.roleCode === "super_admin" ||
    user.value?.permissions?.includes("system:manage_access")
  );
});

// Reactive State
const config = ref(data.value?.config || {});
const firewallRules = computed(() => data.value?.accessControl || []);
const maintenanceWindows = computed(() => data.value?.maintenanceWindows || []);
const showMaintenanceDialog = ref(false);
const maintenanceForm = reactive({
  reason: "",
  description: "",
  startTime: "",
  endTime: "",
  status: "SCHEDULED",
});

// Firewall Form
const newRule = ref({
  ipAddress: "",
  type: "BLOCK",
  reason: "",
});
const addingRule = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Maintenance Actions
const openMaintenanceDialog = () => {
  maintenanceForm.reason = "";
  maintenanceForm.description = "";
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  maintenanceForm.startTime = now.toISOString().slice(0, 16);
  maintenanceForm.endTime = "";
  maintenanceForm.status = "SCHEDULED";
  showMaintenanceDialog.value = true;
};

const createMaintenanceWindow = async () => {
  try {
    await $fetch("/api/admin/maintenance", {
      method: "POST",
      body: {
        ...maintenanceForm,
        startTime: new Date(maintenanceForm.startTime).toISOString(),
        endTime: maintenanceForm.endTime
          ? new Date(maintenanceForm.endTime).toISOString()
          : undefined,
      },
    });
    showMaintenanceDialog.value = false;
    await refresh();
    toast.add({
      severity: "success",
      summary: "Scheduled",
      detail: "Maintenance window created.",
    });
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e.data?.message || "Failed to schedule.",
    });
  }
};

const cancelMaintenance = async (id: string) => {
  if (!confirm("Cancel this maintenance window?")) return;
  try {
    await $fetch(`/api/admin/maintenance/${id}`, {
      method: "PATCH",
      body: { status: "CANCELLED" },
    });
    await refresh();
    toast.add({
      severity: "info",
      summary: "Cancelled",
      detail: "Window cancelled.",
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to cancel.",
    });
  }
};

const completeMaintenance = async (id: string) => {
  if (!confirm("Complete this maintenance window?")) return;
  try {
    await $fetch(`/api/admin/maintenance/${id}`, {
      method: "PATCH",
      body: { status: "COMPLETED" },
    });
    await refresh();
    toast.add({
      severity: "success",
      summary: "Completed",
      detail: "Marked as complete.",
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to complete.",
    });
  }
};

// Settings Actions
const updating = ref<Record<string, boolean>>({});

const updateConfig = async (key: string, value: boolean) => {
  const previousValue = config.value[key];
  config.value[key] = value; // Optimistic update
  updating.value[key] = true;

  try {
    await $fetch("/api/admin/settings/config", {
      method: "PATCH",
      body: { [key]: value },
    });
    toast.add({
      severity: "success",
      summary: "Updated",
      detail: "System configuration saved.",
      life: 2000,
    });
  } catch (err: any) {
    config.value[key] = previousValue; // Revert
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: err.data?.message || err.message || "Could not update setting.",
    });
  } finally {
    updating.value[key] = false;
  }
};

const addFirewallRule = async () => {
  if (!newRule.value.ipAddress) return;
  addingRule.value = true;

  try {
    await $fetch("/api/admin/settings/access", {
      method: "POST",
      body: newRule.value,
    });

    newRule.value = { ipAddress: "", type: "BLOCK", reason: "" }; // Reset form
    await refresh();
    toast.add({
      severity: "success",
      summary: "Rule Added",
      detail: "Firewall rule is active.",
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Could not add firewall rule.",
    });
  } finally {
    addingRule.value = false;
  }
};

const deleteRule = async (id: string) => {
  try {
    await $fetch(`/api/admin/settings/access?id=${id}`, { method: "DELETE" });
    await refresh();
    toast.add({ severity: "info", summary: "Rule Removed", life: 2000 });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Failed",
      detail: "Could not remove rule.",
    });
  }
};
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1
          class="text-3xl font-extrabold text-surface-900 dark:text-surface-0 tracking-tight"
        >
          System Control
        </h1>
        <p class="text-surface-500 dark:text-surface-400 mt-1">
          Manage global operations, security gates, and access controls.
        </p>
      </div>

      <!-- System Status Badge -->
      <!-- Status Badge Removed (Use Maintenance Dashboard) -->
    </div>

    <!-- Main Content -->
    <Tabs value="0">
      <TabList>
        <Tab v-if="canManageConfig" value="0" class="flex items-center gap-2">
          <i class="pi pi-sliders-h"></i> Operational Gates
        </Tab>
        <Tab
          v-if="canManageMaintenance"
          value="1"
          class="flex items-center gap-2"
        >
          <i class="pi pi-clock"></i> Maintenance
        </Tab>
        <Tab v-if="canManageAccess" value="2" class="flex items-center gap-2">
          <i class="pi pi-shield"></i> Firewall & Security
        </Tab>
      </TabList>

      <TabPanels>
        <!-- TAB 1: OPERATIONS -->
        <TabPanel v-if="canManageConfig" value="0">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            <!-- Registration Control -->
            <Card
              class="border border-surface-200 dark:border-surface-700 shadow-sm"
            >
              <template #title>
                <div class="flex items-center gap-2 text-xl font-bold">
                  <i class="pi pi-user-plus text-primary"></i> Registration
                </div>
              </template>
              <template #subtitle
                >Control who can sign up onto the platform.</template
              >
              <template #content>
                <div class="space-y-6">
                  <div
                    class="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium text-lg">Public Students</span>
                      <span class="text-sm text-surface-500"
                        >Allow new students to create accounts.</span
                      >
                    </div>
                    <div class="flex items-center gap-3">
                      <i
                        v-if="updating['allowPublicRegister']"
                        class="pi pi-spinner pi-spin text-primary"
                      ></i>
                      <ToggleSwitch
                        :disabled="updating['allowPublicRegister']"
                        :modelValue="config.allowPublicRegister"
                        @update:modelValue="
                          (v) => updateConfig('allowPublicRegister', v)
                        "
                      />
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium text-lg">Partner Agents</span>
                      <span class="text-sm text-surface-500"
                        >Allow new agencies/partners to apply.</span
                      >
                    </div>
                    <div class="flex items-center gap-3">
                      <i
                        v-if="updating['allowAgentRegister']"
                        class="pi pi-spinner pi-spin text-primary"
                      ></i>
                      <ToggleSwitch
                        :disabled="updating['allowAgentRegister']"
                        :modelValue="config.allowAgentRegister"
                        @update:modelValue="
                          (v) => updateConfig('allowAgentRegister', v)
                        "
                      />
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Login Control -->
            <Card
              class="border border-surface-200 dark:border-surface-700 shadow-sm"
            >
              <template #title>
                <div class="flex items-center gap-2 text-xl font-bold">
                  <i class="pi pi-lock text-primary"></i> Login Access
                </div>
              </template>
              <template #subtitle
                >Temporarily disable logins during updates.</template
              >
              <template #content>
                <div class="space-y-6">
                  <div
                    class="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium text-lg">Student Portal</span>
                      <span class="text-sm text-surface-500"
                        >Allow existing students to log in.</span
                      >
                    </div>
                    <div class="flex items-center gap-3">
                      <i
                        v-if="updating['allowStudentLogin']"
                        class="pi pi-spinner pi-spin text-primary"
                      ></i>
                      <ToggleSwitch
                        :disabled="updating['allowStudentLogin']"
                        :modelValue="config.allowStudentLogin"
                        @update:modelValue="
                          (v) => updateConfig('allowStudentLogin', v)
                        "
                      />
                    </div>
                  </div>
                  <div
                    class="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium text-lg">Agent Portal</span>
                      <span class="text-sm text-surface-500"
                        >Allow partners to access their dashboard.</span
                      >
                    </div>
                    <div class="flex items-center gap-3">
                      <i
                        v-if="updating['allowAgentLogin']"
                        class="pi pi-spinner pi-spin text-primary"
                      ></i>
                      <ToggleSwitch
                        :disabled="updating['allowAgentLogin']"
                        :modelValue="config.allowAgentLogin"
                        @update:modelValue="
                          (v) => updateConfig('allowAgentLogin', v)
                        "
                      />
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Danger Zone Removed: Maintenance moved to dedicated module -->
          </div>
        </TabPanel>

        <!-- TAB 2: MAINTENANCE -->
        <TabPanel v-if="canManageMaintenance" value="1">
          <div
            class="card p-6 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm space-y-6"
          >
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold">Maintenance Windows</h3>
                <p class="text-surface-500">
                  Schedule and manage system downtime.
                </p>
              </div>
              <Button
                label="Schedule Maintenance"
                icon="pi pi-plus"
                @click="openMaintenanceDialog"
              />
            </div>

            <DataTable :value="maintenanceWindows" paginator :rows="5">
              <Column field="reason" header="Reason"></Column>
              <Column field="startTime" header="Start Time">
                <template #body="slotProps">
                  {{ new Date(slotProps.data.startTime).toLocaleString() }}
                </template>
              </Column>
              <Column field="status" header="Status">
                <template #body="slotProps">
                  <Tag
                    :value="slotProps.data.status"
                    :severity="
                      slotProps.data.status === 'ACTIVE'
                        ? 'danger'
                        : slotProps.data.status === 'SCHEDULED'
                        ? 'warn'
                        : 'success'
                    "
                  />
                </template>
              </Column>
              <Column header="Actions">
                <template #body="slotProps">
                  <div class="flex gap-2">
                    <Button
                      v-if="
                        ['SCHEDULED', 'ACTIVE'].includes(slotProps.data.status)
                      "
                      icon="pi pi-check"
                      severity="success"
                      text
                      rounded
                      tooltip="Complete"
                      @click="completeMaintenance(slotProps.data.id)"
                    />
                    <Button
                      v-if="
                        ['SCHEDULED', 'ACTIVE'].includes(slotProps.data.status)
                      "
                      icon="pi pi-times"
                      severity="danger"
                      text
                      rounded
                      tooltip="Cancel"
                      @click="cancelMaintenance(slotProps.data.id)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>

          <Dialog
            v-model:visible="showMaintenanceDialog"
            header="Schedule Maintenance"
            modal
            class="w-full max-w-lg"
          >
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <label>Reason</label>
                <InputText v-model="maintenanceForm.reason" class="w-full" />
              </div>
              <div class="flex flex-col gap-2">
                <label>Description (Visible to users)</label>
                <Textarea
                  v-model="maintenanceForm.description"
                  rows="3"
                  class="w-full"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label>Start Time</label>
                <InputText
                  type="datetime-local"
                  v-model="maintenanceForm.startTime"
                  class="w-full"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label>End Time (Optional)</label>
                <InputText
                  type="datetime-local"
                  v-model="maintenanceForm.endTime"
                  class="w-full"
                />
              </div>
              <div class="flex justify-end gap-2 mt-4">
                <Button
                  label="Cancel"
                  text
                  @click="showMaintenanceDialog = false"
                />
                <Button label="Schedule" @click="createMaintenanceWindow" />
              </div>
            </div>
          </Dialog>
        </TabPanel>

        <!-- TAB 3: FIREWALL -->
        <TabPanel v-if="canManageAccess" value="2">
          <div
            class="card p-6 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl shadow-sm"
          >
            <!-- Add Rule Form -->
            <div
              class="flex flex-col md:flex-row gap-4 items-end mb-8 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700"
            >
              <div class="flex flex-col gap-2 flex-grow">
                <label class="font-semibold text-sm"
                  >Target IP Address / CIDR</label
                >
                <InputText
                  v-model="newRule.ipAddress"
                  placeholder="e.g. 192.168.1.50"
                  class="w-full"
                />
              </div>
              <div class="flex flex-col gap-2 w-40">
                <label class="font-semibold text-sm">Action Type</label>
                <SelectButton
                  v-model="newRule.type"
                  :options="['ALLOW', 'BLOCK']"
                  class="w-full"
                />
              </div>
              <div class="flex flex-col gap-2 flex-grow">
                <label class="font-semibold text-sm"
                  >Reason / Description</label
                >
                <InputText
                  v-model="newRule.reason"
                  placeholder="e.g. Developer Home Network"
                  class="w-full"
                />
              </div>
              <Button
                label="Add Rule"
                icon="pi pi-plus"
                @click="addFirewallRule"
                :loading="addingRule"
              />
            </div>

            <!-- Rules Table -->
            <DataTable
              :value="firewallRules"
              paginator
              :rows="10"
              :filters="filters"
              filterDisplay="menu"
              :globalFilterFields="['ipAddress', 'reason']"
              stripedRows
              class="p-datatable-sm"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-xl font-bold">Access Control List</h3>
                  <IconField iconPosition="left">
                    <InputIcon class="pi pi-search" />
                    <InputText
                      v-model="filters['global'].value"
                      placeholder="Search IP or Reason..."
                    />
                  </IconField>
                </div>
              </template>

              <Column
                field="type"
                header="Status"
                sortable
                style="width: 100px"
              >
                <template #body="{ data }">
                  <Tag
                    :value="data.type"
                    :severity="data.type === 'ALLOW' ? 'success' : 'danger'"
                    class="w-full text-center"
                  />
                </template>
              </Column>
              <Column
                field="ipAddress"
                header="IP Address"
                sortable
                class="font-mono text-primary font-bold"
              ></Column>
              <Column field="reason" header="Reason"></Column>
              <Column field="addedBy" header="Added By" style="width: 15%">
                <template #body="{ data }">
                  <span class="text-xs text-surface-500">{{
                    data.addedBy || "System"
                  }}</span>
                </template>
              </Column>
              <Column
                field="createdAt"
                header="Created"
                sortable
                style="width: 15%"
              >
                <template #body="{ data }">
                  {{ new Date(data.createdAt).toLocaleDateString() }}
                </template>
              </Column>
              <Column header="Action" style="width: 80px">
                <template #body="{ data }">
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="secondary"
                    @click="deleteRule(data.id)"
                    v-tooltip="'Remove Rule'"
                  />
                </template>
              </Column>

              <template #empty>
                <div class="text-center p-8 text-surface-500">
                  <i class="pi pi-shield text-4xl mb-2 opacity-50"></i>
                  <p>
                    No firewall rules defined. System is open to all IPs not
                    explicitly restricted.
                  </p>
                </div>
              </template>
            </DataTable>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
