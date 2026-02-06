<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label
      v-if="label"
      :for="id"
      class="text-sm font-semibold text-surface-700 dark:text-surface-300 ml-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <Textarea
      :id="id"
      v-model="model"
      v-bind="$attrs"
      rows="4"
      :class="[
        'w-full !rounded-2xl !border-surface-200 dark:!border-surface-800 focus:!ring-primary/20 p-4',
        error
          ? '!border-red-500 focus:!ring-red-500/20'
          : 'focus:!border-primary',
      ]"
    />

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
import Textarea from "primevue/textarea";
const model = defineModel<string>();

interface Props {
  id?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

defineProps<Props>();

defineOptions({
  inheritAttrs: false,
});
</script>
