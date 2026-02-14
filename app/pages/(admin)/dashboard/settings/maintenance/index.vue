<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>

<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="MAINTENANCE"
      subtitle="System integrity controls & scheduled downtime management"
    >
      <template #title>
        MAINTENANCE <span class="text-primary-500 italic">CONTROL.</span>
      </template>
    </DashboardPageHeader>

    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-20 flex flex-col items-center justify-center text-center backdrop-blur-xl"
    >
      <div
        class="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6"
      >
        <i class="pi pi-calendar-plus text-3xl text-amber-500"></i>
      </div>
      <h2 class="text-xl font-black text-white uppercase tracking-tighter mb-2">
        Control Matrix Locked
      </h2>
      <p
        class="text-xs text-surface-500 uppercase font-bold tracking-[0.2em] max-w-md leading-relaxed"
      >
        Maintenance scheduling has been migrated to the
        <NuxtLink
          to="/dashboard/settings"
          class="text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/30"
          >System Configuration</NuxtLink
        >
        module for centralized operational control.
      </p>
    </div>
  </div>
</template>
