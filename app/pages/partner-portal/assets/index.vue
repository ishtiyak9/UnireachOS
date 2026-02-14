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
      title="Toolkit"
      subtitle="Accessing the global marketing repository for institutional brand assets."
      badge="Asset Distribution"
    >
      <template #title-prefix>Marketing&nbsp;</template>
    </PartnerHeader>

    <div
      class="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
    >
      <div class="relative">
        <div
          class="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"
        />
        <i class="pi pi-megaphone text-6xl text-emerald-500 relative z-10" />
      </div>
      <div class="space-y-2">
        <h2
          class="text-3xl font-black text-white uppercase tracking-tighter italic"
        >
          Brand <span class="text-emerald-500">Acceleration</span>
        </h2>
        <p
          class="text-[10px] font-black text-surface-500 uppercase tracking-[0.4em]"
        >
          Strategic Asset Vault Initializing
        </p>
      </div>
      <div
        class="max-w-md p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-xl"
      >
        <p class="text-xs text-surface-400 leading-relaxed font-medium">
          Access branded templates, institutional brochures, and tactical
          marketing guidelines. Your strategic toolkit is being updated with the
          latest recruitment materials to accelerate your market presence.
        </p>
      </div>
    </div>
  </div>
</template>
