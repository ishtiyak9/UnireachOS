<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
  badge?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-2">
      <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span
        class="text-[10px] font-black text-emerald-500/80 uppercase tracking-[0.4em]"
      >
        {{ props.badge }}
      </span>
    </div>
    <h1
      class="text-3xl font-black text-white uppercase tracking-tighter italic"
    >
      <slot name="title-prefix" />
      <span
        class="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8"
        >{{ props.title }}</span
      >
      <slot name="title-suffix" />
    </h1>
    <p
      class="text-[11px] font-bold text-surface-500 uppercase tracking-[0.3em] mt-3"
    >
      {{ props.subtitle }}
    </p>
  </div>
</template>
