<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  loading?: boolean;
}>();
</script>

<template>
  <div
    class="group p-5 rounded-2xl bg-surface-900/40 border border-white/5 backdrop-blur-xl hover:border-white/10 transition-all"
  >
    <div
      class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-2 flex items-center gap-2"
    >
      <span
        class="w-1 h-1 rounded-full bg-surface-800 group-hover:bg-primary-500 transition-colors"
      ></span>
      {{ label }}
    </div>

    <div v-if="loading">
      <Skeleton width="60%" height="2rem" class="mb-1" />
    </div>
    <div
      v-else
      class="text-3xl font-black tracking-tight flex items-center justify-between"
      :class="color || 'text-white'"
    >
      {{ value }}
      <i
        v-if="icon"
        :class="[
          icon,
          'text-lg opacity-20 group-hover:opacity-100 transition-opacity',
        ]"
      />
    </div>
  </div>
</template>
