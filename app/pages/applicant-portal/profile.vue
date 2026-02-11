<script setup lang="ts">
import { useToast } from "primevue/usetoast";

definePageMeta({
  title: "Identity Hub",
  layout: "applicant",
  middleware: "auth",
});

useHead({
  title: "Information Hub | Scholar's Profile",
});

const toast = useToast();
const { user: sessionUser } = useUserSession();

// 1. Fetch Detailed Profile
const {
  data: profileResponse,
  pending,
  error,
  refresh,
} = useFetch(() => `/api/applicants/${sessionUser.value?.id}/profile`);

const profile = computed(() => profileResponse.value?.data || {});
const user = computed(() => sessionUser.value || {});

// -- Computed Helpers --
const fullName = computed(() =>
  profile.value.firstName
    ? `${profile.value.firstName} ${profile.value.lastName}`
    : user.value.email?.split("@")[0] || "Scholar"
);

const initials = computed(() => {
  if (profile.value.firstName && profile.value.lastName) {
    return (
      profile.value.firstName[0] + profile.value.lastName[0]
    ).toUpperCase();
  }
  return user.value.email?.[0].toUpperCase() || "S";
});

const mailingAddress = computed(
  () => profile.value.addresses?.find((a: any) => a.type === "MAILING") || {}
);

const permanentAddress = computed(
  () => profile.value.addresses?.find((a: any) => a.type === "PERMANENT") || {}
);

const isLocked = computed(() => !!profile.value.isLocked);

const formatDate = (date: string | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
};

// Editing Logic
const editDialogVisible = ref(false);
const editingSection = ref("");
const formData = ref<any>({});
const isSaving = ref(false);
const isSubmitting = ref(false);

const syncFormData = () => {
  if (!profile.value) return;

  // Clone profile to formData
  formData.value = JSON.parse(JSON.stringify(profile.value));

  // Ensure nested structures are reactive
  formData.value.addresses = formData.value.addresses || [];
  formData.value.emergencyContacts = formData.value.emergencyContacts || [];
  formData.value.otherCitizenships = formData.value.otherCitizenships || [];
  formData.value.educationHistory = formData.value.educationHistory || [];
  formData.value.workExperience = formData.value.workExperience || [];
  formData.value.englishProficiency = formData.value.englishProficiency || [];

  // Convert dates for picker compatibility
  if (formData.value.dateOfBirth)
    formData.value.dateOfBirth = new Date(formData.value.dateOfBirth);
  if (formData.value.passportIssueDate)
    formData.value.passportIssueDate = new Date(
      formData.value.passportIssueDate
    );
  if (formData.value.passportExpiryDate)
    formData.value.passportExpiryDate = new Date(
      formData.value.passportExpiryDate
    );
};

// Sync when profile data loads or updates (e.g. after save)
watch(
  profile,
  (newVal) => {
    // Only sync if we're not actively editing (to avoid overwriting work in progress if background refresh happens)
    // However, since refresh() is manual mostly, we usually want to sync.
    // Let's safe-guard: if keys are missing (initial load) or just after save.
    if (newVal) {
      syncFormData();
    }
  },
  { immediate: true, deep: true }
);

const openEditDialog = (section: string) => {
  if (isLocked.value) return;
  editingSection.value = section;

  // Initialize address types if missing (Specific logic for dialogs)
  if (
    section === "Mailing Address" &&
    !formData.value.addresses.find((a: any) => a.type === "MAILING")
  ) {
    formData.value.addresses.push({
      type: "MAILING",
      address1: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    });
  }
  if (
    section === "Permanent Address" &&
    !formData.value.addresses.find((a: any) => a.type === "PERMANENT")
  ) {
    formData.value.addresses.push({
      type: "PERMANENT",
      address1: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    });
  }

  // Initialize contacts if empty
  if (section === "Contacts" && formData.value.emergencyContacts.length === 0) {
    formData.value.emergencyContacts.push({
      name: "",
      // phone/relation/email added by user via UI usually, but we can seed one
      phone: "",
      relation: "",
      email: "",
    });
  }

  editDialogVisible.value = true;
};

const saveProfile = async () => {
  if (isLocked.value) return;
  isSaving.value = true;
  try {
    await $fetch(`/api/applicants/${sessionUser.value?.id}/profile`, {
      method: "PATCH",
      body: formData.value,
    });

    toast.add({
      severity: "success",
      summary: "Identity Synced",
      detail: "Your profile has been saved to the institutional archive.",
      life: 3000,
    });
    editDialogVisible.value = false;
    refresh();
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Sync Failed",
      detail:
        err.data?.message ||
        err.data?.data?.[0]?.message ||
        "Failed to update profile.",
      life: 4000,
    });
  } finally {
    isSaving.value = false;
  }
};

const submitFinalProfile = async () => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/applicant/profile.submit", { method: "POST" });
    toast.add({
      severity: "success",
      summary: "Identity Finalized",
      detail: "Your profile is now locked for institutional review.",
      life: 5000,
    });
    refresh();
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Finalization Failed",
      detail: err.data?.message || "Internal system error.",
      life: 4000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Unlock Request Logic
const unlockDialogVisible = ref(false);
const unlockReason = ref("");
const isRequestingUnlock = ref(false);

const submitUnlockRequest = async () => {
  if (unlockReason.value.length < 10) {
    toast.add({
      severity: "warn",
      summary: "Reason Too Short",
      detail:
        "Please provide at least 10 characters explaining why you need to unlock your profile.",
      life: 3000,
    });
    return;
  }

  isRequestingUnlock.value = true;
  try {
    await $fetch(`/api/applicants/${sessionUser.value?.id}/unlock-request`, {
      method: "POST",
      body: { reason: unlockReason.value },
    });
    toast.add({
      severity: "success",
      summary: "Request Submitted",
      detail: "Your unlock request has been sent for administrator approval.",
      life: 5000,
    });
    unlockDialogVisible.value = false;
    unlockReason.value = "";
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Request Failed",
      detail: err.data?.message || "Failed to submit unlock request.",
      life: 5000,
    });
  } finally {
    isRequestingUnlock.value = false;
  }
};

// Tabs
const activeTab = ref(0);
const tabs = [
  { label: "Personal Information", icon: "pi pi-user" },
  { label: "Academic Qualifications", icon: "pi pi-book" },
  { label: "Work Experience", icon: "pi pi-briefcase" },
  { label: "Tests", icon: "pi pi-check-square" },
];
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <!-- Background Decor (Identical to Admin Dashboard) -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
      class="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"
    ></div>

    <!-- Header Section -->
    <div
      class="relative flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <div
          class="flex items-center gap-2 text-[12px] font-black text-surface-400 mb-1 uppercase tracking-widest"
        >
          <span>Identity Hub</span>
          <i class="pi pi-angle-right text-[10px]"></i>
          <span class="text-primary-500 italic">Institutional Profile</span>
        </div>
        <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
          Scholar
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 italic"
            >Identity</span
          >
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="!isLocked">
          <Button
            icon="pi pi-check-circle"
            label="Finalize Identity"
            :loading="isSubmitting"
            @click="submitFinalProfile"
            class="!bg-emerald-500 !text-black !border-0 !text-[12px] font-black uppercase tracking-wider px-6 rounded-xl shadow-lg shadow-emerald-500/20"
          />
        </template>
        <template v-else>
          <div class="flex items-center gap-3">
            <div
              class="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
            >
              <i class="pi pi-lock text-xs text-emerald-400"></i>
              <span
                class="text-[11px] font-black text-emerald-400 uppercase tracking-widest"
                >Profile Verified & Locked</span
              >
            </div>
            <Button
              icon="pi pi-unlock"
              label="Request Unlock"
              text
              class="!text-amber-500 !text-[11px] font-black uppercase tracking-widest hover:!bg-amber-500/10 !border-amber-500/30"
              @click="unlockDialogVisible = true"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Loading State: Premium Skeletons -->
    <div v-if="pending" class="space-y-8 animate-pulse">
      <!-- Identity Overview Card Skeleton -->
      <div
        class="bg-surface-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8"
      >
        <div class="relative">
          <Skeleton shape="circle" size="6rem" class="!bg-white/5" />
        </div>
        <div class="flex-1 text-center md:text-left space-y-4">
          <div class="space-y-2">
            <Skeleton
              width="15rem"
              height="2rem"
              class="!bg-white/5 rounded-lg"
            />
            <Skeleton
              width="10rem"
              height="1rem"
              class="!bg-white/5 rounded-lg"
            />
          </div>
          <div class="flex flex-wrap justify-center md:justify-start gap-6">
            <Skeleton width="8rem" height="1rem" class="!bg-white/5" />
            <Skeleton width="8rem" height="1rem" class="!bg-white/5" />
            <Skeleton width="8rem" height="1rem" class="!bg-white/5" />
          </div>
        </div>
      </div>

      <!-- Content Skeleton -->
      <div
        class="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl min-h-[600px] flex flex-col"
      >
        <div class="flex border-b border-white/5 bg-white/[0.01]">
          <div v-for="i in 4" :key="i" class="px-10 py-6">
            <Skeleton width="100px" height="20px" class="!bg-white/5" />
          </div>
        </div>
        <div class="p-8 md:p-10 space-y-10">
          <div class="space-y-6">
            <Skeleton
              width="200px"
              height="40px"
              class="!bg-white/5 rounded-xl text-[12px]!"
            />
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton
                v-for="i in 3"
                :key="i"
                height="80px"
                class="!bg-white/5 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-500/5 border border-red-500/20 rounded-3xl p-12 text-center backdrop-blur-xl"
    >
      <div
        class="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-exclamation-triangle text-2xl"></i>
      </div>
      <h2 class="text-xl font-black text-white uppercase tracking-widest mb-2">
        Access Interrupted
      </h2>
      <p class="text-red-400/60 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
        We encountered an error while synthesizing your institutional identity.
        This could be a temporal sync issue.
      </p>
      <Button
        label="Re-Verify Identity"
        icon="pi pi-refresh"
        @click="() => refresh()"
        class="bg-red-500! text-black! border-0! text-[12px]! font-black uppercase tracking-widest px-8 py-3 rounded-xl"
      />
    </div>

    <!-- Identity Overview Card (Actual Content) -->
    <div v-else class="animate-fade-in-up space-y-8">
      <div
        class="bg-surface-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 group"
      >
        <div class="relative">
          <Avatar
            :label="initials"
            size="xlarge"
            shape="circle"
            class="!bg-linear-to-br !from-primary-500 !to-primary-700 !text-black !font-black !w-24! !h-24! !text-3xl shadow-2xl ring-8 ring-white/[0.03] group-hover:scale-105 transition-transform duration-500"
          />
          <div
            class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-surface-950 flex items-center justify-center shadow-lg"
            :class="isLocked ? 'bg-emerald-500' : 'bg-amber-500'"
          >
            <i :class="isLocked ? 'pi pi-check' : 'pi pi-pencil'"
              class="text-[10px] text-black font-black"></i>
          </div>
        </div>

        <div class="flex-1 text-center md:text-left space-y-4">
          <div>
            <div
              class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1"
            >
              <h2
                class="text-2xl font-black text-white tracking-tight uppercase"
              >
                {{ fullName }}
              </h2>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-widest"
                :class="
                  isLocked
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                "
              >
                {{ isLocked ? "VERIFIED" : "ACTION REQUIRED" }}
              </span>
            </div>
            <p
              class="text-surface-400 text-sm font-bold opacity-60 uppercase tracking-tighter"
            >
              {{ user.email }}
            </p>
          </div>

          <div class="flex flex-wrap justify-center md:justify-start gap-6">
            <div
              class="flex items-center gap-2 text-[12px] font-black text-surface-300 uppercase tracking-widest"
            >
              <i class="pi pi-id-card text-primary-400"></i>
              <span
                >ID:
                <span class="text-white">{{
                  profile.passportNo || "N/A"
                }}</span></span
              >
            </div>
            <div
              class="flex items-center gap-2 text-[12px] font-black text-surface-300 uppercase tracking-widest"
            >
              <i class="pi pi-globe text-primary-400"></i>
              <span>{{ profile.nationality || "Unknown" }}</span>
            </div>
            <div
              class="flex items-center gap-2 text-[12px] font-black text-surface-300 uppercase tracking-widest"
            >
              <i class="pi pi-calendar text-primary-400"></i>
              <span
                >Joined:
                <span class="text-white">{{
                  formatDate(user.createdAt)
                }}</span></span
              >
            </div>
          </div>
        </div>

        <!-- Institutional Progress Tracker -->
        <div
          class="hidden lg:flex flex-1 max-w-sm items-center justify-between px-8 relative h-16 border-l border-white/5"
        >
          <div
            class="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-[1px] bg-white/10"
          ></div>

          <div class="flex flex-col items-center gap-2 relative z-10">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ring-4 ring-surface-950"
              :class="
                isLocked
                  ? 'bg-primary-500 text-black'
                  : 'bg-surface-800 text-surface-400 border border-white/10'
              "
            >
              1
            </div>
            <span
              class="text-[10px] font-black text-white uppercase tracking-widest"
              >Profile</span
            >
          </div>
          <div class="flex flex-col items-center gap-2 relative z-10">
            <div
              class="w-7 h-7 rounded-full bg-surface-800 text-surface-500 flex items-center justify-center text-[10px] font-black ring-4 ring-surface-950 border border-white/10 uppercase italic"
            >
              2
            </div>
            <span
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
              >Apps</span
            >
          </div>
          <div class="flex flex-col items-center gap-2 relative z-10">
            <div
              class="w-7 h-7 rounded-full bg-surface-800 text-surface-500 flex items-center justify-center text-[10px] font-black ring-4 ring-surface-950 border border-white/10 uppercase italic"
            >
              3
            </div>
            <span
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
              >Docs</span
            >
          </div>
        </div>
      </div>

      <!-- Main Content Tabs -->
      <div
        class="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl min-h-[600px] flex flex-col"
      >
        <!-- Tabs Navigation (Identical To Admin) -->
        <div
          class="flex border-b border-white/5 overflow-x-auto bg-white/[0.01]"
        >
          <button
            v-for="(tab, idx) in tabs"
            :key="idx"
            @click="activeTab = idx"
            class="px-10 py-6 text-[12px] font-black uppercase tracking-widest flex items-center gap-3 border-b-2 transition-all outline-none"
            :class="
              activeTab === idx
                ? 'border-primary-500 text-primary-400 bg-white/[0.02]'
                : 'border-transparent text-surface-500 hover:text-white hover:bg-white/[0.01]'
            "
          >
            <div class="flex flex-col items-start gap-1">
              <span class="flex items-center gap-2">
                <i :class="tab.icon" class="text-xs"></i>
                {{ tab.label }}
              </span>
              <span
                v-if="activeTab === idx"
                class="text-[7px] text-emerald-400 font-bold"
                >DATA_SYNC_ACTIVE</span
              >
            </div>
          </button>
        </div>

        <!-- Tab Panes -->
        <div class="p-8 md:p-10 flex-1">
          <!-- Personal Information Pane -->
          <div v-if="activeTab === 0" class="space-y-8 animate-fade-in-up">
            <!-- Section Card: Personal Data -->
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative overflow-hidden"
            >
              <div class="flex justify-between items-start mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-user text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Personal Information
                  </h3>
                </div>
                <Button
                  v-if="!isLocked"
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="!text-[12px] font-black !text-surface-400 hover:!text-primary-500 uppercase tracking-widest px-4"
                  @click="openEditDialog('Personal Info')"
                />
                <span
                  v-else
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Date of birth</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{ formatDate(profile.dateOfBirth) }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Gender</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ profile.gender || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Marital Status</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ profile.maritalStatus || "-" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Card: Mailing Address -->
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative"
            >
              <div class="flex justify-between items-start mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-map-marker text-xs text-primary-400"></i>
                  <h3
                    class="text-xs font-black text-white uppercase tracking-[0.2em]"
                  >
                    Mailing Address
                  </h3>
                </div>
                <Button
                  v-if="!isLocked"
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="!text-[12px] font-black !text-surface-400 hover:!text-primary-500 uppercase tracking-widest px-4"
                  @click="openEditDialog('Mailing Address')"
                />
                <span
                  v-else
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div class="md:col-span-2 space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Address Line 1</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ mailingAddress.address1 || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Country</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ mailingAddress.country || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >State</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ mailingAddress.state || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >City</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ mailingAddress.city || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Pincode</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase font-mono"
                  >
                    {{ mailingAddress.pincode || "-" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Card: Permanent Address -->
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative"
            >
              <div class="flex justify-between items-start mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-home text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Permanent Address
                  </h3>
                </div>
                <Button
                  v-if="!isLocked"
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="text-[12px]! font-black text-surface-400! hover:text-primary-500! uppercase tracking-widest px-4"
                  @click="openEditDialog('Permanent Address')"
                />
                <span
                  v-else
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div class="md:col-span-2 space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Address Line 1</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ permanentAddress.address1 || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Country</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ permanentAddress.country || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >State</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ permanentAddress.state || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >City</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ permanentAddress.city || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Pincode</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase font-mono"
                  >
                    {{ permanentAddress.pincode || "-" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Card: Passport -->
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative"
            >
              <div class="flex justify-between items-start mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-id-card text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Passport Information
                  </h3>
                </div>
                <Button
                  v-if="!isLocked"
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="text-[12px]! font-black text-surface-400! hover:text-primary-500! uppercase tracking-widest px-4"
                  @click="openEditDialog('Passport Info')"
                />
                <span
                  v-else
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Passport Number</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight font-mono"
                  >
                    {{ profile.passportNo || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Issue Date</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{ formatDate(profile.passportIssueDate) }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Expiry Date</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{ formatDate(profile.passportExpiryDate) }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Issue Country</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{ profile.passportIssueCountry || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >City of Birth</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{ profile.cityOfBirth || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Country of Birth</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{ profile.countryOfBirth || "-" }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Card: Nationality -->
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative"
            >
              <div class="flex justify-between items-start mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-flag text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Nationality & Citizenship
                  </h3>
                </div>
                <Button
                  v-if="!isLocked"
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="text-[12px]! font-black text-surface-400! hover:text-primary-500! uppercase tracking-widest px-4"
                  @click="openEditDialog('Nationality')"
                />
                <span
                  v-else
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Primary Nationality</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ profile.nationality || "-" }}
                  </p>
                </div>
                <div class="space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Citizenship</span
                  >
                  <p
                    class="text-sm font-bold text-white tracking-tight uppercase"
                  >
                    {{ profile.citizenship || "-" }}
                  </p>
                </div>
                <div
                  class="md:col-span-2 space-y-2 border-t border-white/5 pt-6"
                >
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Dual Citizenships</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{
                      profile.otherCitizenships?.length
                        ? profile.otherCitizenships.join(", ")
                        : "None Listed"
                    }}
                  </p>
                </div>
                <div class="md:col-span-2 space-y-2">
                  <span
                    class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                    >Living/Studying in Other Country?</span
                  >
                  <p class="text-sm font-bold text-white tracking-tight">
                    {{
                      profile.livingInOtherCountry
                        ? `Yes, currently in ${profile.currentCountry}`
                        : "No"
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Card: Background Info -->
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative"
            >
              <div class="flex justify-between items-start mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-history text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Background Information
                  </h3>
                </div>
                <Button
                  v-if="!isLocked"
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="text-[12px]! font-black text-surface-400! hover:text-primary-500! uppercase tracking-widest px-4"
                  @click="openEditDialog('Background Info')"
                />
                <span
                  v-else
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span
                      class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                      >Immigration History</span
                    >
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-black"
                      :class="
                        profile.immigrationApplied
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      "
                    >
                      {{ profile.immigrationApplied ? "APPLIED" : "NONE" }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span
                      class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                      >Medical Conditions</span
                    >
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-black"
                      :class="
                        profile.medicalCondition
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      "
                    >
                      {{ profile.medicalCondition ? "DECLARED" : "NO ISSUES" }}
                    </span>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span
                      class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                      >Visa Refusals</span
                    >
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-black"
                      :class="
                        profile.visaRefusal
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      "
                    >
                      {{ profile.visaRefusal ? "REFUSED" : "CLEAN" }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span
                      class="text-[9px] font-black text-surface-500 uppercase tracking-widest"
                      >Criminal Record</span
                    >
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-black"
                      :class="
                        profile.criminalOffence
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      "
                    >
                      {{ profile.criminalOffence ? "RECORDED" : "CLEAN" }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Card: Vital Contacts -->
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative"
            >
              <div class="flex justify-between items-start mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-users text-xs text-primary-400"></i>
                  <h3
                    class="text-xs font-black text-white uppercase tracking-[0.2em]"
                  >
                    Important Contacts
                  </h3>
                </div>
                <Button
                  v-if="!isLocked"
                  label="Edit"
                  icon="pi pi-pencil"
                  size="small"
                  text
                  class="text-[12px]! font-black text-surface-400! hover:text-primary-500! uppercase tracking-widest px-4"
                  @click="openEditDialog('Contacts')"
                />
                <span
                  v-else
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <div class="space-y-8">
                <div
                  v-for="(contact, idx) in profile.emergencyContacts"
                  :key="idx"
                  class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 border-b border-white/5 pb-8 last:border-0 last:pb-0"
                >
                  <div class="space-y-2">
                    <span
                      class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                      >Contact Name</span
                    >
                    <p class="text-sm font-bold text-white tracking-tight">
                      {{ contact.name }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <span
                      class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                      >Relationship</span
                    >
                    <p
                      class="text-sm font-bold text-white tracking-tight uppercase"
                    >
                      {{ contact.relation }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <span
                      class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                      >Phone</span
                    >
                    <p
                      class="text-sm font-bold text-white tracking-tight font-mono"
                    >
                      {{ contact.phone }}
                    </p>
                  </div>
                  <div class="space-y-2">
                    <span
                      class="text-[11px] font-black text-surface-500 uppercase tracking-widest"
                      >Email</span
                    >
                    <p class="text-sm font-bold text-white tracking-tight">
                      {{ contact.email || "-" }}
                    </p>
                  </div>
                </div>
                <div
                  v-if="!profile.emergencyContacts?.length"
                  class="text-center py-6 opacity-40 italic text-[10px] uppercase font-black tracking-widest"
                >
                  No emergency contacts registered
                </div>
              </div>
            </div>
          </div>

          <!-- Academic Qualifications Pane -->
          <div v-else-if="activeTab === 1" class="space-y-8 animate-fade-in-up">
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative overflow-hidden"
            >
              <div class="flex justify-between items-center mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-book text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Academic History
                  </h3>
                </div>
                <span
                  v-if="isLocked"
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <ApplicantEducationHistoryTable
                v-model="formData.educationHistory"
              />

              <div
                v-if="!isLocked"
                class="mt-10 pt-6 border-t border-white/5 flex justify-end"
              >
                <Button
                  label="Save Qualifications"
                  icon="pi pi-check"
                  :loading="isSaving"
                  @click="saveProfile"
                  class="bg-primary-500! text-black! border-0! text-[12px]! font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          <!-- Work Experience Pane -->
          <div v-else-if="activeTab === 2" class="space-y-8 animate-fade-in-up">
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative overflow-hidden"
            >
              <div class="flex justify-between items-center mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-briefcase text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Professional History
                  </h3>
                </div>
                <span
                  v-if="isLocked"
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <ApplicantWorkExperienceTable v-model="formData.workExperience" />

              <div
                v-if="!isLocked"
                class="mt-10 pt-6 border-t border-white/5 flex justify-end"
              >
                <Button
                  label="Save Work Experience"
                  icon="pi pi-check"
                  :loading="isSaving"
                  @click="saveProfile"
                  class="bg-primary-500! text-black! border-0! text-[12px]! font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          <!-- Tests Pane -->
          <div v-else-if="activeTab === 3" class="space-y-8 animate-fade-in-up">
            <div
              class="bg-white/[0.02] rounded-3xl border border-white/5 p-8 relative overflow-hidden"
            >
              <div class="flex justify-between items-center mb-10">
                <div
                  class="px-5 py-2 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <i class="pi pi-check-square text-xs text-primary-400"></i>
                  <h3
                    class="text-sm font-black text-white uppercase tracking-[0.2em]"
                  >
                    Standardized Tests
                  </h3>
                </div>
                <span
                  v-if="isLocked"
                  class="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic flex items-center gap-2"
                >
                  <i class="pi pi-verified text-[10px]"></i> Verified Record
                </span>
              </div>

              <ApplicantTestsTable v-model="formData.englishProficiency" />

              <div
                v-if="!isLocked"
                class="mt-10 pt-6 border-t border-white/5 flex justify-end"
              >
                <Button
                  label="Save Test Scores"
                  icon="pi pi-check"
                  :loading="isSaving"
                  @click="saveProfile"
                  class="bg-primary-500! text-black! border-0! text-[12px]! font-black uppercase tracking-widest px-8 py-3 rounded-xl shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <Dialog
      v-model:visible="editDialogVisible"
      :header="`Update ${editingSection}`"
      modal
      class="max-w-2xl w-full backdrop-blur-3xl bg-surface-950/90 border border-white/10"
    >
      <!-- ... same as before but ensure locked check ... -->
      <div
        v-if="editingSection === 'Personal Info'"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >First Name</label
          >
          <InputText
            v-model="formData.firstName"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Last Name</label
          >
          <InputText
            v-model="formData.lastName"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Date of Birth</label
          >
          <Calendar v-model="formData.dateOfBirth" class="w-full" showIcon />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Gender</label
          >
          <Dropdown
            v-model="formData.gender"
            :options="['Male', 'Female', 'Other']"
            class="w-full"
          />
        </div>
      </div>

      <div
        v-else-if="editingSection === 'Permanent Address'"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        <div class="md:col-span-2 space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Address Line 1</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'PERMANENT').address1"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Country</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'PERMANENT').country"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >State</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'PERMANENT').state"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >City</label
          >
          <InputText
            v-model="
              formData.addresses.find((a: any) => a.type === 'PERMANENT').city
            "
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Pincode</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'PERMANENT').pincode"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
      </div>

      <div
        v-else-if="editingSection === 'Mailing Address'"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        <div class="md:col-span-2 space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Address Line 1</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'MAILING').address1"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Country</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'MAILING').country"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >State</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'MAILING').state"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >City</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'MAILING').city"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[11px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Pincode</label
          >
          <InputText
            v-model="formData.addresses.find((a: any) => a.type === 'MAILING').pincode"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
      </div>

      <div
        v-else-if="editingSection === 'Nationality'"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Primary Nationality</label
          >
          <InputText
            v-model="formData.nationality"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Citizenship</label
          >
          <InputText
            v-model="formData.citizenship"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="md:col-span-2 space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Dual Citizenships</label
          >
          <Chips
            v-model="formData.otherCitizenships"
            separator=","
            placeholder="Type and press Enter (e.g. USA, Canada)"
            class="w-full"
          />
        </div>
        <div class="md:col-span-2 space-y-3 pt-4 border-t border-white/5">
          <div class="flex items-center gap-3">
            <Checkbox
              v-model="formData.livingInOtherCountry"
              binary
              inputId="lvOther"
            />
            <label
              for="lvOther"
              class="text-[10px] font-black text-white uppercase tracking-widest"
              >Are you living/studying in another country?</label
            >
          </div>
          <InputText
            v-if="formData.livingInOtherCountry"
            v-model="formData.currentCountry"
            placeholder="Which Country?"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
      </div>

      <div
        v-else-if="editingSection === 'Background Info'"
        class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4"
      >
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <Checkbox
              v-model="formData.immigrationApplied"
              binary
              inputId="imm"
            />
            <label
              for="imm"
              class="text-[9px] font-black text-white uppercase tracking-widest"
              >Applied for immigration?</label
            >
          </div>
          <div class="flex items-center gap-3">
            <Checkbox
              v-model="formData.medicalCondition"
              binary
              inputId="med"
            />
            <label
              for="med"
              class="text-[9px] font-black text-white uppercase tracking-widest"
              >Medical Condition?</label
            >
          </div>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <Checkbox v-model="formData.visaRefusal" binary inputId="visa" />
            <label
              for="visa"
              class="text-[9px] font-black text-white uppercase tracking-widest"
              >Any Visa Refusals?</label
            >
          </div>
          <div class="flex items-center gap-3">
            <Checkbox
              v-model="formData.criminalOffence"
              binary
              inputId="crim"
            />
            <label
              for="crim"
              class="text-[9px] font-black text-white uppercase tracking-widest"
              >Criminal Record?</label
            >
          </div>
        </div>
      </div>

      <div v-else-if="editingSection === 'Contacts'" class="space-y-6 mt-4">
        <div
          v-for="(contact, idx) in formData.emergencyContacts"
          :key="idx"
          class="p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label
                class="text-[8px] font-black text-surface-500 uppercase ml-1"
                >Name</label
              >
              <InputText
                v-model="contact.name"
                class="w-full !bg-white/[0.01] !border-white/10 !text-white rounded-lg py-3 text-xs"
              />
            </div>
            <div class="space-y-1">
              <label
                class="text-[8px] font-black text-surface-500 uppercase ml-1"
                >Relation</label
              >
              <InputText
                v-model="contact.relation"
                class="w-full !bg-white/[0.01] !border-white/10 !text-white rounded-lg py-3 text-xs"
              />
            </div>
            <div class="space-y-1">
              <label
                class="text-[8px] font-black text-surface-500 uppercase ml-1"
                >Phone</label
              >
              <InputText
                v-model="contact.phone"
                class="w-full !bg-white/[0.01] !border-white/10 !text-white rounded-lg py-3 text-xs font-mono"
              />
            </div>
            <div class="space-y-1">
              <label
                class="text-[8px] font-black text-surface-500 uppercase ml-1"
                >Email</label
              >
              <InputText
                v-model="contact.email"
                class="w-full !bg-white/[0.01] !border-white/10 !text-white rounded-lg py-3 text-xs"
              />
            </div>
          </div>
          <Button
            v-if="formData.emergencyContacts.length > 1"
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            class="absolute top-2 right-2 !w-8 !h-8"
            @click="formData.emergencyContacts.splice(idx, 1)"
          />
        </div>
        <Button
          icon="pi pi-plus"
          label="Add Another Contact"
          text
          class="!text-primary-400 !text-[9px] font-black uppercase tracking-widest"
          @click="
            formData.emergencyContacts.push({
              name: '',
              phone: '',
              relation: '',
              email: '',
            })
          "
        />
      </div>

      <div
        v-else-if="editingSection === 'Academic Qualifications'"
        class="mt-4"
      >
        <ApplicantEducationHistoryTable v-model="formData.educationHistory" />
      </div>

      <!-- Passport Info Fields -->
      <div
        v-else-if="editingSection === 'Passport Info'"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        <!-- ... (Passport fields remain same) ... -->
        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Passport Number</label
          >
          <InputText
            v-model="formData.passportNo"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Issue Country</label
          >
          <InputText
            v-model="formData.passportIssueCountry"
            class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Issue Date</label
          >
          <Calendar
            v-model="formData.passportIssueDate"
            class="w-full"
            showIcon
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Expiry Date</label
          >
          <Calendar
            v-model="formData.passportExpiryDate"
            class="w-full"
            showIcon
          />
        </div>
        <div
          class="space-y-2 pt-4 border-t border-white/5 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div class="space-y-2">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >City of Birth</label
            >
            <InputText
              v-model="formData.cityOfBirth"
              class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-[9px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Country of Birth</label
            >
            <InputText
              v-model="formData.countryOfBirth"
              class="w-full !bg-white/[0.02] !border-white/10 !text-white rounded-xl py-4"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 mt-6">
          <Button
            label="Cancel"
            text
            class="!text-surface-500 uppercase tracking-widest text-[10px] font-black"
            @click="editDialogVisible = false"
          />
          <Button
            label="Save Intelligence"
            icon="pi pi-check"
            :loading="isSaving"
            @click="saveProfile"
            class="!bg-primary-500 !text-black !border-0 !text-[10px] font-black uppercase tracking-widest px-6 rounded-xl"
          />
        </div>
      </template>
    </Dialog>

    <!-- Profile Unlock Request Dialog -->
    <Dialog
      v-model:visible="unlockDialogVisible"
      modal
      header="Request Profile Modification"
      :style="{ width: '450px' }"
      class="border border-white/10 !bg-surface-950/90 backdrop-blur-2xl rounded-3xl"
    >
      <div class="space-y-6 py-4">
        <div
          class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4"
        >
          <i class="pi pi-exclamation-triangle text-amber-500 mt-1"></i>
          <p class="text-[12px] font-medium text-surface-300 leading-relaxed">
            Your profile is currently verified and locked. Requesting an unlock
            will notify the administration. Please provide a valid reason for
            the requested changes.
          </p>
        </div>

        <div class="space-y-2">
          <label
            class="text-[12px] font-black text-surface-500 uppercase tracking-widest"
            >Provide Reason for Data Modification</label
          >
          <Textarea
            v-model="unlockReason"
            rows="5"
            autoResize
            class="w-full !bg-white/[0.03] !border-white/10 !text-white rounded-2xl p-4 text-sm"
            placeholder="Example: Need to update my phone number or fix a typo in my passport number..."
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 mt-4">
          <Button
            label="Dismiss"
            text
            class="!text-surface-500 uppercase tracking-widest text-[12px] font-black"
            @click="unlockDialogVisible = false"
          />
          <Button
            label="Submit Request"
            icon="pi pi-send"
            :loading="isRequestingUnlock"
            @click="submitUnlockRequest"
            class="!bg-amber-500 !text-black !border-0 !text-[12px] font-black uppercase tracking-widest px-6 rounded-xl"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(40px) saturate(180%);
}
h1,
h2,
h3,
h4 {
  font-family: "Outfit", "Inter", sans-serif;
}

:deep(.p-calendar .p-inputtext) {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 0.75rem;
  padding: 1rem;
}

:deep(.p-dropdown) {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 0.75rem;
}

:deep(.p-dialog-header),
:deep(.p-dialog-content),
:deep(.p-dialog-footer) {
  background: transparent;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.2, 0, 0, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
