<script setup lang="ts">
/**
 * GlassTable.vue
 * A preset DataTable wrapper with the dashboard's signature glassmorphism style.
 * Passes through all slots and attributes to PrimeVue DataTable.
 */
</script>

<template>
  <div
    class="card rounded-2xl bg-surface-900/40 border border-white/5 overflow-hidden backdrop-blur-3xl"
  >
    <div class="overflow-x-auto">
      <DataTable v-bind="$attrs" class="glass-table" removableSort>
        <!-- Pass through all slots -->
        <template v-for="(_, slot) in $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope || {}" />
        </template>

        <!-- Default Loading Template if not provided -->
        <template #loading>
          <div class="flex items-center justify-center p-8">
            <i class="pi pi-spin pi-spinner text-primary-500 text-2xl"></i>
          </div>
        </template>

        <!-- Default Empty Template -->
        <template #empty>
          <div
            class="flex flex-col items-center justify-center p-8 text-surface-500"
          >
            <i class="pi pi-folder-open text-4xl mb-2 opacity-50"></i>
            <span class="text-sm font-medium">No records found</span>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
/* Scoped Styles for Glass Table deep overrides */
:deep(.glass-table .p-datatable-header) {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0;
}

:deep(.glass-table .p-datatable-thead > tr > th) {
  background: rgba(255, 255, 255, 0.02);
  color: var(--p-surface-400);
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 800;
  border: none;
}

:deep(.glass-table .p-datatable-tbody > tr) {
  background: transparent;
  transition: background-color 0.2s;
}

:deep(.glass-table .p-datatable-tbody > tr:hover) {
  background: rgba(255, 255, 255, 0.03);
}

:deep(.glass-table .p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--p-surface-200);
}

:deep(.glass-table .p-paginator) {
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
}

:deep(.glass-table .p-paginator-element) {
  color: var(--p-surface-400);
}

:deep(.glass-table .p-paginator-element:hover) {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

:deep(.glass-table .p-paginator-element.p-highlight) {
  background: var(--p-primary-500);
  color: black;
  font-weight: bold;
}
</style>
