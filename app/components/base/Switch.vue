<template>
  <div class="flex items-center gap-3">
    <ToggleSwitch
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :class="[error ? 'p-invalid' : '']"
    />
    <div class="flex flex-col">
      <label
        v-if="label"
        :for="id"
        class="text-sm font-semibold text-surface-700 dark:text-surface-300 cursor-pointer select-none"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <small v-if="helpText" class="text-surface-500 text-xs">
        {{ helpText }}
      </small>
      <small
        v-if="error"
        class="text-red-500 text-xs font-medium italic mt-0.5"
      >
        {{ error }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();

interface Props {
  id: string;
  label?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
}

defineProps<Props>();

defineOptions({
  inheritAttrs: false,
});
</script>
