<script setup lang="ts">
import { ref, computed } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const toast = useToast();

// Filter Intelligence State
const selectedFilters = ref({
  country: "",
  isPremium: null as boolean | null,
});

// Fetch Intelligence from Registry (with Server-Side Filtering)
const {
  data: universities,
  refresh,
  pending,
} = useFetch("/api/admin/universities", {
  query: selectedFilters,
  watch: [selectedFilters],
}) as any;

const { data: countryRes, pending: countriesPending } = useFetch(
  "/api/admin/countries"
) as any;

const activeCountries = computed(() => {
  const all = countryRes.value?.data || [];
  return all.filter((c: any) => c.isActive);
});

const isRefreshing = ref(false);
const showDialog = ref(false);
const isSaving = ref(false);
const deleteDialog = ref(false);
const selectedUniversity = ref<any>(null);

const universityForm = ref({
  name: "",
  country: "",
  code: "",
  description: "",
  website: "",
  logo: "",
  // Advanced Intel
  strategicRank: 0,
  commissionSpeed: 3,
  offerTATIndex: 3,
  visaSuccessRate: 0,
  isPremiumPartner: false,
  hasDirectContract: true,
  bannerImage: "",
  strategicTags: [] as string[],
});

const speedOptions = [
  { label: "Slow (3-6 Months)", value: 1 },
  { label: "Standard (2-3 Months)", value: 2 },
  { label: "Fast (1-2 Months)", value: 3 },
  { label: "Accelerated (4-6 Weeks)", value: 4 },
  { label: "Elite (Under 30 Days)", value: 5 },
];

const tatOptions = [
  { label: "Delayed (4+ Weeks)", value: 1 },
  { label: "Systemic (2-4 Weeks)", value: 2 },
  { label: "Standard (1-2 Weeks)", value: 3 },
  { label: "Fast (48-72 Hours)", value: 4 },
  { label: "Instant (24 Hours)", value: 5 },
];

const strategicTagOptions = [
  "Research Intensive",
  "High Employment",
  "Low Cost of Living",
  "Major City Hub",
  "Regional Scarcity",
  "Stem Focused",
  "Post-Study Work Rights",
  "Ivy League equivalent",
  "Russel Group Member",
];

const filters = ref<any>({
  global: { value: "", matchMode: FilterMatchMode.CONTAINS },
});

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

const openNew = () => {
  universityForm.value = {
    name: "",
    country: "",
    code: "",
    description: "",
    website: "",
    logo: "",
    strategicRank: 0,
    commissionSpeed: 3,
    offerTATIndex: 3,
    visaSuccessRate: 0,
    isPremiumPartner: false,
    hasDirectContract: true,
    bannerImage: "",
    strategicTags: [],
  };
  selectedUniversity.value = null;
  showDialog.value = true;
};

const editUniversity = (uni: any) => {
  universityForm.value = { ...uni };
  selectedUniversity.value = uni;
  showDialog.value = true;
};

const confirmDelete = (uni: any) => {
  selectedUniversity.value = uni;
  deleteDialog.value = true;
};

const saveUniversity = async () => {
  isSaving.value = true;
  try {
    const url = selectedUniversity.value
      ? `/api/admin/universities/${selectedUniversity.value.id}`
      : "/api/admin/universities";
    const method = selectedUniversity.value ? "PATCH" : "POST";

    await $fetch(url, {
      method,
      body: universityForm.value,
    });

    toast.add({
      severity: "success",
      summary: "Registry Updated",
      detail: "University asset has been successfully propagated.",
      life: 3000,
    });
    showDialog.value = false;
    refresh();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Propagation Failed",
      detail: error.data?.message || "An error occurred during sync.",
      life: 5000,
    });
  } finally {
    isSaving.value = false;
  }
};

const executeDelete = async () => {
  try {
    await $fetch(`/api/admin/universities/${selectedUniversity.value.id}`, {
      method: "DELETE",
    });
    toast.add({
      severity: "success",
      summary: "Asset Excised",
      detail: "University removed from the registry.",
      life: 3000,
    });
    deleteDialog.value = false;
    refresh();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Excision Failed",
      detail: error.data?.message || "Critical failure during deletion.",
      life: 5000,
    });
  }
};

const filteredUniversities = computed(() => {
  if (!universities.value) return [];
  let list = [...universities.value];

  if (
    filters.value.global.value &&
    typeof filters.value.global.value === "string"
  ) {
    const search = filters.value.global.value.toLowerCase();
    list = list.filter(
      (u: any) =>
        u.name.toLowerCase().includes(search) ||
        u.country.toLowerCase().includes(search) ||
        u.code.toLowerCase().includes(search)
    );
  }

  return list;
});

const stats = computed(() => {
  const all = universities.value || [];
  const coursesCount = all.reduce(
    (acc: number, u: any) => acc + (u._count?.courses || 0),
    0
  );
  return [
    { label: "Active Universities", value: all.length, color: "text-white" },
    { label: "Total Courses", value: coursesCount, color: "text-primary-400" },
    {
      label: "Partner Countries",
      value: new Set(all.map((u: any) => u.country)).size,
      color: "text-emerald-400",
    },
    { label: "Registry Health", value: "Optimal", color: "text-blue-400" },
  ];
});
</script>

<template>
  <div class="space-y-6">
    <!-- Premium Header -->
    <DashboardPageHeader
      title="UNIVERSITY"
      subtitle="Global Academic Assets & Institutional Intelligence"
    >
      <template #title>
        UNIVERSITY <span class="text-primary-500 italic">REGISTRY.</span>
      </template>

      <template #actions>
        <!-- Global Search Core -->
        <div class="relative w-64">
          <i
            class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 text-[10px]"
          />
          <InputText
            v-model="filters.global.value"
            placeholder="Search Global Assets..."
            class="w-full! bg-surface-900/50! border-white/5! pl-10! h-10! text-[10px] font-bold rounded-xl focus:border-primary-500/50! backdrop-blur-xl"
          />
        </div>

        <button
          @click="handleRefresh"
          :disabled="isRefreshing || pending"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-900 border border-white/5 text-surface-400 hover:text-white transition-all disabled:opacity-50"
          title="Sync Registry"
        >
          <i
            :class="[
              'pi pi-refresh text-xs',
              isRefreshing || pending ? 'animate-spin' : '',
            ]"
          />
        </button>

        <DashboardIntelligenceExport
          :data="filteredUniversities"
          :columns="[
            { field: 'name', header: 'University' },
            { field: 'country', header: 'Country' },
            { field: 'code', header: 'Code' },
            { field: 'website', header: 'Website' },
          ]"
          file-name="unireach-university-registry"
          label="Export"
          report-title="Global University Registry"
        />

        <Button
          label="Provision Asset"
          icon="pi pi-plus"
          class="p-button-primary! h-10! rounded-xl! font-black! text-[9px]! uppercase! tracking-widest! px-4!"
          @click="openNew"
        />
      </template>
    </DashboardPageHeader>

    <!-- Intelligence Filter Matrix -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-wrap items-center gap-4"
    >
      <div class="flex-1 min-w-[300px]">
        <label
          class="text-[9px] font-black text-surface-500 uppercase tracking-widest block mb-2 px-1"
          >Institutional Location (Country)</label
        >
        <Select
          v-model="selectedFilters.country"
          :options="activeCountries"
          optionLabel="name"
          optionValue="name"
          placeholder="All Global Destinations"
          class="neural-select !h-10 !text-[10px]"
          showClear
          filter
        />
      </div>

      <div class="flex-1 min-w-[200px]">
        <label
          class="text-[9px] font-black text-surface-500 uppercase tracking-widest block mb-2 px-1"
          >Partnership Tier</label
        >
        <Select
          v-model="selectedFilters.isPremium"
          :options="[
            { label: 'All Partners', value: null },
            { label: 'Premium Partners', value: true },
            { label: 'Standard Partners', value: false },
          ]"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Tier"
          class="neural-select !h-10 !text-[10px]"
        />
      </div>

      <div class="flex items-end self-end">
        <button
          @click="
            selectedFilters.country = '';
            selectedFilters.isPremium = null;
          "
          class="h-10 px-4 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-surface-500 hover:text-white transition-all"
        >
          Reset Registry
        </button>
      </div>
    </div>

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

    <!-- Asset Table -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl"
    >
      <DataTable
        :value="
          pending || isRefreshing
            ? Array.from({ length: 6 })
            : filteredUniversities
        "
        dataKey="id"
        :paginator="true"
        :rows="10"
        class="p-datatable-sm"
        removableSort
      >
        <Column
          field="name"
          header="Institutional Name"
          sortable
          class="font-bold text-white"
        >
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="200px"
              height="1rem"
            />
            <div v-else class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center border border-white/5 overflow-hidden relative"
              >
                <img
                  v-if="slotProps.data.logo"
                  :src="slotProps.data.logo"
                  class="w-full h-full object-cover"
                />
                <i v-else class="pi pi-building text-surface-600" />
                <div
                  v-if="slotProps.data.isPremiumPartner"
                  class="absolute top-0 right-0 w-3 h-3 bg-primary-500 border-2 border-surface-900 rounded-full"
                  title="Premium Partner"
                />
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span
                    class="text-[11px] font-black text-white uppercase tracking-wider"
                    >{{ slotProps.data.name }}</span
                  >
                  <i
                    v-if="slotProps.data.strategicRank > 80"
                    class="pi pi-verified text-primary-400 text-[10px]"
                    title="Elite Tier"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="text-[9px] text-surface-500 font-bold uppercase tracking-widest"
                    >{{ slotProps.data.code }}</span
                  >
                  <span
                    v-if="slotProps.data.visaSuccessRate > 90"
                    class="text-[8px] text-emerald-500 font-black tracking-tighter uppercase px-1.5 py-0.5 bg-emerald-500/10 rounded"
                    >Visa Shield</span
                  >
                </div>
              </div>
            </div>
          </template>
        </Column>

        <Column field="country" header="Country" sortable>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="80px"
              height="1rem"
            />
            <span
              v-else
              class="px-3 py-1.5 rounded-lg bg-white/5 text-primary-400 border border-primary-500/20 text-[9px] font-black uppercase tracking-widest"
            >
              {{ slotProps.data.country }}
            </span>
          </template>
        </Column>

        <Column header="Courses" class="text-surface-400 text-center" sortable>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="30px"
              height="1rem"
              class="mx-auto"
            />
            <span v-else class="text-[11px] font-black text-white">{{
              slotProps.data._count?.courses || 0
            }}</span>
          </template>
        </Column>

        <Column field="website" header="Presence">
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="120px"
              height="1rem"
            />
            <a
              v-else-if="slotProps.data.website"
              :href="slotProps.data.website"
              target="_blank"
              class="text-[9px] font-black text-surface-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              <i class="pi pi-external-link text-[10px]" />
              Visit Portal
            </a>
            <span
              v-else
              class="text-[9px] text-surface-700 font-black uppercase tracking-widest"
              >No Website</span
            >
          </template>
        </Column>

        <Column header="Intelligence" alignFrozen="right" frozen>
          <template #body="slotProps">
            <div v-if="pending || isRefreshing" class="flex gap-2">
              <Skeleton shape="circle" size="2rem" />
              <Skeleton shape="circle" size="2rem" />
            </div>
            <div v-else class="flex gap-2">
              <a
                v-if="slotProps.data.website"
                :href="slotProps.data.website"
                target="_blank"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-500/10 text-primary-400 hover:text-primary-300 hover:bg-primary-500/20 transition-all border border-primary-500/20"
                title="Direct Portal Access"
              >
                <i class="pi pi-external-link text-[10px]" />
              </a>
              <button
                @click="editUniversity(slotProps.data)"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-surface-400 hover:text-primary-400 hover:bg-white/10 transition-all border border-white/5"
                title="Modify Intelligence"
              >
                <i class="pi pi-pencil text-[10px]" />
              </button>
              <button
                @click="confirmDelete(slotProps.data)"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-surface-400 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5"
                title="Excise Asset"
              >
                <i class="pi pi-trash text-[10px]" />
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="showDialog"
      header="University Intelligence Provisioning"
      modal
      class="neural-dialog overflow-y-auto"
      :style="{ width: '800px' }"
      :blockScroll="true"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-1">
        <!-- Core Identity Section -->
        <div class="space-y-5">
          <div
            class="flex items-center gap-2 border-l-2 border-primary-500 pl-3 mb-2"
          >
            <span
              class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
              >Institutional Identity</span
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                >Access Code</label
              >
              <InputText
                v-model="universityForm.code"
                placeholder="e.g. UNI_MIT"
                class="neural-input"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                >Country</label
              >
              <Select
                v-model="universityForm.country"
                :options="activeCountries"
                optionLabel="name"
                optionValue="name"
                placeholder="Select Territory"
                class="neural-select"
                :loading="countriesPending"
                filter
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Institutional Name</label
            >
            <InputText
              v-model="universityForm.name"
              placeholder="Official University Name"
              class="neural-input"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Digital Presence (URL)</label
            >
            <InputText
              v-model="universityForm.website"
              placeholder="https://university.edu"
              class="neural-input"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Branding (Logo URL)</label
            >
            <InputText
              v-model="universityForm.logo"
              placeholder="Path to logo asset"
              class="neural-input"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Strategic Banner (Hero URL)</label
            >
            <InputText
              v-model="universityForm.bannerImage"
              placeholder="Panoramic brand asset URL"
              class="neural-input"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Brief Intel</label
            >
            <Textarea
              v-model="universityForm.description"
              rows="4"
              placeholder="Describe the institutional legacy..."
              class="neural-input resize-none"
            />
          </div>
        </div>

        <!-- Partnership Intelligence Section -->
        <div
          class="space-y-5 bg-white/2 p-6 rounded-[24px] border border-white/5"
        >
          <div
            class="flex items-center gap-2 border-l-2 border-emerald-500 pl-3 mb-2"
          >
            <span
              class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
              >Partnership Intelligence</span
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                >Internal Priority (0-100)</label
              >
              <InputNumber
                v-model="universityForm.strategicRank"
                :min="0"
                :max="100"
                showButtons
                class="neural-input-number"
                inputClass="neural-input"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label
                class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                >Visa Success Rate (%)</label
              >
              <InputNumber
                v-model="universityForm.visaSuccessRate"
                :min="0"
                :max="100"
                mode="decimal"
                class="neural-input-number"
                inputClass="neural-input"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Commission Velocity</label
            >
            <Select
              v-model="universityForm.commissionSpeed"
              :options="speedOptions"
              optionLabel="label"
              optionValue="value"
              class="neural-select"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Offer TAT Index</label
            >
            <Select
              v-model="universityForm.offerTATIndex"
              :options="tatOptions"
              optionLabel="label"
              optionValue="value"
              class="neural-select"
            />
          </div>

          <div class="grid grid-cols-1 gap-3 pt-2">
            <div
              class="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5"
            >
              <div class="flex flex-col">
                <span
                  class="text-[10px] font-black text-white uppercase tracking-widest"
                  >Premium Partner</span
                >
                <span
                  class="text-[8px] text-surface-500 uppercase font-bold tracking-widest"
                  >Promote in Search Results</span
                >
              </div>
              <ToggleSwitch v-model="universityForm.isPremiumPartner" />
            </div>
            <div
              class="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5"
            >
              <div class="flex flex-col">
                <span
                  class="text-[10px] font-black text-white uppercase tracking-widest"
                  >Direct Contract</span
                >
                <span
                  class="text-[8px] text-surface-500 uppercase font-bold tracking-widest"
                  >Direct Institutional Relationship</span
                >
              </div>
              <ToggleSwitch v-model="universityForm.hasDirectContract" />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Institutional Strategic Tags</label
            >
            <MultiSelect
              v-model="universityForm.strategicTags"
              :options="strategicTagOptions"
              placeholder="Select Indicators"
              class="neural-select"
              display="chip"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 p-1">
          <button
            @click="showDialog = false"
            class="px-4 py-2 text-[10px] font-black text-surface-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Abort
          </button>
          <Button
            label="Initialize Synchronization"
            :loading="isSaving"
            class="p-button-primary! px-6! py-2! rounded-xl! font-black! text-[10px]! uppercase! tracking-widest!"
            @click="saveUniversity"
          />
        </div>
      </template>
    </Dialog>

    <!-- Excision Confirmation -->
    <Dialog
      v-model:visible="deleteDialog"
      header="Confirm Excision"
      modal
      class="neural-dialog"
      :style="{ width: '350px' }"
    >
      <div class="flex flex-col items-center text-center p-4">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-4" />
        <p class="text-sm font-bold text-white mb-2">
          ARE YOU ABSOLUTELY SURE?
        </p>
        <p class="text-[11px] text-surface-500 leading-relaxed font-medium">
          You are about to excise
          <span class="text-white font-bold">{{
            selectedUniversity?.name
          }}</span>
          from the global registry. This action is irreversible.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-center gap-3 pb-4">
          <button
            @click="deleteDialog = false"
            class="px-5 py-2 text-[10px] font-black text-surface-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Abort
          </button>
          <button
            @click="executeDelete"
            class="px-5 py-2 text-[10px] font-black bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all uppercase tracking-widest"
          >
            Excise Asset
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.neural-dialog) {
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

:deep(.neural-dialog .p-dialog-header) {
  background: transparent;
  padding: 1.5rem 1.5rem 0.5rem;
  font-family: inherit;
}

:deep(.neural-dialog .p-dialog-title) {
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
}

:deep(.neural-dialog .p-dialog-content) {
  background: transparent;
  padding: 1rem 1.5rem;
}

:deep(.neural-dialog .p-dialog-footer) {
  background: transparent;
  padding: 0.5rem 1.5rem 1.5rem;
  border: none;
}

:deep(.neural-input),
:deep(.neural-select) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
  padding: 0.75rem 1rem !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: white !important;
  transition: all 0.2s !important;
}

:deep(.neural-select) {
  padding: 0 !important;
  height: 42px !important;
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
}

:deep(.neural-select .p-select-label) {
  padding: 0.75rem 1rem !important;
  background: transparent !important;
  color: white !important;
}

:deep(.neural-select .p-select-dropdown) {
  width: 3rem !important;
}

:deep(.p-select-panel) {
  background: rgba(10, 10, 10, 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  border-radius: 16px !important;
}

:deep(.p-select-filter-container) {
  padding: 0.75rem !important;
}

:deep(.p-select-filter) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 10px !important;
  padding: 0.5rem 0.75rem !important;
  font-size: 11px !important;
  color: white !important;
}

:deep(.p-select-filter:focus) {
  border-color: rgba(99, 102, 241, 0.5) !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.p-select-option) {
  padding: 0.6rem 0.75rem !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #94a3b8 !important;
  transition: all 0.2s !important;
}

:deep(.p-select-option:hover),
:deep(.p-select-option.p-highlight) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}

:deep(.neural-input:focus),
:deep(.neural-select:focus-within) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(99, 102, 241, 0.5) !important;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
}

:deep(.p-datatable-sm .p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
}

:deep(.p-datatable-sm .p-datatable-tbody > tr) {
  background: transparent;
  transition: all 0.2s;
}

:deep(.p-datatable-sm .p-datatable-tbody > tr:hover) {
  background: rgba(255, 255, 255, 0.02);
}

:deep(.p-datatable-sm .p-datatable-tbody > tr > td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  padding: 1rem;
}

/* Scrollbar Styling */
:deep(.p-datatable-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-thumb) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
