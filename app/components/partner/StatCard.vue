<script setup lang="ts">
interface Props {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  color?: "emerald" | "blue" | "purple";
}

const props = withDefaults(defineProps<Props>(), {
  trend: "neutral",
  color: "emerald",
});
</script>

<template>
  <div
    class="group relative p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden"
  >
    <!-- Hover Gradient -->
    <div
      class="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
    />

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-4">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
          :class="[
            props.color === 'emerald'
              ? 'bg-emerald-500/10 text-emerald-500'
              : props.color === 'blue'
              ? 'bg-blue-500/10 text-blue-500'
              : 'bg-purple-500/10 text-purple-500',
          ]"
        >
          <i :class="[props.icon, 'text-lg']" />
        </div>
        <div
          v-if="props.change"
          class="text-[9px] font-black px-2 py-1 rounded-md"
          :class="[
            props.trend === 'up'
              ? 'text-emerald-500 bg-emerald-500/10'
              : 'text-surface-500 bg-white/5',
          ]"
        >
          {{ props.change }}
        </div>
      </div>

      <h3
        class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1 group-hover:text-emerald-400 transition-colors"
      >
        {{ props.label }}
      </h3>
      <p class="text-2xl font-black text-white tracking-tight">
        {{ props.value }}
      </p>
    </div>
  </div>
</template>
