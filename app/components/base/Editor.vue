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

    <div class="editor-wrapper" :class="[error ? 'editor-error' : '']">
      <Editor :id="id" v-model="model" v-bind="$attrs" class="w-full">
        <template
          v-for="slotName in Object.keys($slots).filter((s) => s !== 'default')"
          :key="slotName"
          #[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps" />
        </template>
        <slot />
      </Editor>
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
import Editor from "primevue/editor";
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

<style scoped>
@reference "../../assets/css/main.css";

/* Custom styling for Quill to match UniReach's theme */
.editor-wrapper .p-editor-container {
  @apply rounded-2xl! overflow-hidden border-surface-200 dark:border-surface-800 transition-colors duration-200;
}

.editor-wrapper .p-editor-toolbar {
  @apply bg-surface-50! dark:bg-surface-900/50! border-b! border-surface-200 dark:border-surface-800 backdrop-blur-sm;
}

.editor-wrapper .p-editor-content {
  @apply bg-white! dark:bg-surface-900/50! min-h-[150px];
}

.editor-error .p-editor-container {
  @apply border-red-500!;
}

.editor-wrapper .ql-container {
  @apply border-none! text-surface-700 dark:text-surface-300;
}

.editor-wrapper .ql-editor {
  @apply min-h-[150px] p-4 font-sans text-base leading-relaxed;
}

.editor-wrapper .ql-snow .ql-stroke {
  @apply stroke-surface-500! dark:stroke-surface-400!;
}

.editor-wrapper .ql-snow .ql-fill {
  @apply fill-surface-500! dark:fill-surface-400!;
}

.editor-wrapper .ql-picker {
  @apply text-surface-600! dark:text-surface-400!;
}

.editor-wrapper .ql-picker-options {
  @apply bg-surface-0! dark:bg-surface-900! border-surface-200! dark:border-surface-800! rounded-xl! shadow-xl!;
}
</style>
