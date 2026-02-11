<script setup lang="ts">
interface Props {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  color?: string; // e.g. "text-blue-400"
  bg?: string; // e.g. "bg-blue-500/10"
  border?: string; // e.g. "border-blue-500/20"
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  trend: "neutral",
  color: "text-primary-400",
  bg: "bg-surface-800/50",
  border: "border-white/5",
  loading: false,
});

const trendIcon = computed(() => {
  if (props.trend === "up") return "pi pi-arrow-up";
  if (props.trend === "down") return "pi pi-arrow-down";
  return "pi pi-minus";
});

const trendColor = computed(() => {
  if (props.trend === "up") return "text-emerald-400";
  if (props.trend === "down") return "text-rose-400";
  return "text-surface-400";
});
</script>

<template>
  <div
    class="card p-4 rounded-2xl border backdrop-blur-md flex items-center gap-4 transition-all hover:translate-y-[-2px]"
    :class="[bg, border]"
  >
    <!-- Icon Box -->
    <div
      class="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 shrink-0"
    >
      <i :class="[icon, color, 'text-lg']" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p
        class="text-[10px] uppercase font-black tracking-widest text-surface-400 mb-0.5 truncate"
      >
        {{ label }}
      </p>

      <div v-if="loading">
        <Skeleton width="4rem" height="1.5rem" />
      </div>
      <div v-else class="flex items-end justify-between gap-2">
        <p class="text-2xl font-black text-white leading-none truncate">
          {{ value }}
        </p>

        <!-- Trend Indicator -->
        <div
          v-if="change"
          class="flex items-center gap-1 text-xs font-bold"
          :class="trendColor"
        >
          <i :class="trendIcon" style="font-size: 0.7rem" />
          <span>{{ change }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgba(var(--p-surface-900-rgb), 0.4);
}
</style>
