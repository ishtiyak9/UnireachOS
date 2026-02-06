<template>
  <Button
    v-bind="$attrs"
    :class="[
      'font-medium transition-all duration-200 active:scale-[0.98]',
      // Custom UniReach branding logic can go here
      $attrs.severity === 'secondary'
        ? 'shadow-sm'
        : 'shadow-md shadow-primary/10',
    ]"
  >
    <template v-for="slotName in Object.keys($slots)" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </Button>
</template>

<script setup lang="ts">
import Button from "primevue/button";
// Base Button wrapper for PrimeVue Button
defineOptions({
  inheritAttrs: false,
});
</script>
