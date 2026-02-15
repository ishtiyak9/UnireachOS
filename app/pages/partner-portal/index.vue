<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// Explicitly define page meta
definePageMeta({
  layout: "partner",
  middleware: "auth",
});

// Access Strategic Session
const { user } = useUserSession();
const toast = useToast();

// Reactive Pipeline State
const isClientEntryOpen = ref(false);
const isSubmitting = ref(false);
const newStudent = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: Math.random().toString(36).slice(-10), // Auto-generate secure initial key
});

// Primary Intelligence Fetching
const {
  data: liveClients,
  refresh: refreshClients,
  pending,
} = useFetch("/api/partners/students");

interface Stat {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "neutral" | "down";
  icon: string;
  color: "emerald" | "blue" | "purple";
}

// Tactical Metric Interpolation
const statsData = computed<Stat[]>(() => [
  {
    label: "Total Pipeline Value",
    value: `$${((liveClients.value?.length || 0) * 4500).toLocaleString()}`, // Estimated strategic value
    change: "+12.5%",
    trend: "up",
    icon: "pi pi-chart-line",
    color: "emerald",
  },
  {
    label: "Active Student Portfolio",
    value: liveClients.value?.length || "0",
    change: "Live Tracking",
    trend: "neutral",
    icon: "pi pi-users",
    color: "blue",
  },
  {
    label: "Contribution Rewards",
    value: "$12,400",
    change: "+$1,200 this month",
    trend: "up",
    icon: "pi pi-wallet",
    color: "emerald",
  },
  {
    label: "Strategic Reach",
    value: "Global",
    change: "Active Expansion",
    trend: "up",
    icon: "pi pi-map-marker",
    color: "purple",
  },
]);

const activitiesData = ref([
  {
    id: 1,
    title: "Application Milestone",
    desc: "A milestone was reached in the student trajectory.",
    time: "Real-time",
    status: "success",
  },
  {
    id: 3,
    title: "Commission Verification",
    desc: "Performance rewards have been synchronized with the master ledger.",
    time: "Synced",
    status: "emerald",
  },
]);

// Strategic Action: Client Onboarding
const handleClientEntry = async () => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/partners/students/create", {
      method: "POST",
      body: newStudent.value,
    });

    toast.add({
      severity: "success",
      summary: "Identity Integrated",
      detail: `${newStudent.value.firstName} has been added to your strategic pipeline.`,
      life: 5000,
    });

    isClientEntryOpen.value = false;
    newStudent.value = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: Math.random().toString(36).slice(-10),
    };
    await refreshClients();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Integration Failure",
      detail: error.data?.message || "Failed to initiate student node.",
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- Corporate Header Phase -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <PartnerHeader
        title="Executive"
        :subtitle="`Welcome back, ${
          user?.profile?.firstName || 'Representative'
        }. Strategic performance is currently Optimal.`"
        badge="Operational Intelligence Active"
      >
        <template #title-prefix>Partner&nbsp;</template>
        <template #title-suffix>&nbsp;Suite</template>
      </PartnerHeader>

      <div class="flex items-center gap-3">
        <Button
          label="Secure Client Entry"
          icon="pi pi-user-plus"
          @click="isClientEntryOpen = true"
          class="bg-emerald-600! border-emerald-500! text-white! text-[10px]! font-black! uppercase! tracking-widest! px-6! py-3! rounded-xl! hover:scale-105! transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        />
        <Button
          icon="pi pi-download"
          outlined
          class="border-white/10! text-surface-400! hover:text-white! p-3! rounded-xl!"
        />
      </div>
    </div>

    <!-- Metric Architecture -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <PartnerStatCard
        v-for="stat in statsData"
        :key="stat.label"
        v-bind="stat"
      />
    </div>

    <!-- Layout Intelligence: Tactical Split -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Client Pipeline (Primary) -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between px-2">
          <h2
            class="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <span class="w-6 h-px bg-emerald-500/50" />
            High-Priority Applicant Pipeline
          </h2>
          <NuxtLink
            to="/partner-portal/applicants"
            class="text-[9px] font-black text-emerald-500 uppercase tracking-tighter hover:underline"
          >
            View Full Portfolio
          </NuxtLink>
        </div>

        <div
          class="rounded-3xl border border-white/5 bg-white/1 overflow-hidden backdrop-blur-xl"
        >
          <!-- Desktop Intelligence Table -->
          <table class="hidden md:table w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/5 bg-white/2">
                <th
                  class="px-6 py-4 text-[9px] font-black text-surface-500 uppercase tracking-widest"
                >
                  Client Identity
                </th>
                <th
                  class="px-6 py-4 text-[9px] font-black text-surface-500 uppercase tracking-widest"
                >
                  Dest. Registry
                </th>
                <th
                  class="px-6 py-4 text-[9px] font-black text-surface-500 uppercase tracking-widest"
                >
                  Operational Status
                </th>
                <th
                  class="px-6 py-4 text-[9px] font-black text-surface-500 uppercase tracking-widest text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="client in liveClients"
                :key="client.id"
                class="hover:bg-white/2 transition-colors group cursor-pointer"
              >
                <td class="px-6 py-5">
                  <div class="flex flex-col">
                    <span
                      class="text-xs font-black text-white group-hover:text-emerald-400 transition-colors"
                      >{{ client.fullName }}</span
                    >
                    <span
                      class="text-[9px] font-bold text-surface-600 uppercase tracking-tighter mt-0.5"
                      >{{ client.email }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span class="text-[10px] font-bold text-surface-400"
                      >Not Set</span
                    >
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span
                    class="inline-flex px-2 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-black text-white/80 uppercase tracking-widest"
                  >
                    {{ client.applicationStatus }}
                  </span>
                </td>
                <td class="px-6 py-5 text-right">
                  <button
                    class="text-surface-500 hover:text-white p-2 transition-all"
                    @click="
                      navigateTo(`/dashboard/user/applicants/${client.id}`)
                    "
                  >
                    <i class="pi pi-external-link text-xs" />
                  </button>
                </td>
              </tr>
              <tr v-if="!liveClients?.length && !pending">
                <td colspan="4" class="px-6 py-10 text-center">
                  <p
                    class="text-[10px] font-bold text-surface-600 uppercase tracking-widest"
                  >
                    No active clients in your current pipeline.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Mobile Tactical Cards -->
          <div class="md:hidden divide-y divide-white/5">
            <div
              v-for="client in liveClients"
              :key="client.id"
              class="p-5 flex flex-col gap-4 active:bg-white/5 transition-colors"
              @click="navigateTo(`/dashboard/user/applicants/${client.id}`)"
            >
              <div class="flex justify-between items-start">
                <div class="flex flex-col">
                  <span
                    class="text-xs font-black text-white italic capitalize"
                    >{{ client.fullName }}</span
                  >
                  <span
                    class="text-[9px] font-bold text-surface-600 uppercase tracking-wider"
                    >{{ client.email }}</span
                  >
                </div>
                <span
                  class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[7px] font-black text-white/80 uppercase tracking-widest"
                >
                  {{ client.applicationStatus }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-[8px] font-black text-surface-700 uppercase"
                    >Destination:</span
                  >
                  <span class="text-[8px] font-bold text-surface-500 uppercase"
                    >Not Set</span
                  >
                </div>
                <i class="pi pi-chevron-right text-[10px] text-surface-700" />
              </div>
            </div>
            <div
              v-if="!liveClients?.length && !pending"
              class="px-6 py-10 text-center"
            >
              <p
                class="text-[10px] font-bold text-surface-600 uppercase tracking-widest"
              >
                No active clients in your pipeline.
              </p>
            </div>
          </div>

          <div class="p-6 text-center border-t border-white/5">
            <p
              class="text-[9px] font-bold text-surface-600 uppercase tracking-[0.2em]"
            >
              Architecture showing Top 3 Priorities • Secured by UniReach
              AES-256
            </p>
          </div>
        </div>
      </div>

      <!-- Situational Feed (Secondary) -->
      <div class="space-y-6">
        <h2
          class="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 px-2"
        >
          <span class="w-6 h-px bg-emerald-500/50" />
          Strategic Intelligence
        </h2>

        <div class="space-y-4">
          <PartnerActivityItem
            v-for="act in activitiesData"
            :key="act.id"
            v-bind="act"
          />

          <!-- Quick Discovery Card -->
          <div
            class="p-8 rounded-3xl bg-linear-to-br from-emerald-600 to-emerald-800 relative overflow-hidden group shadow-2xl"
          >
            <i
              class="pi pi-search absolute -right-4 -bottom-4 text-7xl text-white/10 group-hover:scale-110 transition-transform duration-700"
            />
            <h3
              class="text-lg font-black text-white uppercase tracking-tighter leading-none mb-3"
            >
              Explore New<br />Opportunities
            </h3>
            <p
              class="text-[10px] text-emerald-100/70 font-bold uppercase tracking-widest mb-6"
            >
              Access the global course vault
            </p>
            <Button
              label="Intelligence Search"
              text
              class="p-0! text-[10px]! font-black! text-white! uppercase! tracking-widest! flex items-center gap-2 group/btn"
              :pt="{
                label: { class: 'group-hover/btn:mr-2 transition-all' },
              }"
              @click="navigateTo('/dashboard/inventory/courses')"
            >
              <template #icon>
                <i class="pi pi-arrow-right text-[10px]" />
              </template>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Client Entry Dialog: Obsidian Emerald Design -->
    <Dialog
      v-model:visible="isClientEntryOpen"
      header="Secure Client Onboarding"
      :modal="true"
      class="w-full max-w-lg mx-4"
      :pt="{
        root: {
          class:
            'bg-[#0f1715]! border border-white/10! rounded-3xl! shadow-2xl! overflow-hidden',
        },
        header: {
          class: 'bg-emerald-950/20! border-b border-white/5! px-8! py-6!',
        },
        title: {
          class:
            'text-lg! font-black! text-white! uppercase! tracking-tighter!',
        },
        content: { class: 'p-8!' },
        footer: { class: 'hidden!' },
      }"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >First Identity</label
            >
            <InputText
              v-model="newStudent.firstName"
              placeholder="e.g. Michael"
              class="w-full bg-white/2! border-white/10! text-white! text-xs! rounded-xl! px-4! py-3! focus:border-emerald-500!"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
              >Surname</label
            >
            <InputText
              v-model="newStudent.lastName"
              placeholder="e.g. Corleone"
              class="w-full bg-white/2! border-white/10! text-white! text-xs! rounded-xl! px-4! py-3! focus:border-emerald-500!"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
            >Secure Email Node</label
          >
          <InputText
            v-model="newStudent.email"
            placeholder="michael.c@strategic.com"
            class="w-full bg-white/2! border-white/10! text-white! text-xs! rounded-xl! px-4! py-3! focus:border-emerald-500!"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
            >WhatsApp Number</label
          >
          <InputText
            v-model="newStudent.phone"
            placeholder="+880 1XXX-XXXXXX (WhatsApp)"
            class="w-full bg-white/2! border-white/10! text-white! text-xs! rounded-xl! px-4! py-3! focus:border-emerald-500!"
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
            >Initial Access Key (Auto-Gen)</label
          >
          <div class="relative">
            <InputText
              v-model="newStudent.password"
              type="text"
              class="w-full bg-white/2! border-white/10! text-white! text-[10px]! font-mono! rounded-xl! pl-4! pr-12! py-3!"
            />
            <i
              class="pi pi-lock absolute right-4 top-1/2 -translate-y-1/2 text-surface-600 text-xs"
            />
          </div>
          <p
            class="text-[8px] text-surface-600 font-bold uppercase tracking-tighter italic"
          >
            Provide this temporary key to the student for initial node
            verification.
          </p>
        </div>

        <div class="flex items-center gap-3 pt-4">
          <Button
            label="Cancel"
            text
            class="flex-1 text-surface-500! text-[10px]! font-black! uppercase! tracking-widest!"
            @click="isClientEntryOpen = false"
          />
          <Button
            label="Initialize Onboarding"
            :loading="isSubmitting"
            @click="handleClientEntry"
            class="flex-2 bg-emerald-600! border-emerald-500! text-white! text-[10px]! font-black! uppercase! tracking-widest! rounded-xl! py-3!"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* High-Performance Font Smoothing */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.text-gradient {
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
