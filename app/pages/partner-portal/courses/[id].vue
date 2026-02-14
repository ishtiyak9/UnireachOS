<script setup lang="ts">
definePageMeta({
  layout: "partner",
  middleware: ["auth"],
});

const route = useRoute();
const programId = computed(() => route.params.id as string);
const isApplyModalVisible = ref(false);
const selectedProgram = ref<any>(null);

const handleApply = (program: any) => {
  selectedProgram.value = program;
  isApplyModalVisible.value = true;
};
</script>

<template>
  <div class="max-w-[1400px] mx-auto px-4 py-8 space-y-8 pb-32">
    <!-- Breadcrumbs -->
    <div
      class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-surface-500"
    >
      <NuxtLink
        to="/partner-portal/courses-finder"
        class="hover:text-primary-500 transition-colors"
        >Navigator</NuxtLink
      >
      <i class="pi pi-chevron-right text-[8px]" />
      <span class="text-surface-300">Program Deep Dive</span>
    </div>

    <DiscoveryProgramDetailsShell
      :program-id="programId"
      mode="partner"
      @apply="handleApply"
    />

    <!-- Recruitment Flow Activation -->
    <ApplicationsPartnerApplyModal
      v-if="selectedProgram"
      v-model:visible="isApplyModalVisible"
      :course="selectedProgram"
    />
  </div>
</template>
