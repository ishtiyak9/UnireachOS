<script setup lang="ts">
definePageMeta({
  layout: "partner",
  middleware: "auth",
});
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- Strategic Header -->
    <PartnerHeader
      title="Manager"
      subtitle="Direct oversight of institutional submission workflows and document integrity."
      badge="Submission Hub"
    >
      <template #title-prefix>Application&nbsp;</template>
    </PartnerHeader>

    <div
      class="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
    >
      <div class="relative">
        <div
          class="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"
        />
        <i class="pi pi-file-edit text-6xl text-emerald-500 relative z-10" />
      </div>
      <div class="space-y-2">
        <h2
          class="text-3xl font-black text-white uppercase tracking-tighter italic"
        >
          Workflow <span class="text-emerald-500">Architecture</span>
        </h2>
        <p
          class="text-[10px] font-black text-surface-500 uppercase tracking-[0.4em]"
        >
          Submission Engine Syncing
        </p>
      </div>
      <div
        class="max-w-md p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-xl"
      >
        <p class="text-xs text-surface-400 leading-relaxed font-medium">
          The Application Management module is establishing secure links with
          university portals. You will soon be able to initiate submissions,
          track real-time progress, and manage institutional communications from
          this centralized briefcase.
        </p>
      </div>
    </div>
  </div>
</template>
