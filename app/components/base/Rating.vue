<template>
  <div class="flex flex-col gap-2 w-full">
    <label
      v-if="label"
      class="text-sm font-semibold text-surface-700 dark:text-surface-300 ml-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div
      class="flex items-center gap-3 bg-surface-50 dark:bg-surface-900/50 p-3 rounded-2xl border border-surface-200/50 dark:border-surface-800/50 w-fit"
    >
      <Rating v-model="model" v-bind="$attrs" :cancel="false" class="gap-1" />
      <span
        v-if="model"
        class="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full"
      >
        {{ model }}/5
      </span>
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
import Rating from "primevue/rating";
const model = defineModel<number>();

interface Props {
  label?: string;
  error?: string;
  required?: boolean;
}

defineProps<Props>();

defineOptions({
  inheritAttrs: false,
});
</script>
