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
      title="Desk"
      subtitle="Priority resolution channel for operational obstacles and strategic support."
      badge="Strategic Hotline"
    >
      <template #title-prefix>Support&nbsp;</template>
    </PartnerHeader>

    <div
      class="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
    >
      <div class="relative">
        <div
          class="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"
        />
        <i class="pi pi-headset text-6xl text-emerald-500 relative z-10" />
      </div>
      <div class="space-y-2">
        <h2
          class="text-3xl font-black text-white uppercase tracking-tighter italic"
        >
          Operational <span class="text-emerald-500">Stability</span>
        </h2>
        <p
          class="text-[10px] font-black text-surface-500 uppercase tracking-[0.4em]"
        >
          Support Node Synchronizing
        </p>
      </div>
      <div
        class="max-w-md p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-xl"
      >
        <p class="text-xs text-surface-400 leading-relaxed font-medium">
          Encountering a tactical obstacle? Our institutional support team is
          ready to assist. Submit a priority ticket or access our global
          knowledge base for rapid resolution and operational stability.
        </p>
      </div>
    </div>
  </div>
</template>
