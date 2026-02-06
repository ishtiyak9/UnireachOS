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

    <MultiSelect
      :id="id"
      v-model="model"
      v-bind="$attrs"
      class="w-full !rounded-xl !border-surface-200 dark:!border-surface-800 focus:!ring-primary/20"
      :pt="{
        root: {
          class: error
            ? '!border-red-500 focus:!ring-red-500/20'
            : 'focus:!border-primary',
        },
      }"
    >
      <template v-for="slotName in Object.keys($slots)" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </MultiSelect>

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
import MultiSelect from "primevue/multiselect";
const model = defineModel<any[]>();

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
