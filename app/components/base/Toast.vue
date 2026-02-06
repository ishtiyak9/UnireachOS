<template>
  <Toast
    class="unireach-toast"
    :pt="{
      root: { class: 'z-[9999]' },
    }"
  >
    <template #message="slotProps">
      <div
        class="flex items-start gap-4 p-5 rounded-4xl bg-white/80 dark:bg-surface-900/80 backdrop-blur-2xl border border-surface-200/50 dark:border-surface-800/50 shadow-2xl min-w-[320px] relative overflow-hidden group"
      >
        <!-- Severity Indicator Glow -->
        <div
          class="absolute inset-x-0 bottom-0 h-1 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100"
          :class="getGlowColor(slotProps.message.severity)"
        />

        <!-- Icon Section -->
        <div
          class="shrink-0 p-3 rounded-2xl shadow-sm"
          :class="getIconBg(slotProps.message.severity)"
        >
          <Icon
            :name="getIconName(slotProps.message.severity)"
            class="w-6 h-6"
          />
        </div>

        <!-- Content Section -->
        <div class="flex-1 pt-0.5">
          <h4
            class="font-black text-surface-900 dark:text-surface-0 leading-none mb-1 text-sm tracking-tight"
          >
            {{ slotProps.message.summary }}
          </h4>
          <p
            class="text-xs text-surface-500 dark:text-surface-400 font-medium leading-relaxed"
          >
            {{ slotProps.message.detail }}
          </p>
        </div>
      </div>
    </template>
  </Toast>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
const getIconName = (severity: string) => {
  switch (severity) {
    case "success":
      return "lucide:check-circle-2";
    case "info":
      return "lucide:info";
    case "warn":
      return "lucide:alert-triangle";
    case "error":
      return "lucide:alert-circle";
    default:
      return "lucide:bell";
  }
};

const getIconBg = (severity: string) => {
  switch (severity) {
    case "success":
      return "bg-emerald-500/10 text-emerald-500";
    case "info":
      return "bg-blue-500/10 text-blue-500";
    case "warn":
      return "bg-amber-500/10 text-amber-500";
    case "error":
      return "bg-rose-500/10 text-rose-500";
    default:
      return "bg-primary/10 text-primary";
  }
};

const getGlowColor = (severity: string) => {
  switch (severity) {
    case "success":
      return "bg-emerald-500";
    case "info":
      return "bg-blue-500";
    case "warn":
      return "bg-amber-500";
    case "error":
      return "bg-rose-500";
    default:
      return "bg-primary";
  }
};
</script>

<style>
/* Styles moved to global main.css to ensure stable PostCSS processing in Nuxt 4 */
</style>
