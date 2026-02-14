<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  badge?: string;
}>();
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <!-- Tactical Branding & Title -->
    <div class="space-y-1">
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">
          <slot name="title">{{ title }}</slot>
        </h1>
        <span
          v-if="badge"
          class="px-2.5 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-lg"
        >
          {{ badge }}
        </span>
      </div>
      <p
        v-if="subtitle"
        class="text-[10px] text-surface-500 font-bold uppercase tracking-[0.3em]"
      >
        {{ subtitle }}
      </p>
    </div>

    <!-- Interface Actions -->
    <div v-if="$slots.actions" class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-family: "Outfit", "Inter", sans-serif;
}
</style>
