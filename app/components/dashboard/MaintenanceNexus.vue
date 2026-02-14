<script setup lang="ts">
import { ref, computed } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import { useToast } from "primevue/usetoast";

interface Props {
  title: string;
  subtitle: string;
  apiEndpoint: string;
  entityName: string;
  searchPlaceholder?: string;
  newItemLabel?: string;
  defaultForm: Record<string, any>;
  dialogWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: "Search...",
  newItemLabel: "New Item",
  dialogWidth: "450px",
});

const emit = defineEmits(["saved", "deleted", "refresh"]);

const toast = useToast();

const { data: response, refresh, pending } = useFetch(props.apiEndpoint) as any;

const items = computed(() => response.value?.data || []);

const isRefreshing = ref(false);
const isSaving = ref(false);
const showDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);

const form = ref({ ...props.defaultForm });

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const openNew = () => {
  form.value = { ...props.defaultForm };
  submitted.value = false;
  showDialog.value = true;
};

const hideDialog = () => {
  showDialog.value = false;
  submitted.value = false;
};

const editItem = (data: any) => {
  form.value = { ...data };
  showDialog.value = true;
};

const confirmDeleteItem = (data: any) => {
  form.value = data;
  deleteDialog.value = true;
};

const saveItem = async () => {
  submitted.value = true;

  // Generic validation for 'name' if it exists
  if ("name" in form.value && !form.value.name?.trim()) return;

  isSaving.value = true;
  try {
    const isUpdate = !!form.value.id;
    const url = isUpdate
      ? `${props.apiEndpoint}/${form.value.id}`
      : props.apiEndpoint;
    const method = isUpdate ? "PATCH" : "POST";

    await $fetch(url, {
      method,
      body: form.value,
    });

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: `${props.entityName} ${isUpdate ? "Updated" : "Created"}`,
      life: 3000,
    });

    showDialog.value = false;
    refresh();
    emit("saved");
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.data?.message || "Something went wrong",
      life: 3000,
    });
  } finally {
    isSaving.value = false;
  }
};

const deleteItem = async () => {
  try {
    await $fetch(`${props.apiEndpoint}/${form.value.id}`, {
      method: "DELETE",
    });
    deleteDialog.value = false;
    refresh();
    emit("deleted");
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: `${props.entityName} Deleted`,
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.data?.message || "Failed to delete",
      life: 3000,
    });
  }
};

const handleRefresh = async () => {
  isRefreshing.value = true;
  await refresh();
  emit("refresh");
  setTimeout(() => (isRefreshing.value = false), 500);
};

defineExpose({
  refresh: handleRefresh,
  items,
});
</script>

<template>
  <div class="space-y-6">
    <DashboardPageHeader :title="title" :subtitle="subtitle">
      <template #title>
        <slot name="header-title">{{ title }}</slot>
      </template>

      <template #actions>
        <div class="relative w-64">
          <i
            class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 text-[10px]"
          />
          <InputText
            v-model="filters['global'].value"
            :placeholder="searchPlaceholder"
            class="w-full! bg-surface-900/50! border-white/5! pl-10! h-10! text-[10px] font-bold rounded-xl focus:border-primary-500/50! backdrop-blur-xl"
          />
        </div>

        <button
          @click="handleRefresh"
          :disabled="isRefreshing || pending"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-900 border border-white/5 text-surface-400 hover:text-white transition-all disabled:opacity-50"
        >
          <i
            :class="[
              'pi pi-refresh text-xs',
              isRefreshing || pending ? 'animate-spin' : '',
            ]"
          />
        </button>

        <Button
          :label="newItemLabel"
          icon="pi pi-plus"
          @click="openNew"
          class="p-button-primary! h-10! rounded-xl! font-black! text-[10px]! uppercase! tracking-widest! px-4!"
        />
      </template>
    </DashboardPageHeader>

    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl"
    >
      <DataTable
        :value="items"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        class="p-datatable-sm"
        removableSort
        :loading="pending"
      >
        <slot name="columns"></slot>

        <Column field="isActive" header="Status" sortable>
          <template #body="slotProps">
            <span
              :class="[
                'px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border',
                slotProps.data.isActive
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-500 border-red-500/20',
              ]"
            >
              {{ slotProps.data.isActive ? "Active" : "Inactive" }}
            </span>
          </template>
        </Column>

        <Column header="Actions" alignFrozen="right" frozen>
          <template #body="slotProps">
            <div class="flex gap-2">
              <button
                @click="editItem(slotProps.data)"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-surface-400 hover:text-primary-400 hover:bg-white/10 transition-all border border-white/5"
              >
                <i class="pi pi-pencil text-[10px]" />
              </button>
              <button
                @click="confirmDeleteItem(slotProps.data)"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-surface-400 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5"
              >
                <i class="pi pi-trash text-[10px]" />
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Edit/Create Dialog -->
    <Dialog
      v-model:visible="showDialog"
      :header="form.id ? `Update ${entityName}` : `New ${entityName}`"
      modal
      class="neural-dialog"
      :style="{ width: dialogWidth }"
      :blockScroll="true"
    >
      <div class="space-y-6 pt-4 overflow-x-hidden">
        <slot name="form" :form="form" :submitted="submitted"></slot>

        <div
          class="flex items-center justify-between p-4 bg-white/3 rounded-2xl border border-white/5"
        >
          <div class="flex flex-col gap-0.5">
            <span
              class="text-[10px] font-black text-white uppercase tracking-wider"
              >Status</span
            >
            <span
              class="text-[9px] text-surface-500 font-bold uppercase tracking-widest"
              >Visibility in the registry</span
            >
          </div>
          <ToggleSwitch v-model="form.isActive" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 pb-4">
          <button
            @click="hideDialog"
            class="px-5 py-2 text-[10px] font-black text-surface-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveItem"
            :disabled="isSaving"
            class="px-5 py-2 text-[10px] font-black bg-primary-500/10 text-primary-500 border border-primary-500/20 rounded-xl hover:bg-primary-500/20 transition-all uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
          >
            <i v-if="isSaving" class="pi pi-spin pi-spinner text-[10px]" />
            {{ isSaving ? "Synchronizing..." : "Save Changes" }}
          </button>
        </div>
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog
      v-model:visible="deleteDialog"
      header="Confirm Excision"
      modal
      class="neural-dialog"
      :style="{ width: '350px' }"
    >
      <div class="flex flex-col items-center text-center p-4">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-4" />
        <p class="text-sm font-bold text-white mb-2">ARE YOU SURE?</p>
        <p class="text-[11px] text-surface-500 leading-relaxed font-medium">
          You are about to excise
          <span class="text-white font-bold">{{
            form.name || "this item"
          }}</span>
          from the registry.
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
            @click="deleteItem"
            class="px-5 py-2 text-[10px] font-black bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all uppercase tracking-widest"
          >
            Confirm
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
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
}
</style>
