<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { LEAD_STATUSES } from "~~/shared/constants";

const formatDate = (date: any, formatStr?: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (formatStr?.includes("HH:mm")) {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const route = useRoute();
const leadId = route.params.id as string;
const confirm = useConfirm();
const toast = useToast();

// Fetch Lead Data
const { data: leadRes, refresh } = await useFetch(`/api/admin/leads/${leadId}`);
const lead = computed(() => (leadRes.value as any)?.data);

// Only show Pre-Application statuses for Leads
const preAppStatuses = LEAD_STATUSES.PRE_APPLICATION;

// Form States
const isUpdating = ref(false);
const note = ref("");
const nextFollowUp = ref("");
const selectedCounselor = ref<any>(null);

// Fetch Staff for Transfer
const { data: staffRes, refresh: refreshStaff } = await useFetch(
  "/api/admin/staff"
);
const staffOptions = computed(() => (staffRes.value as any)?.data || []);

const handleRefresh = async () => {
  isUpdating.value = true;
  try {
    await Promise.all([refresh(), refreshStaff()]);
    toast.add({
      severity: "success",
      summary: "Intelligence Synchronized",
      detail: "All tactical data points updated",
      life: 2000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Refresh Failed",
      detail: "Intelligence sync interrupted",
      life: 3000,
    });
  } finally {
    isUpdating.value = false;
  }
};

watch(
  [() => lead.value?.assignedCounselorId, staffOptions],
  ([newId, options]) => {
    if (newId && options?.length) {
      selectedCounselor.value =
        options.find((s: any) => s.id === newId) || null;
    }
  },
  { immediate: true }
);

// Conversion Readiness
const canConvert = computed(() => {
  if (!lead.value) return false;
  return [
    "Eligible to Apply",
    "Documents Complete – Ready to Apply",
    "Application in Preparation",
  ].includes(lead.value.status);
});

// Lifecycle Actions
const selectedStatus = ref(lead.value?.status);
watch(
  () => lead.value?.status,
  (newStatus) => {
    selectedStatus.value = newStatus;
  },
  { immediate: true }
);

const updateStatus = async (newStatus: string) => {
  if (!newStatus || newStatus === lead.value?.status) return;
  isUpdating.value = true;
  try {
    await $fetch(`/api/admin/leads/${leadId}/status`, {
      method: "PATCH",
      body: { status: newStatus },
    });
    await refresh();
    toast.add({
      severity: "success",
      summary: "Status Synchronized",
      detail: `Neural state: ${newStatus}`,
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Sync Failure",
      detail: "Failed to propagate status change",
      life: 5000,
    });
  } finally {
    isUpdating.value = false;
  }
};

const addNote = async () => {
  if (!note.value.trim()) return;
  isUpdating.value = true;
  try {
    await $fetch(`/api/admin/leads/${leadId}/notes`, {
      method: "POST",
      body: { note: note.value },
    });
    note.value = "";
    await refresh();
    toast.add({
      severity: "success",
      summary: "Observation Recorded",
      detail: "Timeline updated",
      life: 2000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Note Error",
      detail: "Failed to record observation",
      life: 5000,
    });
  } finally {
    isUpdating.value = false;
  }
};

const scheduleFollowUp = async () => {
  if (!nextFollowUp.value) return;
  isUpdating.value = true;
  try {
    await $fetch(`/api/admin/leads/${leadId}/follow-up`, {
      method: "PATCH",
      body: { date: nextFollowUp.value },
    });
    await refresh();
    toast.add({
      severity: "success",
      summary: "Schedule Locked",
      detail: "Callback tracker updated",
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Schedule Error",
      detail: "Failed to update callback tracker",
      life: 5000,
    });
  } finally {
    isUpdating.value = false;
  }
};

const convertToApplicant = () => {
  confirm.require({
    message: `Are you sure you want to promote ${lead.value.firstName} to an Applicant profile? This will create a system user account and initiate the official enrollment process.`,
    header: "Lead Conversion",
    icon: "pi pi-user-plus",
    acceptClass: "p-button-primary",
    accept: async () => {
      isUpdating.value = true;
      try {
        await $fetch(`/api/admin/leads/${leadId}/convert`, { method: "POST" });
        toast.add({
          severity: "success",
          summary: "Promotion Successful",
          detail: "Applicant profile initialized",
          life: 3000,
        });
        navigateTo("/dashboard/user/applicants");
      } catch (e: any) {
        toast.add({
          severity: "error",
          summary: "Conversion Failed",
          detail: e.data?.message || "Neural failure during promotion",
          life: 5000,
        });
      } finally {
        isUpdating.value = false;
      }
    },
  });
};

const reassignLead = async (selection: any) => {
  if (!selection || selection.id === lead.value?.assignedCounselorId) return;
  isUpdating.value = true;
  try {
    await $fetch(`/api/admin/leads/${leadId}/assign`, {
      method: "POST",
      body: {
        counselorId: selection.id,
        type: selection.type,
      },
    });
    await refresh();
    toast.add({
      severity: "success",
      summary:
        selection.type === "TEAM" ? "Forwarded to Team" : "Registry Updated",
      detail:
        selection.type === "TEAM"
          ? "Autonomous round-robin initiated"
          : "Lead custody transferred successfully",
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Transfer Failed",
      detail: "Failed to propagate assignment change",
      life: 5000,
    });
  } finally {
    isUpdating.value = false;
  }
};
</script>

<template>
  <div v-if="lead" class="max-w-[1400px] mx-auto space-y-6 pb-12 font-inter">
    <ConfirmDialog />
    <Toast />

    <!-- Neural Processing Overlay -->
    <Transition name="fade">
      <div
        v-if="isUpdating"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-16 h-16">
            <div
              class="absolute inset-0 border-4 border-primary-500/20 rounded-full"
            ></div>
            <div
              class="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin"
            ></div>
          </div>
          <p
            class="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse"
          >
            Syncing Intelligence...
          </p>
        </div>
      </div>
    </Transition>

    <!-- Action Bar -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-surface-900/40 border border-white/5 rounded-2xl backdrop-blur-3xl shadow-2xl"
    >
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/dashboard/leads"
          class="group p-2 rounded-xl bg-surface-950 border border-white/5 text-surface-400 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-300"
        >
          <i
            class="pi pi-arrow-left text-sm group-hover:-translate-x-1 transition-transform"
          />
        </NuxtLink>
        <div>
          <h1
            class="text-lg font-black text-white uppercase tracking-[0.15em] leading-none mb-1.5 italic"
          >
            {{ lead?.firstName }} {{ lead?.lastName }}
          </h1>
          <div class="flex items-center gap-2">
            <span
              class="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20"
            >
              {{ lead?.status }}
            </span>
            <span
              class="text-[8px] text-surface-600 font-bold uppercase tracking-widest"
            >
              SOURCE: {{ lead?.source || "INBOUND" }}
            </span>
            <span
              v-if="lead?.assignedCounselor"
              class="text-[8px] text-primary-500 font-black uppercase tracking-widest bg-primary-500/5 px-2 py-0.5 rounded border border-primary-500/10"
            >
              OFFICER: {{ lead.assignedCounselor.firstName }}
              {{ lead.assignedCounselor.lastName }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          v-if="canConvert && lead?.status !== 'Converted to Applicant'"
          @click="convertToApplicant"
          class="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <i class="pi pi-user-plus" />
          Promote to Applicant
        </button>
        <a
          :href="`https://wa.me/${lead?.phone?.replace(/[^0-9]/g, '')}`"
          target="_blank"
          class="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 transition-all text-[9px] font-black uppercase tracking-widest"
        >
          <i class="pi pi-whatsapp" />
          WhatsApp
        </a>
      </div>
    </div>

    <!-- Tactical Management Row -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <!-- Status Navigator -->
      <div
        class="md:col-span-4 p-4 rounded-xl bg-surface-900/40 border border-white/5 backdrop-blur-3xl flex items-center gap-4"
      >
        <div
          class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0"
        >
          <i class="pi pi-directions text-emerald-400 text-xs" />
        </div>
        <div class="flex-1">
          <label
            class="block text-[7px] text-surface-500 font-black uppercase tracking-widest mb-1"
            >Neural State Phase</label
          >
          <Select
            v-model="selectedStatus"
            :options="preAppStatuses"
            placeholder="Select Phase"
            class="w-full neural-select-compact"
            @change="(e: any) => updateStatus(e.value)"
            :disabled="isUpdating || lead?.status === 'Converted to Applicant'"
          />
        </div>
      </div>

      <!-- Stewardship Handover -->
      <div
        class="md:col-span-4 p-4 rounded-xl bg-surface-900/40 border border-white/5 backdrop-blur-3xl flex items-center gap-4"
      >
        <div
          class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0"
        >
          <i class="pi pi-share-alt text-orange-400 text-xs" />
        </div>
        <div class="flex-1">
          <label
            class="block text-[7px] text-surface-500 font-black uppercase tracking-widest mb-1"
            >Personnel Stewardship</label
          >
          <Select
            v-model="selectedCounselor"
            :options="staffOptions"
            optionLabel="label"
            placeholder="Select Officer/Team"
            class="w-full neural-select-compact"
            @change="(e: any) => reassignLead(e.value)"
            :disabled="isUpdating"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center gap-2">
                <span
                  class="text-[10px] font-black text-white uppercase truncate"
                  >{{ slotProps.value.name }}</span
                >
              </div>
              <span
                v-else
                class="text-[10px] text-surface-600 font-bold uppercase"
                >{{ slotProps.placeholder }}</span
              >
            </template>
          </Select>
        </div>
      </div>

      <!-- Engagement Actions -->
      <div class="md:col-span-4 flex items-center gap-3">
        <button
          v-if="canConvert && lead?.status !== 'Converted to Applicant'"
          @click="convertToApplicant"
          class="flex-1 h-full rounded-xl bg-primary-500 text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <i class="pi pi-user-plus" />
          Promote to Applicant
        </button>
        <button
          @click="handleRefresh"
          :disabled="isUpdating"
          class="w-14 h-full rounded-xl bg-surface-900 border border-white/5 text-surface-500 hover:text-white transition-all flex items-center justify-center box-border disabled:opacity-20"
        >
          <i
            class="pi pi-refresh text-xs"
            :class="{ 'animate-spin': isUpdating }"
          />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Intelligence Clusters -->
      <div class="lg:col-span-4 space-y-4">
        <!-- Bio Intelligence Matrix -->
        <div
          class="p-5 rounded-2xl bg-surface-900/30 border border-white/5 backdrop-blur-xl relative overflow-hidden group"
        >
          <div
            class="absolute -top-4 -right-4 w-24 h-24 bg-primary-500/5 rounded-full blur-3xl"
          ></div>

          <div class="flex items-center justify-between mb-6">
            <h3
              class="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] flex items-center gap-2"
            >
              <span class="w-1 h-4 rounded-full bg-primary-500"></span>
              Neural Bio-Metrics
            </h3>
            <span
              class="text-[8px] font-black text-primary-500/60 uppercase tracking-widest italic"
              >V1.0</span
            >
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="p-3 rounded-lg bg-white/2 border border-white/5">
              <p class="text-[7px] text-surface-600 font-black uppercase mb-1">
                Target Locale
              </p>
              <p class="text-[10px] text-white font-black truncate">
                {{ lead?.preferredCountry }}
              </p>
            </div>
            <div class="p-3 rounded-lg bg-white/2 border border-white/5">
              <p class="text-[7px] text-surface-600 font-black uppercase mb-1">
                Phase Intent
              </p>
              <p class="text-[10px] text-white font-black truncate">
                {{ lead?.studyLevel || "TBD" }}
              </p>
            </div>
            <div class="p-3 rounded-lg bg-white/2 border border-white/5">
              <p class="text-[7px] text-surface-600 font-black uppercase mb-1">
                Academic GPA
              </p>
              <p class="text-[10px] text-white font-black truncate">
                {{ lead?.academicResults || "N/A" }}
              </p>
            </div>
            <div class="p-3 rounded-lg bg-white/2 border border-white/5">
              <p class="text-[7px] text-surface-600 font-black uppercase mb-1">
                Ling Intel
              </p>
              <p class="text-[10px] text-white font-black truncate">
                {{ lead?.englishProficiency || "N/A" }}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <div
              class="p-3 rounded-lg bg-surface-950/40 border border-white/5 flex items-center justify-between group/email overflow-hidden"
            >
              <div class="min-w-0 flex-1">
                <p
                  class="text-[7px] text-surface-700 font-black uppercase mb-0.5"
                >
                  Digital Sync Point
                </p>
                <p class="text-[10px] text-white font-medium truncate">
                  {{ lead?.email }}
                </p>
              </div>
              <i
                class="pi pi-copy text-[10px] text-surface-700 hover:text-white cursor-pointer ml-2"
              />
            </div>
            <div
              class="p-3 rounded-lg bg-surface-950/40 border border-white/5 flex items-center justify-between"
            >
              <div class="min-w-0 flex-1">
                <p
                  class="text-[7px] text-surface-700 font-black uppercase mb-0.5"
                >
                  Comms Reach
                </p>
                <p class="text-[10px] text-white font-medium truncate">
                  {{ lead?.phone }}
                </p>
              </div>
              <div class="flex items-center gap-2 ml-2 shrink-0">
                <a
                  :href="`https://wa.me/${lead?.phone?.replace(/[^0-9]/g, '')}`"
                  target="_blank"
                  class="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center border border-green-500/20 hover:bg-green-500/20 transition-all"
                >
                  <i class="pi pi-whatsapp text-green-500 text-[10px]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Follow-up Scheduler -->
        <div
          class="p-5 rounded-2xl bg-surface-900/40 border border-white/5 backdrop-blur-3xl"
        >
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] flex items-center gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Tactical Tracker
            </h3>
            <span
              v-if="lead?.nextFollowUpAt"
              class="text-[8px] text-blue-400 font-black tracking-widest animate-pulse uppercase"
              >Active</span
            >
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="nextFollowUp"
              type="datetime-local"
              class="flex-1 bg-surface-950/60 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white font-black uppercase tracking-wider focus:outline-none focus:border-primary-500/30 invert-calendar-icon transition-all"
            />
            <button
              @click="scheduleFollowUp"
              :disabled="isUpdating || !nextFollowUp"
              class="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center hover:bg-blue-400 transition-all disabled:opacity-20 shadow-lg shadow-blue-500/10"
            >
              <i class="pi pi-check text-xs" />
            </button>
          </div>
          <div
            v-if="lead?.nextFollowUpAt"
            class="mt-3 p-2 rounded bg-blue-500/5 border border-blue-500/10 flex items-center gap-2"
          >
            <i class="pi pi-clock text-[8px] text-blue-400" />
            <span
              class="text-[9px] text-blue-400 uppercase font-black tracking-widest"
              >{{ formatDate(lead.nextFollowUpAt) }}</span
            >
          </div>
        </div>
      </div>

      <!-- Right Column: Tactical Timeline -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Conversation History & Note Entry -->
        <div
          class="p-6 rounded-2xl bg-surface-900/30 border border-white/5 backdrop-blur-xl flex flex-col h-[750px]"
        >
          <div class="flex items-center justify-between mb-8">
            <h3
              class="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] flex items-center gap-2"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,1)]"
              ></span>
              Operational Timeline
            </h3>
            <span
              class="text-[8px] font-black text-surface-600 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5"
              >Neural Event Log</span
            >
          </div>

          <div class="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
            <!-- Timeline Item -->
            <div
              v-for="event in lead.events"
              :key="event.id"
              class="relative pl-10 border-l border-white/10 last:border-transparent group pb-2"
            >
              <div
                class="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border border-surface-950 z-10"
                :class="[
                  event.type === 'NOTE'
                    ? 'bg-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.4)]'
                    : event.type === 'STATUS_CHANGE'
                    ? 'bg-primary-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : event.type === 'CONVERSION'
                    ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-surface-600',
                ]"
              ></div>

              <div class="flex flex-col gap-1 mb-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span
                      class="text-[10px] font-black uppercase tracking-[0.2em]"
                      :class="[
                        event.type === 'NOTE'
                          ? 'text-fuchsia-400'
                          : event.type === 'STATUS_CHANGE'
                          ? 'text-primary-400'
                          : event.type === 'CONVERSION'
                          ? 'text-emerald-400'
                          : 'text-surface-500',
                      ]"
                      >{{ event.type }}</span
                    >
                    <span
                      v-if="event.performer"
                      class="text-[9px] text-surface-500 font-bold uppercase tracking-wider"
                      >/ BY {{ event.performer.firstName }}</span
                    >
                  </div>
                  <span
                    class="text-[9px] text-surface-600 font-black uppercase tracking-widest tabular-nums"
                    >{{ formatDate(event.createdAt, "HH:mm") }}</span
                  >
                </div>
                <span
                  class="text-[8px] text-surface-700 font-bold uppercase tracking-[0.1em]"
                  >{{ formatDate(event.createdAt) }}</span
                >
              </div>

              <div
                class="p-4 rounded-xl bg-white/2 border border-white/5 group-hover:bg-white/4 transition-all duration-300"
              >
                <p
                  class="text-[12px] text-surface-300 leading-relaxed font-medium"
                >
                  <template v-if="event.type === 'NOTE'">{{
                    event.metadata?.note
                  }}</template>
                  <template v-else-if="event.type === 'STATUS_CHANGE'"
                    >Transitioned from internal state into
                    <span
                      class="text-white font-black uppercase tracking-wider"
                      >{{ event.metadata?.to }}</span
                    ></template
                  >
                  <template v-else-if="event.type === 'CONVERSION'"
                    >Successfully promoted to official
                    <span
                      class="text-emerald-400 font-black uppercase tracking-widest"
                      >Applicant Profile</span
                    ></template
                  >
                  <template v-else
                    >{{ event.message || event.type }} recorded in situational
                    intelligence</template
                  >
                </p>
              </div>
            </div>
          </div>

          <!-- Note Entry -->
          <div
            class="mt-8 pt-8 border-t border-white/5 bg-surface-950/20 -mx-6 px-6 pb-2 rounded-b-2xl"
          >
            <textarea
              v-model="note"
              placeholder="Record tactical briefings or student interactions..."
              class="w-full p-5 bg-surface-950/40 border border-white/5 rounded-2xl text-[12px] text-white placeholder-surface-700 focus:outline-none focus:border-primary-500/30 focus:bg-surface-950/60 transition-all resize-none h-32 italic leading-relaxed"
            ></textarea>
            <div class="flex justify-end mt-4">
              <button
                @click="addNote"
                :disabled="isUpdating || !note.trim()"
                class="flex items-center gap-3 px-10 py-3 rounded-xl bg-primary-500 text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-400 border border-white/5 transition-all disabled:opacity-20 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <i class="pi pi-pencil text-xs" />
                Commit to Timeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.2);
}

.invert-calendar-icon::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.6) sepia(1) saturate(5) hue-rotate(-15deg);
  cursor: pointer;
  opacity: 0.5;
}
.invert-calendar-icon::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

@keyframes pulse-soft {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
.animate-pulse {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.neural-select-compact {
  background: transparent !important;
  border: none !important;
}

:deep(.neural-select-compact.p-select) {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 0.5rem;
  font-size: 11px;
  padding: 0.25rem 0;
}

:deep(.neural-select-compact.p-select .p-select-label) {
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 0 0 0.75rem;
}

:deep(.neural-select-compact.p-select .p-select-dropdown) {
  width: 2rem;
}

:deep(.p-select-overlay) {
  background: var(--p-surface-950) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(24px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

:deep(.p-select-option) {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--p-surface-400);
  padding: 0.75rem !important;
}

:deep(.p-select-option.p-highlight) {
  background: rgba(var(--p-primary-500-rgb), 0.1) !important;
  color: var(--p-primary-400) !important;
}
</style>
