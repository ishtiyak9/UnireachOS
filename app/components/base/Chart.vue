<template>
  <div
    class="base-chart-wrapper bg-white/50 dark:bg-surface-900/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-surface-200/50 dark:border-surface-800/50 shadow-xl transition-all hover:shadow-2xl hover:shadow-primary/5"
  >
    <div
      v-if="title || $slots.header"
      class="flex items-center justify-between mb-8"
    >
      <div class="space-y-1">
        <h3
          v-if="title"
          class="text-xl font-bold text-surface-900 dark:text-surface-0 flex items-center gap-3"
        >
          <div v-if="icon" class="p-2 rounded-xl bg-primary/10">
            <Icon :name="icon" class="text-primary w-5 h-5" />
          </div>
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-xs text-surface-500 font-medium ml-12">
          {{ subtitle }}
        </p>
      </div>
      <slot name="header-right" />
    </div>

    <div class="chart-container relative" :style="{ height: height }">
      <Chart
        type="line"
        v-bind="$attrs"
        :data="chartData"
        :options="computedOptions"
        class="w-full h-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Chart from "primevue/chart";

interface Props {
  title?: string;
  subtitle?: string;
  icon?: string;
  height?: string;
  data: any;
  options?: any;
}

const props = withDefaults(defineProps<Props>(), {
  height: "350px",
  icon: "lucide:bar-chart-3",
});

const chartData = computed(() => props.data);

const computedOptions = computed(() => {
  const defaultOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: "#64748b", // surface-500
          usePointStyle: true,
          font: {
            size: 11,
            weight: "600",
            family: "Inter, sans-serif",
          },
        },
        position: "bottom",
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // surface-900
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8", // surface-400
          font: { size: 11, weight: "500" },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: "#94a3b8", // surface-400
          font: { size: 11, weight: "500" },
        },
        grid: {
          color: "rgba(226, 232, 240, 0.5)", // surface-200
          drawBorder: false,
        },
      },
    },
  };

  // Merge custom options if provided
  return { ...defaultOptions, ...props.options };
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.chart-container canvas {
  @apply !w-full !h-full;
}
</style>
