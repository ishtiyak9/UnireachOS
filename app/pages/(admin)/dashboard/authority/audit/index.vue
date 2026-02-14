<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { data: auditLogs, pending } = useFetch("/api/admin/audit");
</script>

<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="AUDIT"
      subtitle="Comprehensive system telemetry & operational history"
    >
      <template #title>
        AUDIT <span class="text-primary-500 italic">INTELLIGENCE.</span>
      </template>
    </DashboardPageHeader>

    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-20 flex flex-col items-center justify-center text-center backdrop-blur-xl"
    >
      <div
        class="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20 mb-6"
      >
        <i
          class="pi pi-history text-3xl text-primary-500 shadow-[0_0_20px_rgba(var(--p-primary-500-rgb),0.3)]"
        ></i>
      </div>
      <h2 class="text-xl font-black text-white uppercase tracking-tighter mb-2">
        Registry Offline
      </h2>
      <p
        class="text-xs text-surface-500 uppercase font-bold tracking-[0.2em] max-w-md leading-relaxed"
      >
        The Audit Intelligence module is currently undergoing recalibration.
        Operational logs are being indexed for real-time telemetry.
      </p>
    </div>
  </div>
</template>
