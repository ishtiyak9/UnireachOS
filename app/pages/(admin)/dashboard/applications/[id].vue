<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const id = route.params.id as string;

const {
  data: appData,
  refresh,
  pending,
} = await useFetch(`/api/admin/applications/${id}`);
const application = computed(() => appData.value?.application);

const tabs = [
  { label: "Tactical Overview", icon: "pi pi-chart-bar" },
  { label: "Clinical Snapshots", icon: "pi pi-database" },
  { label: "Document Vault", icon: "pi pi-file-pdf" },
  { label: "Status Audit", icon: "pi pi-history" },
];
const activeTab = ref(0);
</script>

<template>
  <div
    v-if="application"
    class="p-6 space-y-6 bg-surface-950 min-h-screen font-[Outfit]"
  >
    <!-- Breadcrumb / Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div class="space-y-1">
        <div
          class="flex items-center gap-3 text-surface-500 text-xs font-mono mb-2"
        >
          <NuxtLink
            to="/(admin)/dashboard/applications"
            class="hover:text-blue-400 transition-colors uppercase"
            >REGISTRY</NuxtLink
          >
          <i class="pi pi-chevron-right text-[8px]"></i>
          <span class="text-blue-400 uppercase tracking-widest font-bold">{{
            application.code
          }}</span>
        </div>
        <h1 class="text-3xl font-bold text-surface-0 tracking-tight">
          {{ application.applicant.firstName }}
          {{ application.applicant.lastName }}
        </h1>
        <p class="text-surface-400 text-sm">
          Application for {{ application.course.name }} @
          {{ application.course.university.name }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <ApplicationsPriorityBadge :priority="application.priority" />
        <ApplicationsStatusBadge :status="application.status" />
      </div>
    </div>

    <!-- Core Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <!-- Left Column: Command & Communication -->
      <div class="xl:col-span-8 space-y-6">
        <!-- Status Orchestrator -->
        <ApplicationsStatusOrchestrator
          :application="application"
          @updated="refresh"
        />

        <!-- Tabbed Navigation Content -->
        <div
          class="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden min-h-[600px] flex flex-col shadow-2xl"
        >
          <div
            class="flex border-b border-surface-800 overflow-x-auto no-scrollbar"
          >
            <button
              v-for="(tab, idx) in tabs"
              :key="idx"
              @click="activeTab = idx"
              class="flex items-center gap-2 px-6 py-4 transition-all duration-300 whitespace-nowrap"
              :class="[
                activeTab === idx
                  ? 'bg-surface-800 text-blue-400 border-b-2 border-blue-500 font-bold'
                  : 'text-surface-500 hover:bg-surface-800/50 hover:text-surface-300',
              ]"
            >
              <i :class="[tab.icon, 'text-xs']"></i>
              <span class="text-[10px] uppercase tracking-widest">{{
                tab.label
              }}</span>
            </button>
          </div>

          <div class="flex-1 p-6 overflow-y-auto">
            <!-- Overview Tab -->
            <div
              v-if="activeTab === 0"
              class="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div class="space-y-6">
                <div
                  class="bg-surface-950/50 p-5 rounded-xl border border-surface-800"
                >
                  <h4
                    class="text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-4"
                  >
                    Applicant Profile
                  </h4>
                  <div class="space-y-3">
                    <div
                      class="flex justify-between border-b border-surface-800 pb-2"
                    >
                      <span class="text-xs text-surface-400">Full Name</span>
                      <span class="text-xs text-surface-100"
                        >{{ application.applicant.firstName }}
                        {{ application.applicant.lastName }}</span
                      >
                    </div>
                    <div
                      class="flex justify-between border-b border-surface-800 pb-2"
                    >
                      <span class="text-xs text-surface-400"
                        >Email Address</span
                      >
                      <span class="text-xs text-surface-100 text-blue-400">{{
                        application.applicant.email
                      }}</span>
                    </div>
                    <div
                      class="flex justify-between border-b border-surface-800 pb-2"
                    >
                      <span class="text-xs text-surface-400">Source Agent</span>
                      <span class="text-xs text-surface-100 font-bold">{{
                        application.applicant.agent?.agencyName ||
                        "Direct Applicant"
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div
                  class="bg-surface-950/50 p-5 rounded-xl border border-surface-800"
                >
                  <h4
                    class="text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-4"
                  >
                    University Details
                  </h4>
                  <div class="space-y-3">
                    <div
                      class="flex justify-between border-b border-surface-800 pb-2"
                    >
                      <span class="text-xs text-surface-400">Institution</span>
                      <span class="text-xs text-surface-100">{{
                        application.course.university.name
                      }}</span>
                    </div>
                    <div
                      class="flex justify-between border-b border-surface-800 pb-2"
                    >
                      <span class="text-xs text-surface-400">Program</span>
                      <span class="text-xs text-surface-100 text-amber-400">{{
                        application.course.name
                      }}</span>
                    </div>
                    <div
                      class="flex justify-between border-b border-surface-800 pb-2"
                    >
                      <span class="text-xs text-surface-400">Duration</span>
                      <span
                        class="text-xs text-surface-100 uppercase tracking-tighter"
                        >{{ application.course.duration }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Snapshots Tab -->
            <div
              v-if="activeTab === 1"
              class="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <ApplicationsSnapshotPreview
                title="Applicant Snapshot"
                icon="pi pi-user"
                :data="application.profileSnapshot"
              />
              <ApplicationsSnapshotPreview
                title="Course Snapshot"
                icon="pi pi-book"
                :data="application.courseSnapshot"
              />
            </div>

            <!-- Status History Tab -->
            <div v-if="activeTab === 3" class="space-y-4">
              <div
                v-for="history in application.statusHistory"
                :key="history.id"
                class="flex gap-4 p-4 rounded-xl bg-surface-950 border border-surface-800 hover:border-surface-600 transition-all border-l-4"
                :class="{ 'border-l-blue-500': true }"
              >
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <Tag
                        :value="history.fromStatus"
                        severity="secondary"
                        class="!text-[9px]"
                      />
                      <i
                        class="pi pi-arrow-right text-[10px] text-surface-600"
                      ></i>
                      <Tag
                        :value="history.toStatus"
                        severity="info"
                        class="!text-[9px]"
                      />
                    </div>
                    <span class="text-[10px] text-surface-500">{{
                      new Date(history.createdAt).toLocaleString()
                    }}</span>
                  </div>
                  <p class="text-sm text-surface-200 mt-2">
                    {{ history.reason }}
                  </p>
                  <p
                    class="text-[9px] text-surface-500 mt-2 uppercase tracking-widest"
                  >
                    Performed by: {{ history.performedBy }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Document Tab (Placeholder) -->
            <div v-if="activeTab === 2" class="p-20 text-center">
              <i class="pi pi-file-pdf text-6xl text-surface-700"></i>
              <p class="text-surface-500 mt-4">
                Document Vault Integration is active. All submitted documents
                are locked to this node.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Discussion & Activity -->
      <div class="xl:col-span-4 h-full">
        <ApplicationsThread :application-id="application.id" />
      </div>
    </div>
  </div>

  <div
    v-else-if="pending"
    class="flex items-center justify-center min-h-screen bg-surface-950"
  >
    <ProgressSpinner />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
