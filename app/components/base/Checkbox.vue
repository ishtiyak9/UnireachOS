<template>
  <div class="flex items-start gap-2.5">
    <div class="flex items-center h-5">
      <Checkbox
        :id="id"
        v-model="model"
        v-bind="$attrs"
        binary
        :class="[
          '!rounded-lg !border-surface-200 dark:!border-surface-800',
          error ? '!border-red-500' : '',
        ]"
      />
    </div>
    <div class="flex flex-col">
      <label
        v-if="label"
        :for="id"
        class="text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer select-none"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <small v-if="helpText" class="text-surface-500 text-xs">
        {{ helpText }}
      </small>
      <small v-if="error" class="text-red-500 text-xs mt-0.5 font-medium">
        {{ error }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
// Base Checkbox wrapper for PrimeVue Checkbox
const model = defineModel<any>();

interface Props {
  id?: string;
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

defineProps<Props>();

defineOptions({
  inheritAttrs: false,
});
</script>
