<template>
  <Message
    v-bind="$attrs"
    :severity="severity"
    :closable="closable"
    class="unireach-message"
  >
    <template #messageicon>
      <div
        class="mr-3 p-1.5 rounded-lg bg-surface-0/20 dark:bg-surface-950/20 shrink-0"
      >
        <Icon :name="getIconName" class="w-5 h-5" />
      </div>
    </template>
    <div class="flex flex-col gap-1">
      <span
        v-if="title"
        class="font-bold text-sm tracking-tight leading-none"
        >{{ title }}</span
      >
      <div class="text-xs opacity-90 leading-normal">
        <slot />
      </div>
    </div>
  </Message>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Message from "primevue/message";

interface Props {
  severity?: "success" | "info" | "warn" | "error" | "secondary" | "contrast";
  title?: string;
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  severity: "info",
  closable: true,
});

const getIconName = computed(() => {
  switch (props.severity) {
    case "success":
      return "lucide:check-circle-2";
    case "error":
      return "lucide:alert-circle";
    case "warn":
      return "lucide:alert-triangle";
    case "info":
      return "lucide:info";
    case "secondary":
      return "lucide:bell";
    case "contrast":
      return "lucide:shield-check";
    default:
      return "lucide:info";
  }
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.unireach-message {
  border-radius: 1rem !important;
  border: 0 !important;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  padding: 1rem !important;
}

/* Success Styling */
.unireach-message[data-p-severity="success"] {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #047857 !important;
  border: 1px solid rgba(16, 185, 129, 0.2) !important;
}

:deep(.dark) .unireach-message[data-p-severity="success"] {
  background: rgba(6, 78, 59, 0.3) !important;
  color: #34d399 !important;
}

/* Info Styling */
.unireach-message[data-p-severity="info"] {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #1d4ed8 !important;
  border: 1px solid rgba(59, 130, 246, 0.2) !important;
}

:deep(.dark) .unireach-message[data-p-severity="info"] {
  background: rgba(30, 58, 138, 0.3) !important;
  color: #60a5fa !important;
}

/* Warn Styling */
.unireach-message[data-p-severity="warn"] {
  background: rgba(245, 158, 11, 0.1) !important;
  color: #b45309 !important;
  border: 1px solid rgba(245, 158, 11, 0.2) !important;
}

/* Error Styling */
.unireach-message[data-p-severity="error"] {
  background: rgba(244, 63, 94, 0.1) !important;
  color: #be123c !important;
  border: 1px solid rgba(244, 63, 94, 0.2) !important;
}

/* Contrast Styling */
.unireach-message[data-p-severity="contrast"] {
  background: #111827 !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
</style>
