<script setup lang="ts">
import { ref, reactive, computed } from "vue";
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
      <div class="space-y-1">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">
          System Control
        </h1>
        <p
          class="text-[10px] font-bold text-surface-500 uppercase tracking-[0.4em] mt-1"
        >
          Global Operational Architecture & Neural Security
        </p>
      </div>

      <!-- System Status Badge -->
      <!-- Status Badge Removed (Use Maintenance Dashboard) -->
    </div>

    <!-- Main Content -->
    <Tabs value="0">
      <TabList
        class="bg-surface-900/40 border border-white/5 rounded-2xl p-1.5 backdrop-blur-xl mb-8"
      >
        <Tab
          v-if="canManageConfig"
          value="0"
          class="flex items-center gap-3 px-6 py-2.5 text-[10px]! font-black uppercase tracking-widest transition-all"
        >
          <i class="pi pi-sliders-h"></i> Operational Gates
        </Tab>
        <Tab
          v-if="canManageMaintenance"
          value="1"
          class="flex items-center gap-3 px-6 py-2.5 text-[10px]! font-black uppercase tracking-widest transition-all"
        >
          <i class="pi pi-clock"></i> Maintenance
        </Tab>
        <Tab
          v-if="canManageAccess"
          value="2"
          class="flex items-center gap-3 px-6 py-2.5 text-[10px]! font-black uppercase tracking-widest transition-all"
        >
          <i class="pi pi-shield"></i> Access Protection
        </Tab>
      </TabList>

      <TabPanels>
        <!-- TAB 1: OPERATIONS -->
        <TabPanel v-if="canManageConfig" value="0">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            <!-- Registration Control -->
            <div
              class="p-6 rounded-3xl bg-surface-900/40 border border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all"
            >
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20"
                  >
                    <i class="pi pi-user-plus text-primary-500"></i>
                  </div>
                  <div>
                    <h3
                      class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
                    >
                      Registration Protocol
                    </h3>
                    <p
                      class="text-[8px] font-bold text-surface-500 uppercase tracking-widest mt-1 italic"
                    >
                      Access Permissions & Entry Gates
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5"
                >
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] font-black text-white uppercase tracking-wider"
                      >Public Students</span
                    >
                    <span
                      class="text-[8px] text-surface-500 uppercase font-black tracking-widest mt-0.5"
                      >Autonomous Account Creation</span
                    >
                  </div>
                  <div class="flex items-center gap-3">
                    <i
                      v-if="updating['allowPublicRegister']"
                      class="pi pi-spinner pi-spin text-primary-400 text-xs"
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
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5"
                >
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] font-black text-white uppercase tracking-wider"
                      >Partner Agents</span
                    >
                    <span
                      class="text-[8px] text-surface-500 uppercase font-black tracking-widest mt-0.5"
                      >Network Node Application</span
                    >
                  </div>
                  <div class="flex items-center gap-3">
                    <i
                      v-if="updating['allowAgentRegister']"
                      class="pi pi-spinner pi-spin text-primary-400 text-xs"
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
            </div>

            <!-- Login Control -->
            <div
              class="p-6 rounded-3xl bg-surface-900/40 border border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all"
            >
              <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20"
                  >
                    <i class="pi pi-lock text-amber-400"></i>
                  </div>
                  <div>
                    <h3
                      class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
                    >
                      Authentication Gates
                    </h3>
                    <p
                      class="text-[8px] font-bold text-surface-500 uppercase tracking-widest mt-1 italic"
                    >
                      Portal Connectivity & Uptime
                    </p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5"
                >
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] font-black text-white uppercase tracking-wider"
                      >Student Portal</span
                    >
                    <span
                      class="text-[8px] text-surface-500 uppercase font-black tracking-widest mt-0.5"
                      >Existing Student Access</span
                    >
                  </div>
                  <div class="flex items-center gap-3">
                    <i
                      v-if="updating['allowStudentLogin']"
                      class="pi pi-spinner pi-spin text-primary-400 text-xs"
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
                  class="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5"
                >
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] font-black text-white uppercase tracking-wider"
                      >Agent Portal</span
                    >
                    <span
                      class="text-[8px] text-surface-500 uppercase font-black tracking-widest mt-0.5"
                      >Partner Hub Availability</span
                    >
                  </div>
                  <div class="flex items-center gap-3">
                    <i
                      v-if="updating['allowAgentLogin']"
                      class="pi pi-spinner pi-spin text-primary-400 text-xs"
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
            </div>

            <!-- Danger Zone Removed: Maintenance moved to dedicated module -->
          </div>
        </TabPanel>

        <!-- TAB 2: MAINTENANCE -->
        <TabPanel v-if="canManageMaintenance" value="1">
          <div
            class="p-6 rounded-3xl bg-surface-900/40 border border-white/5 backdrop-blur-xl space-y-8"
          >
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20"
                >
                  <i class="pi pi-clock text-rose-400"></i>
                </div>
                <div>
                  <h3
                    class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
                  >
                    Maintenance Protocol
                  </h3>
                  <p
                    class="text-[8px] font-bold text-surface-500 uppercase tracking-widest mt-1 italic"
                  >
                    Schedule System Dismantling & Updates
                  </p>
                </div>
              </div>
              <button
                @click="openMaintenanceDialog"
                class="flex items-center gap-2.5 px-6 py-3 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20"
              >
                <i class="pi pi-plus" />
                Schedule Maintenance
              </button>
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
            class="p-6 rounded-3xl bg-surface-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden"
          >
            <div class="flex items-center gap-3 mb-8">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
              >
                <i class="pi pi-shield text-emerald-400"></i>
              </div>
              <div>
                <h3
                  class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
                >
                  Access Protection Matrix
                </h3>
                <p
                  class="text-[8px] font-bold text-surface-500 uppercase tracking-widest mt-1 italic"
                >
                  Firewall Rules & Node Restrictions
                </p>
              </div>
            </div>

            <!-- Add Rule Form -->
            <div
              class="flex flex-col md:flex-row gap-4 items-end mb-10 p-5 bg-white/2 rounded-3xl border border-white/5 backdrop-blur-md"
            >
              <div class="flex flex-col gap-2 grow">
                <label
                  class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em] ml-1"
                  >Node Address / CIDR</label
                >
                <InputText
                  v-model="newRule.ipAddress"
                  placeholder="e.g. 192.168.1.50"
                  class="bg-surface-950/50! border-white/10! text-[11px]! font-bold! rounded-xl py-3 px-4"
                />
              </div>
              <div class="flex flex-col gap-2 w-48">
                <label
                  class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em] ml-1"
                  >Permission Policy</label
                >
                <Select
                  v-model="newRule.type"
                  :options="['ALLOW', 'BLOCK']"
                  class="bg-surface-950/50! border-white/10! text-[11px]! font-bold! rounded-xl"
                />
              </div>
              <div class="flex flex-col gap-2 grow">
                <label
                  class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em] ml-1"
                  >Rationale</label
                >
                <InputText
                  v-model="newRule.reason"
                  placeholder="Operational justification..."
                  class="bg-surface-950/50! border-white/10! text-[11px]! font-bold! rounded-xl py-3 px-4"
                />
              </div>
              <button
                @click="addFirewallRule"
                :disabled="addingRule"
                class="px-8 py-3.5 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all flex items-center gap-2"
              >
                <i v-if="addingRule" class="pi pi-spin pi-spinner" />
                Add Exception
              </button>
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
