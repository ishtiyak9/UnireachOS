<template>
  <div class="base-datatable-wrapper space-y-4">
    <DataTable
      ref="dt"
      v-bind="$attrs"
      :value="value"
      :paginator="paginator"
      :rows="rows"
      :rows-per-page-options="[5, 10, 20, 50]"
      :loading="loading"
      :filters="filters"
      filter-display="menu"
      :global-filter-fields="globalFilterFields"
      removable-sort
      striped-rows
      scrollable
      scroll-height="flex"
      class="p-datatable-unireach"
      :pt="{
        root: {
          class:
            'rounded-3xl! border! border-surface-200 dark:border-surface-800 bg-white! dark:bg-surface-900 overflow-hidden',
        },
        header: {
          class:
            'bg-surface-50! dark:bg-surface-900/50! border-b! border-surface-200 dark:border-surface-800 p-6!',
        },
        thead: {
          class:
            'text-xs uppercase tracking-wider font-bold bg-surface-50! dark:bg-surface-900/50!',
        },
        tbody: { class: 'text-sm text-surface-700 dark:text-surface-300' },
        column: {
          headerContent: { class: 'gap-2' },
          headerTitle: { class: 'font-bold' },
        },
        paginator: {
          root: {
            class:
              'bg-surface-0! dark:bg-surface-900! border-t! border-surface-200 dark:border-surface-800 p-4!',
          },
        },
      }"
    >
      <!-- Header with Global Search and Actions -->
      <template #header v-if="showHeader">
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <span
              class="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary-700"
            >
              {{ title }}
            </span>
            <slot name="header-left" />
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <span v-if="enableGlobalFilter" class="relative w-full md:w-64">
              <Icon
                name="lucide:search"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4 z-10"
              />
              <InputText
                v-model="filters['global'].value"
                placeholder="Global Search..."
                class="w-full pl-10! rounded-xl! bg-surface-0! dark:bg-surface-950! border-surface-200! dark:border-surface-800!"
              />
            </span>

            <BaseButton
              v-if="exportable"
              icon="pi pi-external-link"
              label="Export CSV"
              severity="secondary"
              variant="outlined"
              size="small"
              class="rounded-xl!"
              @click="exportCSV"
            />

            <slot name="header-right" />
          </div>
        </div>
      </template>

      <!-- Passthrough all other named slots -->
      <template
        v-for="slotName in Object.keys($slots).filter(
          (s) => !['header', 'default', 'empty'].includes(s)
        )"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <!-- Handle Columns and Empty state explicitly to avoid reconciliation issues -->
      <slot />

      <!-- Empty State -->
      <template #empty>
        <div
          class="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div
            class="p-6 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-400"
          >
            <Icon name="lucide:database-zap" class="w-12 h-12" />
          </div>
          <div class="space-y-1">
            <p class="text-lg font-bold text-surface-900 dark:text-surface-0">
              No records found
            </p>
            <p class="text-sm text-surface-500">
              Try adjusting your filters or search query.
            </p>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FilterMatchMode } from "@primevue/core/api";
import DataTable from "primevue/datatable";

interface Props {
  value: any[];
  title?: string;
  showHeader?: boolean;
  paginator?: boolean;
  rows?: number;
  loading?: boolean;
  exportable?: boolean;
  enableGlobalFilter?: boolean;
  globalFilterFields?: string[];
  initialFilters?: any;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Data Management",
  showHeader: true,
  paginator: true,
  rows: 10,
  loading: false,
  exportable: true,
  enableGlobalFilter: true,
  globalFilterFields: () => ["name", "email", "status"],
  initialFilters: null,
});

const dt = ref();
const filters = ref(
  props.initialFilters || {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
);

const exportCSV = () => {
  dt.value.exportCSV();
};

defineExpose({
  exportCSV,
  dt,
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
@reference "../../assets/css/main.css";

/* Nuxt 4 / PrimeVue Datatable Styling Overrides */
.p-datatable-unireach .p-datatable-column-header-content {
  @apply text-surface-800! dark:text-surface-100!;
}

.p-datatable-unireach .p-datatable-tbody > tr {
  @apply transition-colors! duration-200! border-b border-surface-100 dark:border-surface-800;
}

.p-datatable-unireach .p-datatable-tbody > tr:hover {
  @apply bg-primary/5! cursor-default;
}

/* Custom Paginator Styling */
.p-datatable-unireach .p-paginator-page,
.p-datatable-unireach .p-paginator-next,
.p-datatable-unireach .p-paginator-last,
.p-datatable-unireach .p-paginator-first,
.p-datatable-unireach .p-paginator-prev {
  @apply rounded-xl! min-w-10! h-10!;
}

.p-datatable-unireach .p-paginator-page.p-highlight {
  @apply bg-primary! text-white! shadow-lg! shadow-primary/30!;
}
</style>
