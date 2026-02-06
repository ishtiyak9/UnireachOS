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

    <div class="file-upload-wrapper">
      <FileUpload
        :id="id"
        v-bind="$attrs"
        mode="advanced"
        :multiple="true"
        accept="image/*,application/pdf"
        :max-file-size="10000000"
        class="w-full"
        :pt="{
          root: {
            class:
              '!rounded-[2rem] !border-2 !border-dashed !border-surface-200 dark:!border-surface-800 !bg-surface-50/30 dark:!bg-surface-900/30 overflow-hidden',
          },
          header: {
            class: '!bg-transparent !border-none !p-6',
          },
          content: {
            class: '!bg-transparent !border-none !p-6',
          },
        }"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-10 gap-4">
            <div class="p-4 rounded-full bg-primary/10 text-primary">
              <Icon name="lucide:cloud-upload" class="w-10 h-10" />
            </div>
            <div class="text-center">
              <p class="font-bold text-surface-900 dark:text-surface-0">
                Drag and drop files here to upload
              </p>
              <p class="text-sm text-surface-500 mt-1">
                PDF, JPG, PNG (Max 10MB per file)
              </p>
            </div>
          </div>
        </template>

        <template
          v-for="slotName in Object.keys($slots)"
          #[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </FileUpload>
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
import FileUpload from "primevue/fileupload";
// Base FileUpload wrapper for PrimeVue FileUpload
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

<style>
/* Custom overrides for FileUpload buttons */
.file-upload-wrapper .p-fileupload-choose {
  @apply !rounded-xl !bg-primary !border-none transition-transform active:scale-95;
}

.file-upload-wrapper .p-fileupload-upload-button,
.file-upload-wrapper .p-fileupload-cancel-button {
  @apply !rounded-xl !bg-surface-200 dark:!bg-surface-800 !border-none !text-surface-700 dark:!text-surface-300;
}
</style>
