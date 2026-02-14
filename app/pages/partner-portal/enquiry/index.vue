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
      title="Intelligence"
      subtitle="Monitoring incoming tactical queries and institutional outreach parameters."
      badge="Communication Hub"
    >
      <template #title-prefix>Strategic&nbsp;</template>
    </PartnerHeader>

    <div
      class="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
    >
      <div class="relative">
        <div
          class="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"
        />
        <i
          class="pi pi-question-circle text-6xl text-emerald-500 relative z-10"
        />
      </div>
      <div class="space-y-2">
        <h2
          class="text-3xl font-black text-white uppercase tracking-tighter italic"
        >
          Enquiry <span class="text-emerald-500">Pipeline</span>
        </h2>
        <p
          class="text-[10px] font-black text-surface-500 uppercase tracking-[0.4em]"
        >
          Communication Node Offline
        </p>
      </div>
      <div
        class="max-w-md p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-xl"
      >
        <p class="text-xs text-surface-400 leading-relaxed font-medium">
          The Tactical Enquiry system is being integrated with our Global
          Response Team. Manage student questions, institutional follow-ups, and
          strategic clarifications through this prioritized communication
          pipeline.
        </p>
      </div>
    </div>
  </div>
</template>
