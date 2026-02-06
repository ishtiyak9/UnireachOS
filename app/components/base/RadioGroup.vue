<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label
      v-if="label"
      class="text-sm font-semibold text-surface-700 dark:text-surface-300 ml-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="flex flex-wrap gap-4 mt-1">
      <div
        v-for="option in options"
        :key="option[optionValue] || option"
        class="flex items-center gap-2"
      >
        <RadioButton
          v-model="model"
          :input-id="`${id}-${option[optionValue] || option}`"
          :name="id"
          :value="option[optionValue] || option"
          v-bind="$attrs"
          :class="[
            '!border-surface-200 dark:!border-surface-800',
            error ? '!border-red-500' : '',
          ]"
        />
        <label
          :for="`${id}-${option[optionValue] || option}`"
          class="text-sm text-surface-600 dark:text-surface-400 cursor-pointer select-none"
        >
          {{ option[optionLabel] || option }}
        </label>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-1 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
    >
      <small v-if="error" class="text-red-500 text-xs ml-1 font-medium italic">
        {{ error }}
      </small>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<any>();

interface Props {
  id: string;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  optionLabel: "label",
  optionValue: "value",
});

defineOptions({
  inheritAttrs: false,
});
</script>
