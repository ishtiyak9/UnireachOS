<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  badge?: string;
}>();
</script>

<template>
  <div
    class="relative flex flex-col md:flex-row md:items-end justify-between gap-4"
  >
    <!-- Title & Subtitle -->
    <div class="space-y-1">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
          {{ title }}
        </h1>
        <span
          v-if="badge"
          class="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full"
        >
          {{ badge }}
        </span>
      </div>
      <p v-if="subtitle" class="text-surface-400 text-sm font-medium">
        {{ subtitle }}
      </p>
    </div>

    <!-- Actions Slot -->
    <div v-if="$slots.actions" class="flex items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>
