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
  studyAreaId: "",
  disciplineId: "",
});

// Fetch Course Intelligence from Registry (with Server-Side Filtering)
const {
  data: courses,
  refresh,
  pending,
} = useFetch("/api/admin/courses", {
  query: selectedFilters,
  watch: [selectedFilters],
}) as any;

const { data: countriesRes } = useFetch("/api/countries");
const countries = computed(() => (countriesRes.value as any)?.data || []);

const { data: studyAreasRes } = useFetch("/api/admin/maintenance/study-areas");
const studyAreas = computed(() => (studyAreasRes.value as any)?.data || []);

const { data: disciplinesRes } = useFetch("/api/admin/maintenance/disciplines");
const disciplines = computed(() => (disciplinesRes.value as any)?.data || []);

const filteredDisciplines = computed(() => {
  if (!selectedFilters.value.studyAreaId) return disciplines.value;
  return disciplines.value.filter(
    (d: any) => d.studyAreaId === selectedFilters.value.studyAreaId
  );
});

const clearFilters = () => {
  selectedFilters.value = {
    country: "",
    studyAreaId: "",
    disciplineId: "",
  };
};

const isRefreshing = ref(false);
const deleteDialog = ref(false);
const selectedCourse = ref<any>(null);

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

const confirmDelete = (course: any) => {
  selectedCourse.value = course;
  deleteDialog.value = true;
};

const executeDelete = async () => {
  try {
    await $fetch(`/api/admin/courses/${selectedCourse.value.id}`, {
      method: "DELETE",
    });
    toast.add({
      severity: "success",
      summary: "Asset Excised",
      detail: "Course removed from the catalog.",
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

const filteredCourses = computed(() => {
  const all = (courses.value as any[]) || [];
  if (!filters.value.global.value) return all;

  const search = filters.value.global.value.toLowerCase();
  return all.filter(
    (c: any) =>
      c.name.toLowerCase().includes(search) ||
      c.university?.name.toLowerCase().includes(search) ||
      c.code?.toLowerCase().includes(search) ||
      c.level?.name.toLowerCase().includes(search) ||
      c.studyArea?.name?.toLowerCase().includes(search) ||
      c.discipline?.name?.toLowerCase().includes(search)
  );
});

const stats = computed(() => {
  const all = (courses.value as any[]) || [];
  return [
    { label: "Active Courses", value: all.length, color: "text-white" },
    {
      label: "Institutional Reach",
      value: new Set(all.map((c) => c.universityId)).size,
      color: "text-primary-400",
    },
    {
      label: "Program Levels",
      value: new Set(all.map((c) => c.levelId)).size,
      color: "text-emerald-400",
    },
    { label: "Catalog Health", value: "Optimal", color: "text-blue-400" },
  ];
});
</script>

<template>
  <div class="space-y-6">
    <!-- Premium Header -->
    <DashboardPageHeader
      title="COURSE"
      subtitle="Global Academic Inventory & Program Intelligence"
    >
      <template #title>
        COURSE <span class="text-primary-500 italic">CATALOG.</span>
      </template>

      <template #actions>
        <!-- Global Search Core -->
        <div class="relative w-64">
          <i
            class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 text-[10px]"
          />
          <InputText
            v-model="filters.global.value"
            placeholder="Search Course Registry..."
            class="w-full! bg-surface-900/50! border-white/5! pl-10! h-10! text-[10px] font-bold rounded-xl focus:border-primary-500/50! backdrop-blur-xl"
          />
        </div>

        <button
          @click="handleRefresh"
          :disabled="isRefreshing || pending"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-900 border border-white/5 text-surface-400 hover:text-white transition-all disabled:opacity-50"
          title="Sync Catalog"
        >
          <i
            :class="[
              'pi pi-refresh text-xs',
              isRefreshing || pending ? 'animate-spin' : '',
            ]"
          />
        </button>

        <DashboardIntelligenceExport
          :data="filteredCourses"
          :columns="[
            { field: 'name', header: 'Course' },
            { field: 'university.name', header: 'University' },
            { field: 'level.name', header: 'Level' },
            { field: 'studyArea.name', header: 'Study Area' },
            { field: 'discipline.name', header: 'Discipline' },
            { field: 'duration', header: 'Duration' },
            { field: 'tuitionFee', header: 'Fee' },
          ]"
          file-name="unireach-course-catalog"
          label="Export"
          report-title="Global Course Catalog"
        />

        <NuxtLink to="/dashboard/inventory/courses/provision">
          <Button
            label="Provision Course"
            icon="pi pi-plus"
            class="p-button-primary! h-10! rounded-xl! font-black! text-[9px]! uppercase! tracking-widest! px-4!"
          />
        </NuxtLink>
      </template>
    </DashboardPageHeader>

    <!-- Intelligence Filter Matrix -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-xl flex flex-wrap items-center gap-4"
    >
      <div class="flex-1 min-w-[200px]">
        <label
          class="text-[9px] font-black text-surface-500 uppercase tracking-widest block mb-2 px-1"
          >Target Country</label
        >
        <Select
          v-model="selectedFilters.country"
          :options="countries"
          optionLabel="name"
          optionValue="name"
          placeholder="All Countries"
          class="neural-select h-10! text-[10px]!"
          showClear
          filter
        />
      </div>

      <div class="flex-1 min-w-[200px]">
        <label
          class="text-[9px] font-black text-surface-500 uppercase tracking-widest block mb-2 px-1"
          >Study Area</label
        >
        <Select
          v-model="selectedFilters.studyAreaId"
          :options="studyAreas"
          optionLabel="name"
          optionValue="id"
          placeholder="All Study Areas"
          class="neural-select h-10! text-[10px]!"
          showClear
          filter
          @change="selectedFilters.disciplineId = ''"
        />
      </div>

      <div class="flex-1 min-w-[200px]">
        <label
          class="text-[9px] font-black text-surface-500 uppercase tracking-widest block mb-2 px-1"
          >Discipline Area</label
        >
        <Select
          v-model="selectedFilters.disciplineId"
          :options="filteredDisciplines"
          optionLabel="name"
          optionValue="id"
          placeholder="All Disciplines"
          class="neural-select h-10! text-[10px]!"
          showClear
          filter
          :disabled="!selectedFilters.studyAreaId"
        />
      </div>

      <div class="flex items-end self-end">
        <button
          @click="clearFilters"
          class="h-10 px-4 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-surface-500 hover:text-white transition-all mt-6"
        >
          Reset
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

    <!-- Inventory Table -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl"
    >
      <DataTable
        :value="
          pending || isRefreshing ? Array.from({ length: 6 }) : filteredCourses
        "
        dataKey="id"
        :paginator="true"
        :rows="10"
        class="p-datatable-sm"
        removableSort
      >
        <Column
          field="name"
          header="Academic Program"
          sortable
          class="font-bold text-white"
        >
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="200px"
              height="1rem"
            />
            <div v-else class="flex flex-col">
              <span
                class="text-[11px] font-black text-white uppercase tracking-wider"
              >
                {{ slotProps.data.name }}
              </span>
              <span
                class="text-[9px] text-surface-500 font-bold uppercase tracking-widest"
              >
                {{ slotProps.data.code || "NO_CODE" }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="university.name" header="Institution" sortable>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="150px"
              height="1rem"
            />
            <div v-else class="flex items-center gap-2">
              <div
                class="w-6 h-6 rounded bg-surface-800 flex items-center justify-center border border-white/5 overflow-hidden"
              >
                <img
                  v-if="slotProps.data.university?.logo"
                  :src="slotProps.data.university.logo"
                  class="w-full h-full object-cover"
                />
                <i v-else class="pi pi-building text-[10px] text-surface-600" />
              </div>
              <span class="text-[10px] font-bold text-surface-300">{{
                slotProps.data.university?.name
              }}</span>
            </div>
          </template>
        </Column>

        <Column field="level.name" header="Qualification" sortable>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="100px"
              height="1rem"
            />
            <span
              v-else
              class="px-2 py-1 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20 text-[9px] font-black uppercase tracking-widest"
            >
              {{ slotProps.data.level?.name }}
            </span>
          </template>
        </Column>

        <Column field="tuitionFee" header="Investment" sortable>
          <template #body="slotProps">
            <Skeleton
              v-if="pending || isRefreshing"
              width="80px"
              height="1rem"
            />
            <div v-else class="flex flex-col">
              <span class="text-[11px] font-black text-white">
                {{ slotProps.data.currency }}
                {{ slotProps.data.tuitionFee.toLocaleString() }}
              </span>
              <span
                class="text-[9px] text-surface-500 font-bold uppercase tracking-widest"
              >
                {{ slotProps.data.duration }}
              </span>
            </div>
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
                v-if="slotProps.data.courseUrl"
                :href="slotProps.data.courseUrl"
                target="_blank"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-500/10 text-primary-400 hover:text-primary-300 hover:bg-primary-500/20 transition-all border border-primary-500/20"
                title="View Institutional Program"
              >
                <i class="pi pi-external-link text-[10px]" />
              </a>
              <NuxtLink
                :to="`/dashboard/inventory/courses/provision?id=${slotProps.data.id}`"
              >
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-surface-400 hover:text-primary-400 hover:bg-white/10 transition-all border border-white/5"
                  title="Update Intelligence"
                >
                  <i class="pi pi-pencil text-[10px]" />
                </button>
              </NuxtLink>
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
          <span class="text-white font-bold">{{ selectedCourse?.name }}</span>
          from the global catalog. This action is irreversible.
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
</style>
