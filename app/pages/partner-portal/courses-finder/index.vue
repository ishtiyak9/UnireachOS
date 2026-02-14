<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: "partner",
  middleware: "auth",
});

const route = useRoute();
const selectedCourse = ref(null);
const showApplyModal = ref(false);

const openApplyModal = (course: any) => {
  selectedCourse.value = course;
  showApplyModal.value = true;
};

const handleSuccess = (app: any) => {
  navigateTo(`/partner-portal/application`);
};

// 4. Guided Context Extraction
const contextualApplicantId = computed(() => route.query.applicantId as string);

// Fetch Applicant Profile if context exists
const { data: applicantRes } = await useFetch(() =>
  contextualApplicantId.value
    ? `/api/partners/students/${contextualApplicantId.value}`
    : null
);
const applicant = computed(
  () => (applicantRes.value as any)?.data?.applicantProfile
);

// Fetch Support Data for filter mapping
const { data: levelsRes } = await useFetch("/api/public/program-levels");
const { data: areasRes } = await useFetch("/api/public/study-areas");

const initialFilters = computed(() => {
  if (!applicant.value) return {};

  const levels = (levelsRes.value as any)?.data || [];
  const areas = (areasRes.value as any)?.data || [];

  const level = levels.find(
    (l: any) =>
      l.name
        .toLowerCase()
        .includes(applicant.value.studyLevel?.toLowerCase()) ||
      l.code.toLowerCase().includes(applicant.value.studyLevel?.toLowerCase())
  );

  const area = areas.find((a: any) =>
    a.name.toLowerCase().includes(applicant.value.fieldOfStudy?.toLowerCase())
  );

  return {
    country: applicant.value.preferredCountry || "",
    levelId: level?.id || "",
    studyAreaId: area?.id || "",
    search: applicant.value.fieldOfStudy || "",
  };
});
</script>

<template>
  <div class="space-y-8 pb-20 font-[Outfit]">
    <!-- Strategic Header -->
    <PartnerHeader
      title="Navigator"
      subtitle="Accessing the global educational repository to find optimal student trajectories."
      badge="Neural Recommendations"
    >
      <template #title-prefix>Program&nbsp;</template>
    </PartnerHeader>

    <!-- Contextual Alert if applying for specific student -->
    <div
      v-if="contextualApplicantId"
      class="mx-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-info-circle text-blue-400"></i>
        <p class="text-xs font-bold text-blue-100">
          You are searching for a program to initialize an application for a
          specific client.
        </p>
      </div>
      <Button
        label="Clear Context"
        text
        size="small"
        class="text-blue-400! text-[10px] uppercase font-black"
        @click="navigateTo('/partner-portal/courses-finder')"
      />
    </div>

    <!-- Neural Discovery Engine Integration -->
    <div class="px-4">
      <div v-if="applicant" class="mb-4 flex items-center gap-2">
        <div
          class="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
        ></div>
        <span
          class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
        >
          Calibrating recommendations for:
          <span class="text-white"
            >{{ applicant.firstName }} {{ applicant.lastName }}</span
          >
        </span>
      </div>
      <DiscoveryProgramDiscovery
        mode="discovery"
        :initial-filters="initialFilters"
        @apply="openApplyModal"
        :show-title="false"
      />
    </div>

    <!-- Application Genesis Modal -->
    <ApplicationsPartnerApplyModal
      v-model:visible="showApplyModal"
      :course="selectedCourse"
      :applicant-id="contextualApplicantId"
      @success="handleSuccess"
    />
  </div>
</template>

<style scoped>
@reference "../../../assets/css/main.css";
</style>
