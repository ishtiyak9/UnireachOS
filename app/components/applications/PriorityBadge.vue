<script setup lang="ts">
import { APPLICATION_PRIORITIES } from "~/../shared/constants";

const props = defineProps<{
  priority: keyof typeof APPLICATION_PRIORITIES | string;
}>();

const config = computed(() => {
  return (
    APPLICATION_PRIORITIES[
      props.priority as keyof typeof APPLICATION_PRIORITIES
    ] || {
      label: props.priority,
      color: "text-slate-500",
      icon: "pi pi-info-circle",
    }
  );
});
</script>

<template>
  <div
    class="flex items-center gap-2 px-2 py-1 rounded-md bg-surface-800/50 border border-surface-700 w-fit"
  >
    <i :class="[config.icon, config.color]" class="text-xs"></i>
    <span class="text-xs font-medium uppercase tracking-wider text-surface-200">
      {{ config.label }}
    </span>
  </div>
</template>
