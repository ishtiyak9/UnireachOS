<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const route = useRoute();
const programId = computed(() => route.params.id as string);

const handleApply = (program: any) => {
  navigateTo(`/dashboard/applications/create?courseId=${program.id}`);
};
</script>

<template>
  <div class="space-y-6 pb-20">
    <DashboardPageHeader
      title="ASSET"
      subtitle="Granular Academic Intelligence & Operational Metadata"
    >
      <template #title>
        ASSET <span class="text-primary-500 italic">INTELLIGENCE.</span>
      </template>

      <template #actions>
        <NuxtLink
          :to="`/dashboard/inventory/courses/provision?id=${programId}`"
        >
          <Button
            label="Pulse Edit"
            icon="pi pi-pencil"
            class="p-button-primary! h-10! rounded-xl! font-black! text-[9px]! uppercase! tracking-widest! px-4!"
          />
        </NuxtLink>
      </template>
    </DashboardPageHeader>

    <DiscoveryProgramDetailsShell
      :program-id="programId"
      mode="admin"
      @apply="handleApply"
    />
  </div>
</template>
