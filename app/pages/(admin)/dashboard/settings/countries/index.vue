<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { data: countryRes, refresh } = await useFetch("/api/admin/countries");
const countries = computed(() => (countryRes.value as any)?.data || []);

const showModal = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);

const form = reactive({
  id: "",
  name: "",
  code: "",
  flag: "",
  isActive: true,
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const openCreateDialog = () => {
  isEditing.value = false;
  form.id = "";
  form.name = "";
  form.code = "";
  form.flag = "";
  form.isActive = true;
  showModal.value = true;
};

const editCountry = (country: any) => {
  isEditing.value = true;
  form.id = country.id;
  form.name = country.name;
  form.code = country.code;
  form.flag = country.flag || "";
  form.isActive = country.isActive;
  showModal.value = true;
};

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    const endpoint = isEditing.value
      ? "/api/admin/countries/update"
      : "/api/admin/countries/create";

    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(endpoint, {
      method,
      body: form,
    });

    showModal.value = false;
    refresh();
  } catch (error) {
    alert("Protocol Failure: Failed to sync destination data.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-white uppercase tracking-wider">
          Geo-Registry
        </h1>
        <p class="text-[10px] text-surface-500 uppercase tracking-[0.3em] mt-1">
          Global Destination Management
        </p>
      </div>
      <div class="flex items-center gap-3">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search text-surface-400" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Search Regions..."
            class="!bg-surface-900/50 !border-white/5 !text-[11px] !rounded-xl !pl-10 !py-2.5 !w-64 uppercase tracking-widest focus:!border-primary-500 transition-all"
          />
        </IconField>
        <button
          @click="openCreateDialog"
          class="px-5 py-2.5 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all"
        >
          Add Country
        </button>
      </div>
    </div>

    <div
      class="bg-surface-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl"
    >
      <DataTable
        :value="countries"
        v-model:filters="filters"
        :paginator="true"
        :rows="15"
        dataKey="id"
        filterDisplay="menu"
        :globalFilterFields="['name', 'code']"
        class="neural-table"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} destinations"
      >
        <Column
          field="name"
          header="Country"
          sortable
          class="px-6 py-4"
          headerClass="!bg-white/[0.02] !border-b !border-white/5"
        >
          <template #header>
            <span
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
              >Country</span
            >
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-6 bg-surface-800 rounded flex items-center justify-center overflow-hidden border border-white/5 text-[10px]"
              >
                <span v-if="!data.flag">{{ data.code }}</span>
                <img
                  v-else
                  :src="data.flag"
                  class="w-full h-full object-cover"
                />
              </div>
              <span
                class="text-[11px] font-bold text-white uppercase tracking-wider"
              >
                {{ data.name }}
              </span>
            </div>
          </template>
        </Column>

        <Column
          field="code"
          header="ISO Code"
          sortable
          headerClass="!bg-white/[0.02] !border-b !border-white/5"
        >
          <template #header>
            <span
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
              >ISO Code</span
            >
          </template>
          <template #body="{ data }">
            <span class="text-[10px] font-mono text-surface-400 uppercase">
              {{ data.code }}
            </span>
          </template>
        </Column>

        <Column
          field="isActive"
          header="Status"
          sortable
          headerClass="!bg-white/[0.02] !border-b !border-white/5"
        >
          <template #header>
            <span
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
              >Status</span
            >
          </template>
          <template #body="{ data }">
            <span
              class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border"
              :class="
                data.isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-surface-800 text-surface-500 border-white/5'
              "
            >
              {{ data.isActive ? "Active" : "Inactive" }}
            </span>
          </template>
        </Column>

        <Column
          headerClass="!bg-white/[0.02] !border-b !border-white/5"
          class="text-right"
        >
          <template #body="{ data }">
            <button
              @click="editCountry(data)"
              class="p-2 text-surface-500 hover:text-white transition-colors"
            >
              <i class="pi pi-pencil text-xs" />
            </button>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
        @click="showModal = false"
      />
      <div
        class="relative w-full max-w-md bg-surface-950 border border-white/10 rounded-2xl p-6"
      >
        <h3
          class="text-sm font-black text-white uppercase tracking-widest mb-6"
        >
          {{ isEditing ? "Modify Destination" : "Register New Country" }}
        </h3>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label
              class="block text-[8px] font-black text-surface-500 uppercase tracking-widest mb-2"
              >Display Name</label
            >
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2.5 bg-surface-900 border border-white/5 rounded-lg text-white text-[11px] focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[8px] font-black text-surface-500 uppercase tracking-widest mb-2"
                >ISO Code</label
              >
              <input
                v-model="form.code"
                type="text"
                required
                class="w-full px-4 py-2.5 bg-surface-900 border border-white/5 rounded-lg text-white text-[11px] focus:border-primary-500 outline-none transition-all"
                placeholder="e.g. DE"
              />
            </div>
            <div>
              <label
                class="block text-[8px] font-black text-surface-500 uppercase tracking-widest mb-2"
                >Flag URL</label
              >
              <input
                v-model="form.flag"
                type="text"
                class="w-full px-4 py-2.5 bg-surface-900 border border-white/5 rounded-lg text-white text-[11px] focus:border-primary-500 outline-none transition-all"
                placeholder="Optional"
              />
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2">
            <input
              v-model="form.isActive"
              type="checkbox"
              id="isActive"
              class="accent-primary-500"
            />
            <label
              for="isActive"
              class="text-[10px] font-bold text-surface-400 uppercase tracking-widest"
              >Active operational status</label
            >
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 py-3 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all disabled:opacity-50"
            >
              {{
                isSubmitting ? "Saving..." : isEditing ? "Update" : "Register"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.neural-table) {
  --p-datatable-background: transparent;
  --p-datatable-header-cell-background: transparent;
  --p-datatable-row-background: transparent;
  --p-datatable-row-hover-background: rgba(255, 255, 255, 0.02);
  --p-datatable-border-color: rgba(255, 255, 255, 0.05);
  --p-datatable-paginator-background: transparent;
  --p-paginator-background: transparent;
  --p-paginator-color: #94a3b8;
  --p-paginator-item-selected-background: var(--p-primary-500);
  --p-paginator-item-selected-color: black;
}

:deep(.p-datatable-thead > tr > th) {
  padding: 1rem 1.5rem;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:deep(.p-paginator) {
  padding: 1rem;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
