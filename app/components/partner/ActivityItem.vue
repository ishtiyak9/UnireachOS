<script setup lang="ts">
interface Props {
  title: string;
  desc: string;
  time: string;
  status?: "success" | "info" | "emerald";
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="relative p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 transition-all duration-300"
  >
    <div
      class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8"
      :class="[
        props.status === 'success'
          ? 'bg-emerald-500'
          : props.status === 'info'
          ? 'bg-blue-500'
          : 'bg-emerald-600',
      ]"
    />
    <div class="flex justify-between items-start mb-2">
      <h4 class="text-[10px] font-black text-white uppercase tracking-tight">
        {{ props.title }}
      </h4>
      <span class="text-[8px] font-bold text-surface-600">{{
        props.time
      }}</span>
    </div>
    <p class="text-[10px] text-surface-400 leading-relaxed font-medium">
      {{ props.desc }}
    </p>
  </div>
</template>
