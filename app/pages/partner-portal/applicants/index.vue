<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";

definePageMeta({
  layout: "partner",
  middleware: "auth",
});

const toast = useToast();

// Tactical Data Acquisition
const { data: clients, refresh, pending } = useFetch("/api/partners/students");

// Search & Filtering State
const filters = ref({
  global: { value: null, matchMode: "contains" },
});

// Navigation & Actions
const viewDetails = (id: string) => {
  navigateTo(`/partner-portal/applicants/${id}`);
};

const viewDocuments = (id: string) => {
  navigateTo(`/partner-portal/applicants/${id}/documents`);
};

// Create Applicant Logic
const showCreateDialog = ref(false);
const creating = ref(false);
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "ChangeMe123!",
});

const createApplicant = async () => {
  if (
    !form.email ||
    !form.password ||
    !form.firstName ||
    !form.lastName ||
    !form.phone
  )
    return;

  creating.value = true;
  try {
    await $fetch("/api/partners/students/create", {
      method: "POST",
      body: { ...form },
    });

    toast.add({
      severity: "success",
      summary: "Node Initialized",
      detail: "Student successfully integrated into your network.",
      life: 3000,
    });

    showCreateDialog.value = false;
    await refresh(); // Force data reload

    // Reset form
    form.firstName = "";
    form.lastName = "";
    form.email = "";
    form.phone = "";
    form.password = "ChangeMe123!";
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Initialization Failed",
      detail: e.data?.message || e.message,
      life: 5000,
    });
  } finally {
    creating.value = false;
  }
};
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- Strategic Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <PartnerHeader
        title="Registry"
        :subtitle="`Managing ${
          clients?.length || 0
        } global student nodes within your ecosystem.`"
        badge="Strategic Portfolio"
      >
        <template #title-prefix>Applicant&nbsp;</template>
      </PartnerHeader>

      <div class="flex items-center gap-3">
        <div class="relative w-full md:w-64 group">
          <i
            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 group-hover:text-emerald-500 transition-colors z-10 text-[10px]"
          />
          <InputText
            v-model="filters.global.value"
            placeholder="Search Intelligence..."
            class="w-full h-10 bg-white/5! border-white/10! focus:border-emerald-500/50! text-white! text-[10px]! font-black! uppercase! tracking-widest! rounded-xl! pl-9! transition-all"
          />
        </div>
        <Button
          label="Add Node"
          icon="pi pi-plus"
          class="h-10 bg-emerald-500! border-emerald-500! text-black! font-black! uppercase! tracking-widest! text-[10px]! px-4! rounded-xl! hover:bg-emerald-400! transition-colors"
          @click="showCreateDialog = true"
        />
      </div>
    </div>

    <!-- Create Applicant Dialog -->
    <Dialog
      v-model:visible="showCreateDialog"
      modal
      header="Initiate New Student Node"
      :style="{ width: '400px' }"
      :pt="{
        root: { class: 'bg-surface-900 border border-white/10' },
        header: { class: 'bg-surface-900 border-b border-white/10' },
        content: { class: 'bg-surface-900 p-6' },
        footer: { class: 'bg-surface-900 border-t border-white/10 p-4' },
        closeButton: { class: 'text-surface-400 hover:text-white' },
      }"
    >
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label
              class="text-[9px] font-black uppercase tracking-widest text-surface-400"
              >First Name</label
            >
            <InputText
              v-model="form.firstName"
              class="w-full bg-white/5 border-white/10 text-white"
            />
          </div>
          <div class="space-y-1">
            <label
              class="text-[9px] font-black uppercase tracking-widest text-surface-400"
              >Last Name</label
            >
            <InputText
              v-model="form.lastName"
              class="w-full bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
        <div class="space-y-1">
          <label
            class="text-[9px] font-black uppercase tracking-widest text-surface-400"
            >Email Address</label
          >
          <InputText
            v-model="form.email"
            class="w-full bg-white/5 border-white/10 text-white"
          />
        </div>
        <div class="space-y-1">
          <label
            class="text-[9px] font-black uppercase tracking-widest text-surface-400"
            >WhatsApp Number</label
          >
          <InputText
            v-model="form.phone"
            class="w-full bg-white/5 border-white/10 text-white"
            placeholder="8801XXXXXXXXX (WhatsApp)"
          />
        </div>
        <div class="space-y-1">
          <label
            class="text-[9px] font-black uppercase tracking-widest text-surface-400"
            >Initial Password</label
          >
          <Password
            v-model="form.password"
            toggleMask
            :feedback="false"
            inputClass="w-full bg-white/5 border-white/10 text-white"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Abort"
            text
            class="text-surface-400! hover:text-white! text-[10px]! font-black! uppercase! tracking-widest!"
            @click="showCreateDialog = false"
          />
          <Button
            label="Initialize"
            icon="pi pi-check"
            :loading="creating"
            class="bg-emerald-500! border-emerald-500! text-black! font-black! uppercase! tracking-widest! text-[10px]!"
            @click="createApplicant"
          />
        </div>
      </template>
    </Dialog>

    <!-- Live Intelligence Grid -->
    <div
      class="rounded-3xl border border-white/5 bg-white/1 backdrop-blur-3xl overflow-hidden shadow-2xl"
    >
      <!-- Desktop Skeleton Loading -->
      <div v-if="pending" class="hidden md:block">
        <div
          class="bg-white/2 border-b border-white/5 px-6 py-4 flex items-center justify-between"
        >
          <div v-for="i in 4" :key="i" class="flex-1">
            <Skeleton width="80px" height="10px" class="bg-white/5!" />
          </div>
        </div>
        <div
          v-for="i in 5"
          :key="i"
          class="px-6 py-5 border-b border-white/5 flex items-center gap-12"
        >
          <div class="flex-1 flex items-center gap-3">
            <Skeleton shape="circle" size="2.5rem" class="bg-white/5!" />
            <div class="space-y-2">
              <Skeleton width="120px" height="12px" class="bg-white/5!" />
              <Skeleton width="180px" height="8px" class="bg-white/5!" />
            </div>
          </div>
          <div class="flex-1">
            <Skeleton
              width="100px"
              height="24px"
              border-radius="20px"
              class="bg-white/5!"
            />
          </div>
          <div class="flex-1">
            <Skeleton width="80px" height="12px" class="bg-white/5!" />
          </div>
          <div class="flex-1 flex justify-end gap-2">
            <Skeleton
              v-for="j in 3"
              :key="j"
              width="32px"
              height="32px"
              class="bg-white/5!"
            />
          </div>
        </div>
      </div>

      <!-- Actual Desktop DataTable -->
      <DataTable
        v-else
        :value="clients"
        :filters="filters"
        data-key="id"
        class="p-datatable-sm hidden md:block"
        :pt="{
          table: { class: 'border-collapse w-full' },
          thead: { class: 'bg-white/2' },
          tbody: { class: 'divide-y divide-white/5' },
        }"
      >
        <template #empty>
          <div class="py-20 text-center">
            <i class="pi pi-users text-4xl text-surface-700 mb-4" />
            <p
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
            >
              No tactical nodes found in your current perimeter.
            </p>
          </div>
        </template>

        <Column field="fullName" header="Client Identity" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-3 py-2">
              <Avatar
                :label="data.firstName[0]"
                class="bg-emerald-500/10! text-emerald-500! font-black!"
                shape="circle"
              />
              <div class="flex flex-col">
                <span
                  class="text-xs font-black text-white uppercase tracking-tight group-hover:text-emerald-400"
                >
                  {{ data.fullName }}
                </span>
                <span
                  class="text-[9px] font-bold text-surface-500 uppercase tracking-tighter"
                >
                  {{ data.email }}
                </span>
              </div>
            </div>
          </template>
        </Column>

        <Column field="applicationStatus" header="Operational Status" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest"
                :class="
                  data.applicationStatus === 'Pre-Application'
                    ? 'bg-surface-900 border-white/10 text-surface-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                "
              >
                {{ data.applicationStatus }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="assignedTo" header="Assigned To" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i class="pi pi-user text-primary-400 text-[10px]" />
              <span class="text-[10px] font-black text-white uppercase italic">
                {{ data.assignedTo }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="createdAt" header="Integrated On" sortable>
          <template #body="{ data }">
            <span
              class="text-[10px] font-bold text-surface-500 uppercase italic"
            >
              {{
                new Date(data.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }}
            </span>
          </template>
        </Column>

        <Column header="Intelligence Access">
          <template #body="{ data }">
            <div class="flex justify-end gap-2">
              <Button
                icon="pi pi-id-card"
                text
                class="p-2! text-surface-500! hover:text-white!"
                v-tooltip.top="'View Full Profile'"
                @click="viewDetails(data.id)"
              />
              <Button
                icon="pi pi-folder-open"
                text
                class="p-2! text-surface-500! hover:text-emerald-500!"
                v-tooltip.top="'Manage Documents'"
                @click="viewDocuments(data.id)"
              />
              <Button
                icon="pi pi-send"
                text
                class="p-2! text-surface-500! hover:text-blue-500!"
                v-tooltip.top="'Initiate Application'"
                @click="
                  navigateTo(
                    `/partner-portal/courses-finder?applicantId=${data.id}`
                  )
                "
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Mobile Skeleton Loading -->
      <div v-if="pending" class="md:hidden divide-y divide-white/5">
        <div v-for="i in 3" :key="i" class="p-6 space-y-5">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <Skeleton shape="circle" size="2.5rem" class="bg-white/5!" />
              <div class="space-y-2">
                <Skeleton width="80px" height="12px" class="bg-white/5!" />
                <Skeleton width="120px" height="8px" class="bg-white/5!" />
              </div>
            </div>
            <Skeleton
              width="60px"
              height="18px"
              border-radius="20px"
              class="bg-white/5!"
            />
          </div>
          <div
            class="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5"
          >
            <div class="flex flex-col gap-2">
              <Skeleton width="50px" height="6px" class="bg-white/5!" />
              <div class="flex gap-2">
                <Skeleton
                  v-for="j in 3"
                  :key="j"
                  width="32px"
                  height="32px"
                  class="bg-white/5!"
                />
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <Skeleton width="40px" height="6px" class="bg-white/5!" />
              <Skeleton width="60px" height="10px" class="bg-white/5!" />
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Actual Cards -->
      <div v-else class="md:hidden divide-y divide-white/5">
        <div
          v-for="client in clients"
          :key="client.id"
          class="p-6 space-y-5 active:bg-white/5 transition-all"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <Avatar
                :label="client.firstName[0]"
                class="bg-emerald-500/10! text-emerald-500! font-black! w-10! h-10!"
                shape="circle"
              />
              <div class="flex flex-col">
                <span class="text-xs font-black text-white uppercase italic">{{
                  client.fullName
                }}</span>
                <span
                  class="text-[9px] font-bold text-surface-600 uppercase tracking-tighter"
                  >{{ client.email }}</span
                >
              </div>
            </div>
            <span
              class="px-2 py-1 rounded-full border text-[7px] font-black uppercase tracking-widest"
              :class="
                client.applicationStatus === 'Pre-Application'
                  ? 'bg-surface-900 border-white/10 text-surface-400'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              "
            >
              {{ client.applicationStatus }}
            </span>
          </div>

          <div
            class="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5"
          >
            <div class="flex flex-col gap-1">
              <span class="text-[8px] font-black text-surface-600 uppercase"
                >Direct Actions</span
              >
              <div class="flex items-center gap-1">
                <Button
                  icon="pi pi-id-card"
                  @click="viewDetails(client.id)"
                  class="w-10 h-10 bg-white/5! border-0! text-surface-400! hover:text-white! p-0!"
                />
                <Button
                  icon="pi pi-folder-open"
                  class="w-10 h-10 bg-white/5! border-0! text-surface-400! hover:text-emerald-500! p-0!"
                  @click="viewDocuments(client.id)"
                />
                <Button
                  icon="pi pi-send"
                  class="w-10 h-10 bg-white/5! border-0! text-surface-400! hover:text-blue-500! p-0!"
                />
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-[8px] font-black text-surface-600 uppercase"
                >Assigned Official</span
              >
              <span class="text-[9px] font-bold text-white uppercase italic">{{
                client.assignedTo
              }}</span>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-[8px] font-black text-surface-600 uppercase"
                >Integrated</span
              >
              <span class="text-[9px] font-bold text-white uppercase italic">{{
                new Date(client.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="!clients?.length" class="py-20 text-center px-6">
          <p
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
          >
            No tactical nodes found in your current perimeter.
          </p>
        </div>
      </div>

      <!-- Architecture Footer -->
      <div
        class="p-6 bg-white/2 border-t border-white/5 flex justify-between items-center"
      >
        <p
          class="text-[8px] font-bold text-surface-600 uppercase tracking-[0.2em]"
        >
          Secured Registry Protocol • UniReach AES-256
        </p>
        <div class="flex gap-4">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span class="text-[8px] font-black text-surface-500 uppercase"
              >Active Nodes</span
            >
          </div>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-surface-700" />
            <span class="text-[8px] font-black text-surface-500 uppercase"
              >Latency Mode</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable-thead > tr > th) {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: rgba(255, 255, 255, 0.4) !important;
  font-size: 9px !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  padding: 1rem 1.5rem !important;
}

:deep(.p-datatable-tbody > tr) {
  background: transparent !important;
  transition: all 0.3s ease;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(255, 255, 255, 0.02) !important;
}

:deep(.p-datatable-tbody > tr > td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding: 1rem 1.5rem !important;
}
</style>
