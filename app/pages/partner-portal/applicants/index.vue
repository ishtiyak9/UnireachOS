<script setup lang="ts">
import { ref, computed } from "vue";

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
  navigateTo(`/dashboard/user/applicants/${id}`);
};
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- Strategic Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
        <span class="p-input-icon-left w-full md:w-64">
          <i class="pi pi-search text-surface-500" />
          <InputText
            v-model="filters.global.value"
            placeholder="Search Intelligence..."
            class="w-full bg-white/2! border-white/10! text-white! text-[10px]! font-black! uppercase! tracking-widest! rounded-xl! pl-10!"
          />
        </span>
      </div>
    </div>

    <!-- Live Intelligence Grid -->
    <div
      class="rounded-3xl border border-white/5 bg-white/1 backdrop-blur-3xl overflow-hidden shadow-2xl"
    >
      <DataTable
        :value="clients"
        :loading="pending"
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
              />
              <Button
                icon="pi pi-send"
                text
                class="p-2! text-surface-500! hover:text-blue-500!"
                v-tooltip.top="'Initiate Application'"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Mobile Intelligence Cards -->
      <div class="md:hidden divide-y divide-white/5">
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
                />
                <Button
                  icon="pi pi-send"
                  class="w-10 h-10 bg-white/5! border-0! text-surface-400! hover:text-blue-500! p-0!"
                />
              </div>
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
        <div v-if="!clients?.length && !pending" class="py-20 text-center px-6">
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
