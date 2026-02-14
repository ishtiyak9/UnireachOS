<script setup lang="ts">
import { ref, computed } from "vue";
import { LEAD_STATUSES } from "~~/shared/constants";
import { FilterMatchMode } from "@primevue/core/api";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

// Fetch lead intelligence from the Registry
const {
  data: leads,
  refresh,
  pending,
} = (await useFetch("/api/admin/leads")) as any;

// Fetch Counselor Personnel for filtering
const { data: staffRes } = useFetch("/api/admin/users", {
  query: { categories: ["STAFF", "SYSTEM"] },
  lazy: true,
});
const counselors = computed(() => {
  const all = (staffRes.value as any) || [];
  // Show all active personnel except for the super_admin
  return all
    .filter((u: any) => u.roleCode !== "super_admin" && u.status === "ACTIVE")
    .map((u: any) => ({
      ...u,
      fullName: `${u.firstName} ${u.lastName}`.trim(),
    }));
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  counselorId: null,
  dateRange: null,
  country: null,
  status: null,
});

const isRefreshing = ref(false);

const handleRefresh = async () => {
  isRefreshing.value = true;
  try {
    await refresh();
  } finally {
    setTimeout(() => {
      isRefreshing.value = false;
    }, 400);
  }
};

// Base leads filtered by pre-application status
const baseLeads = computed(() => {
  const all = leads.value?.data || [];
  return all.filter((l: any) =>
    LEAD_STATUSES.PRE_APPLICATION.includes(l.status)
  );
});

// Advanced Intelligence Filtering Logic
const filteredLeads = computed(() => {
  let list = baseLeads.value;

  // 1. Counselor Filter
  if (filters.value.counselorId) {
    list = list.filter(
      (l: any) => l.assignedCounselorId === filters.value.counselorId
    );
  }

  // 2. Country Filter
  if (filters.value.country) {
    list = list.filter(
      (l: any) => l.preferredCountry === filters.value.country
    );
  }

  // 3. Status Filter
  if (filters.value.status) {
    list = list.filter((l: any) => l.status === filters.value.status);
  }

  // 4. Date Range Filter
  if (
    filters.value.dateRange &&
    filters.value.dateRange[0] &&
    filters.value.dateRange[1]
  ) {
    const start = new Date(filters.value.dateRange[0]).getTime();
    const end = new Date(filters.value.dateRange[1]).getTime() + 86399999; // End of day
    list = list.filter((l: any) => {
      const created = new Date(l.createdAt).getTime();
      return created >= start && created <= end;
    });
  }

  // 5. Global Search
  if (filters.value.global.value) {
    const search = filters.value.global.value.toLowerCase();
    list = list.filter(
      (l: any) =>
        l.firstName?.toLowerCase().includes(search) ||
        l.lastName?.toLowerCase().includes(search) ||
        l.email?.toLowerCase().includes(search) ||
        l.phone?.toLowerCase().includes(search) ||
        l.preferredCountry?.toLowerCase().includes(search)
    );
  }

  return list;
});

// Prepare data for Export with Counselor Intelligence
const exportData = computed(() => {
  return filteredLeads.value.map((l: any) => ({
    ...l,
    fullName: `${l.firstName} ${l.lastName}`,
    counselorName: l.assignedCounselor
      ? `${l.assignedCounselor.firstName} ${l.assignedCounselor.lastName}`
      : "UNASSIGNED",
    formattedDate: new Date(l.createdAt).toLocaleDateString(),
  }));
});

// Unique countries for filter dropdown
const uniqueCountries = computed(() => {
  const countries = baseLeads.value
    .map((l: any) => l.preferredCountry)
    .filter(Boolean);
  return [...new Set(countries)].sort();
});

const stats = computed(() => {
  const all = baseLeads.value;
  return [
    { label: "Active Leads", value: all.length, color: "text-white" },
    {
      label: "New Inquiries",
      value: all.filter((l: any) => l.status === "New Inquiry").length,
      color: "text-blue-400",
    },
    {
      label: "Qualified",
      value: all.filter((l: any) =>
        ["Eligible to Apply", "Documents Complete – Ready to Apply"].includes(
          l.status
        )
      ).length,
      color: "text-emerald-400",
    },
    {
      label: "Assigned",
      value: all.filter((l: any) => l.assignedCounselorId).length,
      color: "text-purple-400",
    },
  ];
});

const resetFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    counselorId: null,
    dateRange: null,
    country: null,
    status: null,
  };
};
</script>

<template>
  <div class="space-y-6">
    <!-- Tactical Header -->
    <DashboardPageHeader
      title="LEAD"
      subtitle="Registry of Global Prospects & Tactical Admissions"
    >
      <template #title>
        LEAD <span class="text-primary-500 italic">HUB.</span>
      </template>

      <template #actions>
        <!-- Global Search Core -->
        <div class="relative w-64">
          <i
            class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 text-[10px]"
          />
          <InputText
            v-model="filters['global'].value"
            placeholder="Search Intelligence Base..."
            class="w-full! bg-surface-900/50! border-white/5! pl-10! h-10! text-[10px] font-bold rounded-xl focus:border-primary-500/50! backdrop-blur-xl"
          />
        </div>

        <!-- Working Refresh Unit -->
        <button
          @click="handleRefresh"
          :disabled="isRefreshing || pending"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-900 border border-white/5 text-surface-400 hover:text-white transition-all disabled:opacity-50"
          title="Synchronize Database"
        >
          <i
            :class="[
              'pi pi-refresh text-xs',
              isRefreshing || pending ? 'animate-spin' : '',
            ]"
          />
        </button>

        <!-- Unified Export Unit -->
        <DashboardIntelligenceExport
          :data="exportData"
          :columns="[
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'email', header: 'Email' },
            { field: 'phone', header: 'Phone' },
            { field: 'preferredCountry', header: 'Target' },
            { field: 'status', header: 'Status' },
            { field: 'counselorName', header: 'Counselor' },
            { field: 'formattedDate', header: 'Registration Date' },
          ]"
          file-name="unireach-prospect-registry"
          label="Export"
          report-title="Prospect Registry Intelligence"
        />

        <NuxtLink to="/dashboard/inventory/courses/recommendations">
          <Button
            label="Neural Discovery"
            icon="pi pi-bolt"
            class="p-button-primary! h-10! rounded-xl! font-black! text-[9px]! uppercase! tracking-widest! px-4!"
          />
        </NuxtLink>
      </template>
    </DashboardPageHeader>

    <!-- Stats Matrix -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <DashboardNeuralStatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :color="stat.color"
        :loading="pending || isRefreshing"
      />
    </div>

    <!-- Intelligence Filter Matrix -->
    <div
      class="p-4 rounded-2xl bg-surface-900/30 border border-white/5 flex flex-wrap items-center gap-4"
    >
      <div class="flex flex-col gap-1.5 flex-1 min-w-[150px]">
        <label
          class="text-[8px] font-black text-surface-500 uppercase tracking-widest"
          >Counselor</label
        >
        <Select
          v-model="filters.counselorId"
          :options="counselors"
          optionLabel="fullName"
          optionValue="id"
          placeholder="All Operators"
          showClear
          class="neural-select-sm"
        />
      </div>

      <div class="flex flex-col gap-1.5 flex-1 min-w-[200px]">
        <label
          class="text-[8px] font-black text-surface-500 uppercase tracking-widest"
          >Date Range</label
        >
        <DatePicker
          v-model="filters.dateRange"
          selectionMode="range"
          placeholder="Temporal Range"
          showIcon
          class="neural-datepicker-sm"
        />
      </div>

      <div class="flex flex-col gap-1.5 w-40">
        <label
          class="text-[8px] font-black text-surface-500 uppercase tracking-widest"
          >Country</label
        >
        <Select
          v-model="filters.country"
          :options="uniqueCountries"
          placeholder="Global Target"
          showClear
          class="neural-select-sm"
        />
      </div>

      <div class="flex flex-col gap-1.5 w-48">
        <label
          class="text-[8px] font-black text-surface-500 uppercase tracking-widest"
          >Status</label
        >
        <Select
          v-model="filters.status"
          :options="LEAD_STATUSES.PRE_APPLICATION"
          placeholder="Protocol State"
          showClear
          class="neural-select-sm"
        />
      </div>

      <div class="flex items-end h-full pt-4">
        <button
          @click="resetFilters"
          class="px-4 py-2 text-[8px] font-black text-surface-400 uppercase tracking-widest hover:text-white transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Advanced Intelligence Table -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl"
    >
      <DataTable
        :value="
          pending || isRefreshing ? Array.from({ length: 8 }) : filteredLeads
        "
        dataKey="id"
        :paginator="true"
        :rows="10"
        class="p-datatable-sm"
        removableSort
      >
        <Column
          field="createdAt"
          header="Date Logged"
          sortable
          class="text-surface-400 font-medium"
        >
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="60px"
              height="1rem"
            />
            <span v-else class="text-[10px] uppercase font-bold tracking-tight">
              {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
            </span>
          </template>
        </Column>

        <Column
          field="name"
          header="Personnel"
          sortable
          class="font-bold text-white"
        >
          <template #body="slotProps">
            <div v-if="pending || isRefreshing" class="space-y-2">
              <Skeleton width="100px" height="1rem" />
              <Skeleton width="140px" height="0.6rem" />
            </div>
            <div v-else class="flex flex-col">
              <span
                class="text-[11px] font-black text-white uppercase tracking-wider"
              >
                {{ slotProps.data.firstName }} {{ slotProps.data.lastName }}
              </span>
              <span
                class="text-[9px] text-surface-500 font-bold uppercase tracking-widest mt-0.5"
              >
                {{ slotProps.data.email }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="phone" header="Contact" class="text-surface-400">
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="100px"
              height="1rem"
            />
            <a
              v-else-if="slotProps.data.phone"
              :href="`https://wa.me/${slotProps.data.phone.replace(
                /[^0-9]/g,
                ''
              )}`"
              target="_blank"
              class="flex items-center gap-1.5 text-[10px] font-black text-green-400 hover:text-green-300 transition-colors uppercase tracking-widest"
            >
              <i class="pi pi-whatsapp text-xs" />
              {{ slotProps.data.phone }}
            </a>
            <span
              v-else
              class="text-[9px] text-surface-700 font-black uppercase tracking-widest"
              >NO ASSET</span
            >
          </template>
        </Column>

        <Column field="preferredCountry" header="Target" sortable>
          <template #body="slotProps">
            <div v-if="pending || isRefreshing" class="space-y-2">
              <Skeleton width="60px" height="1rem" />
              <Skeleton width="100px" height="0.6rem" />
            </div>
            <div v-else class="flex flex-col">
              <span
                class="text-[10px] font-black text-primary-400 uppercase tracking-widest"
              >
                {{ slotProps.data.preferredCountry }}
              </span>
              <span
                class="text-[9px] text-surface-500 font-bold uppercase mt-0.5"
              >
                {{ slotProps.data.studyLevel }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="academicResults" header="Academic" sortable>
          <template #body="slotProps">
            <div v-if="pending || isRefreshing" class="space-y-2">
              <Skeleton width="50px" height="0.8rem" />
              <Skeleton width="80px" height="0.6rem" />
            </div>
            <div v-else class="flex flex-col">
              <span
                class="text-[10px] font-bold text-surface-200 uppercase tracking-tighter"
                >GPA: {{ slotProps.data.academicResults }}</span
              >
              <span
                class="text-[9px] text-surface-600 font-bold uppercase mt-0.5"
                >{{ slotProps.data.englishProficiency }}</span
              >
            </div>
          </template>
        </Column>

        <Column field="status" header="Protocol state" sortable>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="80px"
              height="1.6rem"
              borderRadius="8px"
            />
            <span
              v-else
              class="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0 inline-block"
              :class="
                slotProps.data.status === 'New Inquiry'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-white/5 text-surface-400 border-white/5'
              "
            >
              {{ slotProps.data.status }}
            </span>
          </template>
        </Column>

        <Column field="assignedCounselor" header="Operator" sortable>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="70px"
              height="1rem"
            />
            <div v-else class="flex items-center gap-2">
              <div
                v-if="slotProps.data.assignedCounselor"
                class="w-1.5 h-1.5 rounded-full bg-primary-500"
              />
              <span
                class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
              >
                {{
                  slotProps.data.assignedCounselor?.firstName || "UNASSIGNED"
                }}
              </span>
            </div>
          </template>
        </Column>

        <Column header="Actions" alignFrozen="right" frozen>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              shape="circle"
              size="2.5rem"
            />
            <NuxtLink
              v-else
              :to="`/dashboard/leads/${slotProps.data.id}`"
              class="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-white/5 text-surface-400 hover:text-primary-400 hover:bg-white/10 transition-all border border-white/5"
            >
              <i class="pi pi-bolt text-xs" />
            </NuxtLink>
          </template>
        </Column>

        <template #empty v-if="!pending && !isRefreshing">
          <div class="py-20 text-center flex flex-col items-center gap-3">
            <i class="pi pi-inbox text-surface-800 text-4xl" />
            <p
              class="text-[10px] font-black text-surface-600 uppercase tracking-[0.4em]"
            >
              Registry Empty
            </p>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style>
.p-datatable-header {
  background: transparent !important;
}

:deep(.neural-select-sm),
:deep(.neural-datepicker-sm) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 10px !important;
}

:deep(.neural-select-sm .p-select-label),
:deep(.neural-datepicker-sm .p-datepicker-input) {
  padding: 0.5rem 0.75rem !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  color: white !important;
}

:deep(.p-select-placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
}

:deep(.p-datepicker-trigger) {
  color: #6366f1 !important;
}
</style>
