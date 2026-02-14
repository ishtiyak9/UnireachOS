<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const handleApply = (course: any) => {
  // Admin navigation to provision or application creation
  // For now, mirroring the Discovery behavior with customized admin navigation
  navigateTo(`/dashboard/applications/create?courseId=${course.id}`);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Premium Header -->
    <DashboardPageHeader
      title="NEURAL"
      subtitle="Advanced Program Recommendation Engine & Discovery Matrix"
    >
      <template #title>
        NEURAL <span class="text-primary-500 italic">DISCOVERY.</span>
      </template>

      <template #actions>
        <DashboardIntelligenceExport
          :data="[]"
          :columns="[]"
          file-name="neural-discovery-export"
          label="Export Intelligence"
        />
      </template>
    </DashboardPageHeader>

    <!-- Discovery Component Integration -->
    <div class="px-2">
      <DiscoveryProgramDiscovery
        mode="discovery"
        @apply="handleApply"
        :show-title="false"
      />
    </div>
  </div>
</template>

<style scoped>
/* Neural Aesthetics preserved via global styles and component specific pt */
</style>
