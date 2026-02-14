<script setup lang="ts">
import { useToast } from "primevue/usetoast";

const route = useRoute();
const id = route.params.id as string;
const toast = useToast();

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Partner Intelligence | UniReach OS",
});

// Partner State
const selectedPartner = ref<any>(null);
const activeTab = ref(0);
const savingPartner = ref(false);

// Load Partner Data
const {
  data: partner,
  pending: loadingPartner,
  refresh: refreshPartner,
} = useFetch(`/api/admin/users/${id}`);

watch(
  partner,
  (newVal) => {
    if (newVal) {
      selectedPartner.value = JSON.parse(JSON.stringify(newVal));
    }
  },
  { immediate: true }
);

// Performance Intel
const { data: agentStats, pending: loadingStats } = useFetch(
  `/api/admin/users/${id}/agent-stats`
);

const savePartnerProfile = async () => {
  if (!selectedPartner.value) return;
  savingPartner.value = true;
  try {
    await $fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: { agentProfile: selectedPartner.value.agentProfile },
    });
    toast.add({
      severity: "success",
      summary: "Strategic Update",
      detail: "Agent credentials and nodes synchronized.",
    });
    refreshPartner();
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Sync Failure",
      detail: e.message,
    });
  } finally {
    savingPartner.value = false;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING":
    case "PENDING_VERIFICATION":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "SUSPENDED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "INACTIVE":
    case "DEACTIVATED":
      return "bg-surface-500/10 text-surface-400 border-surface-500/20";
    default:
      return "bg-surface-500/10 text-surface-400 border-surface-500/20";
  }
};
</script>

<template>
  <div class="p-6 space-y-8 pb-32">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center gap-4">
      <Button
        icon="pi pi-arrow-left"
        text
        severity="secondary"
        @click="navigateTo('/dashboard/user/partners')"
      />
      <div class="h-8 w-px bg-white/5" />
      <div>
        <h1
          class="text-xl font-black text-white tracking-tight uppercase italic flex items-center gap-3"
        >
          Partner Intelligence
          <span
            v-if="partner"
            :class="[
              'px-2 py-0.5 rounded text-[9px] border',
              getStatusBadge(partner.status),
            ]"
          >
            {{ partner.status }}
          </span>
        </h1>
        <p
          class="text-[10px] text-surface-500 font-bold uppercase tracking-widest"
        >
          Institutional Node ID: <span class="font-mono">{{ id }}</span>
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loadingPartner"
      class="h-[60vh] flex flex-col items-center justify-center space-y-4"
    >
      <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
      <p
        class="text-[10px] font-black text-surface-500 uppercase tracking-widest animate-pulse"
      >
        Establishing Neural Link...
      </p>
    </div>

    <div v-else-if="selectedPartner" class="max-w-6xl mx-auto space-y-8">
      <!-- Quick Info Bar -->
      <div
        class="flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-xl gap-6"
      >
        <div class="flex items-center gap-5 w-full">
          <Avatar
            :label="selectedPartner.firstName?.[0]"
            shape="circle"
            size="large"
            class="bg-primary-500/20 text-primary-400 border border-primary-500/30 font-black text-xl"
          />
          <div class="flex flex-col">
            <h2
              class="text-2xl font-black text-white tracking-tighter italic uppercase"
            >
              {{ selectedPartner.firstName }}
              {{
                selectedPartner.lastName === "." ? "" : selectedPartner.lastName
              }}
            </h2>
            <p class="text-xs text-surface-400 font-medium">
              {{ selectedPartner.email }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <Button
            label="SYNC REGISTRY"
            icon="pi pi-sync"
            class="bg-primary-500! border-0! text-black! font-black! tracking-widest! text-[10px]! px-6! py-3! rounded-xl!"
            :loading="savingPartner"
            @click="savePartnerProfile"
          />
        </div>
      </div>

      <Tabs v-model:value="activeTab">
        <TabList
          class="bg-white/1 border-white/5 rounded-2xl p-1.5 inline-flex"
        >
          <Tab
            :value="0"
            class="flex items-center gap-2 px-8 py-3 text-[10px] font-black uppercase tracking-widest!"
          >
            <i class="pi pi-building text-xs" />
            Executive Profile
          </Tab>
          <Tab
            :value="1"
            class="flex items-center gap-2 px-8 py-3 text-[10px] font-black uppercase tracking-widest!"
          >
            <i class="pi pi-chart-line text-xs" />
            Operational Pipeline
          </Tab>
        </TabList>

        <TabPanels class="mt-8">
          <!-- PROFILE PANEL -->
          <TabPanel :value="0" class="flex flex-col gap-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Left: Agency Details -->
              <div class="lg:col-span-2 space-y-8">
                <!-- Registration Cluster -->
                <section
                  class="p-8 rounded-3xl border border-white/5 bg-white/1 space-y-6"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center"
                    >
                      <i class="pi pi-building text-primary-500 text-sm" />
                    </div>
                    <h3
                      class="text-sm font-black text-white uppercase tracking-widest italic"
                    >
                      Agency Registration
                    </h3>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col gap-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
                        >Agency Name</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.agencyName"
                        class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                      />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
                        >Registration/License No.</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.licenseNo"
                        class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                      />
                    </div>
                    <div class="flex flex-col gap-2 md:col-span-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
                        >Registered HQ Address</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.companyAddress"
                        class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                      />
                    </div>
                  </div>
                </section>

                <!-- Financial Node -->
                <section
                  class="p-8 rounded-3xl border border-white/5 bg-white/1 space-y-6"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"
                    >
                      <i class="pi pi-wallet text-emerald-500 text-sm" />
                    </div>
                    <h3
                      class="text-sm font-black text-white uppercase tracking-widest italic"
                    >
                      Financial Payout Node
                    </h3>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col gap-2 md:col-span-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
                        >Beneficiary Name</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.beneficiaryName"
                        class="w-full bg-white/1! border-white/10!"
                      />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
                        >Bank Name</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.bankName"
                        class="w-full bg-white/1! border-white/10!"
                      />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
                        >Swift/BIC Code</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.bankSwiftCode"
                        class="w-full bg-white/1! border-white/10!"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <!-- Right: Contact & Identity -->
              <div class="space-y-8">
                <section
                  class="p-8 rounded-3xl border border-white/5 bg-white/1 space-y-6"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"
                    >
                      <i class="pi pi-id-card text-blue-500 text-sm" />
                    </div>
                    <h3
                      class="text-sm font-black text-white uppercase tracking-widest italic"
                    >
                      Identity Hub
                    </h3>
                  </div>
                  <div class="space-y-4">
                    <div class="flex flex-col gap-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase"
                        >Registered / Primary Email</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.primaryEmail"
                        class="w-full bg-white/1! border-white/10!"
                      />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase"
                        >Direct Phone</label
                      >
                      <InputText
                        v-model="selectedPartner.agentProfile.primaryPhone"
                        class="w-full bg-white/1! border-white/10!"
                      />
                    </div>
                    <div
                      class="flex flex-col gap-2 border-t border-white/5 pt-4"
                    >
                      <label
                        class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                        >Network Tier</label
                      >
                      <div class="flex items-center gap-2">
                        <span
                          class="text-xs font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10 uppercase italic"
                          >Institutional Partner</span
                        >
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Security Context -->
                <div
                  class="p-6 rounded-3xl border border-rose-500/10 bg-rose-500/5 space-y-4"
                >
                  <div class="flex items-center gap-2 text-rose-400">
                    <i class="pi pi-shield text-xs" />
                    <span
                      class="text-[9px] font-black uppercase tracking-widest italic"
                      >Security Footprint</span
                    >
                  </div>
                  <p
                    class="text-[9px] text-surface-500 leading-relaxed font-bold uppercase"
                  >
                    This agency node is currently processing global admissions.
                    All registry synchronization is auditable via SuperAdmin
                    logs.
                  </p>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- PIPELINE PANEL -->
          <TabPanel :value="1" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <NeuralStatCard
                label="Total Applicants"
                :value="agentStats?.totalApplicants || 0"
                icon="pi pi-users"
                color="text-purple-400"
                :loading="loadingStats"
              />
              <NeuralStatCard
                label="Active Workflows"
                :value="agentStats?.activeApplications || 0"
                icon="pi pi-file-edit"
                color="text-emerald-400"
                :loading="loadingStats"
              />
              <NeuralStatCard
                label="Conversion Index"
                :value="`${agentStats?.efficiencyRate || 0}%`"
                icon="pi pi-chart-line"
                color="text-blue-400"
                :loading="loadingStats"
              />
              <NeuralStatCard
                label="Network State"
                value="HEALTHY"
                icon="pi pi-server"
                color="text-emerald-500"
                :loading="loadingStats"
              />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Admissions Activity -->
              <div
                class="lg:col-span-2 p-8 rounded-3xl border border-white/5 bg-white/1"
              >
                <div class="flex items-center justify-between mb-8">
                  <h3
                    class="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-3"
                  >
                    <div
                      class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                    />
                    Admissions Pipeline
                  </h3>
                  <span
                    class="text-[9px] font-black text-surface-500 uppercase tracking-widest italic"
                    >Real-time Stream</span
                  >
                </div>

                <div class="space-y-3">
                  <div
                    v-for="applicant in agentStats?.recentApplicants"
                    :key="applicant.id"
                    class="group flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  >
                    <div class="flex items-center gap-4">
                      <Avatar
                        :label="applicant.firstName[0]"
                        shape="circle"
                        class="bg-surface-800 text-surface-400 text-xs font-bold"
                      />
                      <div>
                        <p
                          class="text-xs font-bold text-white group-hover:text-primary-400 transition-colors"
                        >
                          {{ applicant.firstName }} {{ applicant.lastName }}
                        </p>
                        <p
                          class="text-[9px] text-surface-600 font-black uppercase tracking-widest"
                        >
                          Profile Identity Registered
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p
                        class="text-[9px] font-mono text-surface-500 uppercase"
                      >
                        {{ new Date(applicant.createdAt).toLocaleDateString() }}
                      </p>
                      <p
                        class="text-[8px] font-black text-emerald-500/50 uppercase tracking-tighter italic"
                      >
                        ID: {{ applicant.id }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="
                      !agentStats?.recentApplicants?.length && !loadingStats
                    "
                    class="py-20 text-center flex flex-col items-center justify-center opacity-30 gap-4"
                  >
                    <i class="pi pi-inbox text-4xl" />
                    <p
                      class="text-xs font-black uppercase tracking-widest italic font-mono"
                    >
                      No active nodes in stream
                    </p>
                  </div>
                </div>
              </div>

              <!-- Performance Intelligence -->
              <div
                class="p-8 rounded-3xl border border-white/5 bg-white/1 space-y-8"
              >
                <h3
                  class="text-sm font-black text-white uppercase tracking-widest italic"
                >
                  Operational Intel
                </h3>

                <div class="space-y-6">
                  <div
                    class="p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10 space-y-1"
                  >
                    <p
                      class="text-[10px] font-black text-primary-400 uppercase tracking-widest italic"
                    >
                      Efficiency Rating
                    </p>
                    <div class="flex items-center justify-between text-white">
                      <span class="text-2xl font-black italic tracking-tighter"
                        >{{ agentStats?.efficiencyRate || 0 }}%</span
                      >
                      <i class="pi pi-bolt opacity-30" />
                    </div>
                  </div>

                  <div class="space-y-4">
                    <p
                      class="text-[9px] font-black text-surface-500 uppercase tracking-widest italic"
                    >
                      Node Status Registry
                    </p>
                    <div class="space-y-2">
                      <div
                        class="flex items-center justify-between text-[10px] font-bold"
                      >
                        <span class="text-surface-400">Server Status</span>
                        <span class="text-emerald-500">OPTIMAL</span>
                      </div>
                      <div
                        class="flex items-center justify-between text-[10px] font-bold"
                      >
                        <span class="text-surface-400">Neural Sync</span>
                        <span class="text-blue-500">ACTIVE</span>
                      </div>
                      <div
                        class="flex items-center justify-between text-[10px] font-bold"
                      >
                        <span class="text-surface-400">Data Integrity</span>
                        <span class="text-purple-500">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) {
  transition: all 0.3s ease;
}
:deep(.p-inputtext:focus) {
  background: rgba(var(--primary-rgb), 0.05) !important;
  border-color: rgba(var(--primary-rgb), 0.3) !important;
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.1);
}
</style>
