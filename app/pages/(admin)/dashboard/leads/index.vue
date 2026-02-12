<script setup lang="ts">
import { LEAD_STATUSES } from "~~/shared/constants";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const { data: leads, refresh } = await useFetch<any>("/api/admin/leads");

// Filter leadList to only include Pre-Application statuses
const leadList = computed(() => {
  const all = leads.value?.data || [];
  return all.filter((l: any) =>
    LEAD_STATUSES.PRE_APPLICATION.includes(l.status)
  );
});

const stats = computed(() => {
  const all = leadList.value;
  return [
    { label: "Active Leads", value: all.length, color: "text-white" },
    {
      label: "New Inquiries",
      value: all.filter((l: any) => l.status === "New Inquiry").length,
      color: "text-blue-400",
    },
    {
      label: "Qualified",
      value: all.filter((l: any) =>
        ["Eligible to Apply", "Documents Complete – Ready to Apply"].includes(
          l.status
        )
      ).length,
      color: "text-emerald-400",
    },
    {
      label: "Assigned",
      value: all.filter((l: any) => l.assignedCounselorId).length,
      color: "text-purple-400",
    },
  ];
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-white uppercase tracking-wider">
          Lead Hub
        </h1>
        <p class="text-xs text-surface-400 mt-1 uppercase tracking-widest">
          Autonomous Education Prospect Management
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="refresh"
          class="p-2.5 rounded-xl bg-surface-900 border border-white/5 text-surface-400 hover:text-white transition-all"
        >
          <i class="pi pi-refresh" />
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-4 rounded-2xl bg-surface-900/50 border border-white/5 backdrop-blur-xl"
      >
        <div
          class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1"
        >
          {{ stat.label }}
        </div>
        <div class="text-2xl font-black" :class="stat.color">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <!-- Leads Table -->
    <div
      class="bg-surface-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5">
              <th
                class="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
              >
                Student
              </th>
              <th
                class="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
              >
                Contact
              </th>
              <th
                class="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
              >
                Interest
              </th>
              <th
                class="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
              >
                Academic
              </th>
              <th
                class="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
              >
                Assigned To
              </th>
              <th
                class="px-6 py-4 text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr
              v-for="lead in leadList"
              :key="lead.id"
              class="group hover:bg-white/2 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span
                    class="text-[11px] font-bold text-white uppercase tracking-wider"
                    >{{ lead.firstName }} {{ lead.lastName }}</span
                  >
                  <span class="text-[10px] text-surface-500 mt-0.5">{{
                    lead.email
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <a
                  v-if="lead.phone"
                  :href="`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`"
                  target="_blank"
                  class="flex items-center gap-1.5 text-[10px] font-bold text-green-400 hover:text-green-300 transition-colors uppercase tracking-widest"
                >
                  <i class="pi pi-whatsapp text-xs" />
                  {{ lead.phone }}
                </a>
                <span
                  v-else
                  class="text-[9px] text-surface-600 uppercase tracking-widest"
                  >No Number</span
                >
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span
                    class="text-[10px] font-bold text-primary-400 uppercase tracking-widest"
                    >{{ lead.preferredCountry }}</span
                  >
                  <span class="text-[9px] text-surface-400 mt-0.5">{{
                    lead.studyLevel
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-[10px] text-surface-200"
                    >GPA: {{ lead.academicResults }}</span
                  >
                  <span class="text-[9px] text-surface-500 mt-0.5">{{
                    lead.englishProficiency
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border shrink-0 inline-block"
                  :class="
                    lead.status === 'New Inquiry'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-surface-800 text-surface-400 border-white/10'
                  "
                >
                  {{ lead.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-[10px] text-surface-400">
                {{ lead.assignedCounselor?.firstName || "Unassigned" }}
              </td>
              <td class="px-6 py-4">
                <NuxtLink
                  :to="`/dashboard/leads/${lead.id}`"
                  class="p-2 rounded-lg bg-white/5 text-surface-400 hover:text-primary-400 transition-all"
                >
                  <i class="pi pi-eye text-xs" />
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="!leadList.length">
              <td colspan="6" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <i class="pi pi-inbox text-surface-700 text-3xl" />
                  <p
                    class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]"
                  >
                    No Leads in the Hub yet
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
