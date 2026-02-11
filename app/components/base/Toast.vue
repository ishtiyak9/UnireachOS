<template>
  <Toast position="top-right" />
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
</script>

<style scoped>
/* Ultra Premium Toast Styling for Zinc Dark Theme */

/* Base Toast Container */
:deep(.p-toast) {
  opacity: 1;
}

/* Toast Message Card */
:deep(.p-toast-message) {
  margin: 0 0 1rem 0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6),
    0 8px 10px -6px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(9, 9, 11, 0.95) !important;
  overflow: hidden;
  min-width: 20rem;
}

/* Status-Specific Styling with Gradient Accents */
:deep(.p-toast-message-success) {
  border-left: 4px solid #10b981;
  background: linear-gradient(
    90deg,
    rgba(16, 185, 129, 0.15) 0%,
    rgba(9, 9, 11, 0.95) 100%
  ) !important;
}

:deep(.p-toast-message-info) {
  border-left: 4px solid #3b82f6;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(9, 9, 11, 0.95) 100%
  ) !important;
}

:deep(.p-toast-message-warn) {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(
    90deg,
    rgba(245, 158, 11, 0.15) 0%,
    rgba(9, 9, 11, 0.95) 100%
  ) !important;
}

:deep(.p-toast-message-error) {
  border-left: 4px solid #ef4444;
  background: linear-gradient(
    90deg,
    rgba(239, 68, 68, 0.15) 0%,
    rgba(9, 9, 11, 0.95) 100%
  ) !important;
}

/* Message Content Layout */
:deep(.p-toast-message-content) {
  padding: 1rem;
  align-items: flex-start;
  gap: 0.75rem;
}

/* Icon Styling */
:deep(.p-toast-message-icon) {
  font-size: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

:deep(.p-toast-message-success .p-toast-message-icon) {
  color: #34d399;
}

:deep(.p-toast-message-info .p-toast-message-icon) {
  color: #60a5fa;
}

:deep(.p-toast-message-warn .p-toast-message-icon) {
  color: #fbbf24;
}

:deep(.p-toast-message-error .p-toast-message-icon) {
  color: #f87171;
}

/* Text Content */
:deep(.p-toast-message-text) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

:deep(.p-toast-summary) {
  font-weight: 700;
  font-size: 1rem;
  color: #ffffff;
  line-height: 1.25;
  margin: 0;
}

:deep(.p-toast-detail) {
  font-weight: 400;
  font-size: 0.875rem;
  color: #a1a1aa;
  line-height: 1.5;
  margin: 0;
}

/* Close Button */
:deep(.p-toast-close-button) {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  color: #71717a;
  background: transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
  align-self: flex-start;
}

:deep(.p-toast-close-button:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

:deep(.p-toast-close-button:focus) {
  outline: 2px solid rgba(255, 255, 255, 0.2);
  outline-offset: 2px;
}

/* Animation Enhancements */
:deep(.p-toast-message-enter-from) {
  opacity: 0;
  transform: translateY(-100%);
}

:deep(.p-toast-message-leave-to) {
  opacity: 0;
  transform: translateX(100%);
}

:deep(.p-toast-message-enter-active) {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

:deep(.p-toast-message-leave-active) {
  transition: all 0.3s ease-in;
}
</style>
