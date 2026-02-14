<script setup lang="ts">
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
  validate: (route) => {
    return typeof route.params.id === "string";
  },
});

const route = useRoute();
const toast = useToast();
const { user: sessionUser } = useUserSession();
const userId = route.params.id as string;

const canResetPassword = computed(() => {
  return (
    sessionUser.value?.roleCode === "super_admin" ||
    sessionUser.value?.permissions?.includes("user:manage")
  );
});

interface User {
  id: string;
  email: string;
  createdAt: string | Date;
  role: {
    name: string;
  };
  applicantProfile: {
    firstName: string;
    lastName: string;
    passportNo: string;
    nationality: string;
    phone?: string;
    dateOfBirth?: string | Date;
    gender?: string;
    maritalStatus?: string;
    passportIssueDate?: string | Date;
    passportExpiryDate?: string | Date;
    passportIssueCountry?: string;
    cityOfBirth?: string;
    countryOfBirth?: string;
    citizenship?: string;
    otherCitizenships?: string[];
    livingInOtherCountry?: boolean;
    currentCountry?: string;
    immigrationApplied?: boolean;
    medicalCondition?: boolean;
    visaRefusal?: boolean;
    criminalOffence?: boolean;
    addresses?: any[];
    emergencyContacts?: any[];
    educationHistory?: any[];
    workExperience?: any[];
    englishProficiency?: any[];
  } | null;
}

// Fetch User Data with all relations
const {
  data: user,
  pending,
  error,
  refresh,
} = useFetch<User>(`/api/admin/users/${userId}`);

// -- Computed Helpers --

const applicant = computed<any>(() => user.value?.applicantProfile || {});

const fullName = computed(() =>
  applicant.value.firstName
    ? `${applicant.value.firstName} ${applicant.value.lastName}`
    : "Unknown User"
);

const initials = computed(() => {
  const name = fullName.value;
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
});

const mailingAddress = computed(
  () => applicant.value.addresses?.find((a: any) => a.type === "MAILING") || {}
);

const permanentAddress = computed(
  () =>
    applicant.value.addresses?.find((a: any) => a.type === "PERMANENT") || {}
);

// Formatters
const formatDate = (date: string | Date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY style
};

const copyLink = () => {
  // Placeholder for actual student platform link
  navigator.clipboard.writeText(`https://student.unireach.os/login`);
  toast.add({
    severity: "success",
    summary: "Copied",
    detail: "Student Platform Link copied",
    life: 2000,
  });
};

// Editing Logic
const editDialogVisible = ref(false);
const editingSection = ref("");
const formData = ref<any>({});

const openEditDialog = (section: string) => {
  editingSection.value = section;
  // Deep clone to avoid mutating reactive state directly
  formData.value = JSON.parse(JSON.stringify(applicant.value));

  // Ensure nested arrays exist
  if (!formData.value.addresses) formData.value.addresses = [];
  if (!formData.value.educationHistory) formData.value.educationHistory = [];
  if (!formData.value.workExperience) formData.value.workExperience = [];
  if (!formData.value.englishProficiency)
    formData.value.englishProficiency = [];
  if (!formData.value.emergencyContacts) formData.value.emergencyContacts = [];

  // Initialize specific address types if missing
  if (
    section === "Mailing Address" &&
    !formData.value.addresses.find((a: any) => a.type === "MAILING")
  ) {
    formData.value.addresses.push({ type: "MAILING" });
  }
  if (
    section === "Permanent Address" &&
    !formData.value.addresses.find((a: any) => a.type === "PERMANENT")
  ) {
    formData.value.addresses.push({ type: "PERMANENT" });
  }

  // Initialize specific list items if missing for list-based sections
  if (
    section === "Contacts" &&
    (!formData.value.emergencyContacts ||
      formData.value.emergencyContacts.length === 0)
  ) {
    formData.value.emergencyContacts = [{ name: "", phone: "", relation: "" }];
  }

  // Convert dates for Calendar component
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

  editDialogVisible.value = true;
};

// --- Password Reset ---
const passwordDialogVisible = ref(false);
const newPassword = ref("");

const handleResetPassword = async () => {
  if (newPassword.value.length < 8) {
    toast.add({
      severity: "warn",
      summary: "Weak Password",
      detail: "Password must be at least 8 characters.",
      life: 3000,
    });
    return;
  }

  try {
    await $fetch(`/api/admin/users/${userId}/reset-password`, {
      method: "POST",
      body: { password: newPassword.value },
    });
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Password reset successfully",
      life: 3000,
    });
    passwordDialogVisible.value = false;
    newPassword.value = "";
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.statusMessage || "Failed to reset password",
      life: 3000,
    });
  }
};

// --- Account Status ---
const statusOptions = [
  { label: "Active", value: "ACTIVE", severity: "success" },
  { label: "Suspended", value: "SUSPENDED", severity: "danger" },
  { label: "Deactivated", value: "DEACTIVATED", severity: "secondary" },
  {
    label: "Pending Verification",
    value: "PENDING_VERIFICATION",
    severity: "warn",
  },
];

const statusUpdating = ref(false);

const updateStatus = async (newStatus: string) => {
  if (newStatus === user.value?.status) return;
  statusUpdating.value = true;

  try {
    await $fetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      body: { status: newStatus },
    });
    toast.add({
      severity: "success",
      summary: "Status Updated",
      detail: `User status changed to ${newStatus}`,
      life: 3000,
    });
    refresh();
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Update Failed",
      detail: err.statusMessage || "Action failed",
      life: 3000,
    });
  } finally {
    statusUpdating.value = false;
  }
};

const saveProfile = async () => {
  try {
    await $fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      body: { applicantProfile: formData.value },
    });

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Profile updated successfully",
      life: 3000,
    });
    editDialogVisible.value = false;
    refresh();
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.message || "Failed to update profile",
      life: 3000,
    });
  }
};

// Tabs
const activeTab = ref(0);
const items = ref([
  { label: "Personal Information", icon: "pi pi-user" },
  { label: "Academic Qualifications", icon: "pi pi-book" },
  { label: "Work Experience", icon: "pi pi-briefcase" },
  { label: "Tests", icon: "pi pi-check-square" },
]);
</script>

<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center gap-2 text-sm text-surface-400 mb-1">
          <NuxtLink
            to="/dashboard/user/applicants"
            class="hover:text-white transition-colors"
          >
            STUDENTS
          </NuxtLink>
          <i class="pi pi-angle-right text-xs" />
          <span class="text-white font-medium">{{ fullName }}</span>
        </div>
        <h1
          class="text-3xl font-black text-white tracking-tight uppercase italic"
        >
          Applicant Profile
        </h1>
      </div>
      <div class="flex items-center gap-3">
        <Button
          v-if="canResetPassword"
          label="Reset Password"
          icon="pi pi-key"
          severity="warn"
          text
          size="small"
          @click="passwordDialogVisible = true"
        />

        <div
          class="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg"
        >
          <span
            class="text-[10px] uppercase font-bold text-surface-400 tracking-tighter"
            >Status</span
          >
          <Dropdown
            :modelValue="user?.status"
            @update:modelValue="updateStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Status"
            :loading="statusUpdating"
            :disabled="statusUpdating"
            class="w-40 border-0 bg-transparent text-sm h-8 flex items-center shadow-none focus:ring-0"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center gap-2">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="
                    statusOptions.find((o) => o.value === slotProps.value)
                      ?.severity === 'success'
                      ? 'bg-emerald-500'
                      : statusOptions.find((o) => o.value === slotProps.value)
                          ?.severity === 'danger'
                      ? 'bg-red-500'
                      : statusOptions.find((o) => o.value === slotProps.value)
                          ?.severity === 'warn'
                      ? 'bg-amber-500'
                      : 'bg-surface-500'
                  "
                ></div>
                <span class="font-bold border-0">{{
                  statusOptions.find((o) => o.value === slotProps.value)?.label
                }}</span>
              </div>
            </template>
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="
                    slotProps.option.severity === 'success'
                      ? 'bg-emerald-500'
                      : slotProps.option.severity === 'danger'
                      ? 'bg-red-500'
                      : slotProps.option.severity === 'warn'
                      ? 'bg-amber-500'
                      : 'bg-surface-500'
                  "
                ></div>
                <span>{{ slotProps.option.label }}</span>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>

    <div v-if="pending" class="space-y-6">
      <Skeleton height="10rem" class="rounded-2xl bg-white/5" />
      <Skeleton height="40rem" class="rounded-2xl bg-white/5" />
    </div>

    <div
      v-else-if="error"
      class="card bg-red-500/10 border-red-500/20 p-8 text-center rounded-2xl"
    >
      <i class="pi pi-exclamation-circle text-4xl text-red-400 mb-4" />
      <h2 class="text-xl font-bold text-white mb-2">Failed to Load Profile</h2>
      <p class="text-red-300 mb-6">{{ error.message }}</p>
      <Button
        label="Retry"
        icon="pi pi-refresh"
        severity="danger"
        @click="() => refresh()"
      />
    </div>

    <div v-else class="space-y-6 animate-fade-in-up">
      <!-- Top Identity Card -->
      <div
        class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center gap-6"
      >
        <Avatar
          :label="initials"
          size="xlarge"
          shape="circle"
          class="bg-linear-to-br from-primary-500 to-primary-700 text-white font-bold w-24! h-24! text-3xl shadow-lg border-4 border-white/10"
        />
        <div class="flex-1 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-3">
            <h2 class="text-2xl font-bold text-white">{{ fullName }}</h2>
            <div
              class="px-2 py-0.5 rounded text-[10px] font-black uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            >
              Active
            </div>
          </div>
          <p class="text-surface-400 text-sm mt-1">{{ user?.email }}</p>
          <div
            class="flex flex-wrap gap-4 mt-4 justify-center md:justify-start"
          >
            <div class="flex items-center gap-2 text-xs text-surface-300">
              <i class="pi pi-id-card text-primary-400" />
              <span>ID: {{ applicant.passportNo || "N/A" }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-surface-300">
              <i class="pi pi-map-marker text-primary-400" />
              <span>{{ applicant.nationality || "Unknown" }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-surface-300">
              <i class="pi pi-calendar text-primary-400" />
              <span
                >Joined
                {{
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"
                }}</span
              >
            </div>
          </div>
        </div>

        <!-- Stepper Visualization (Glass) -->
        <div
          class="hidden lg:flex flex-1 max-w-md items-center justify-between px-8 relative"
        >
          <!-- Line -->
          <div
            class="absolute left-10 right-10 top-4 h-0.5 bg-white/10 -z-0"
          ></div>

          <!-- Steps -->
          <div class="flex flex-col items-center gap-2 z-10">
            <div
              class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold ring-4 ring-surface-900"
            >
              1
            </div>
            <span class="text-xs font-medium text-white">Profile</span>
          </div>
          <div class="flex flex-col items-center gap-2 z-10">
            <div
              class="w-8 h-8 rounded-full bg-surface-800 text-surface-400 flex items-center justify-center text-sm font-bold ring-4 ring-surface-900 border border-white/10"
            >
              2
            </div>
            <span class="text-xs font-medium text-surface-500"
              >Applications</span
            >
          </div>
          <div class="flex flex-col items-center gap-2 z-10">
            <div
              class="w-8 h-8 rounded-full bg-surface-800 text-surface-400 flex items-center justify-center text-sm font-bold ring-4 ring-surface-900 border border-white/10"
            >
              3
            </div>
            <span class="text-xs font-medium text-surface-500">Documents</span>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div
        class="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md min-h-[600px]"
      >
        <!-- Tabs Header -->
        <div class="flex border-b border-white/10 overflow-x-auto">
          <button
            v-for="(tab, index) in items"
            :key="index"
            @click="activeTab = index"
            class="px-8 py-5 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap outline-none focus:outline-none"
            :class="
              activeTab === index
                ? 'border-primary-500 text-primary-400 bg-white/5'
                : 'border-transparent text-surface-400 hover:text-white hover:bg-white/5'
            "
          >
            <div class="flex flex-col items-start gap-1">
              <span class="flex items-center gap-2">{{ tab.label }}</span>
              <span
                v-if="activeTab === index"
                class="text-[10px] text-emerald-400 font-medium uppercase tracking-wider"
                >Active</span
              >
            </div>
          </button>
        </div>

        <!-- Pane 1: Personal Information -->
        <div v-show="activeTab === 0" class="p-8 space-y-8">
          <!-- Section: Personal Info -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-user text-sm text-primary-400" /> Personal
                Information
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Personal Info')"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Date of birth</span
                >
                <span class="text-white font-medium">{{
                  formatDate(applicant.dateOfBirth) || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Gender</span
                >
                <span class="text-white font-medium">{{
                  applicant.gender || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Marital Status</span
                >
                <span class="text-white font-medium">{{
                  applicant.maritalStatus || "-"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Mailing Address -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-map-marker text-sm text-primary-400" /> Mailing
                Address
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Mailing Address')"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div class="flex flex-col gap-1 md:col-span-2">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Address Line 1</span
                >
                <span class="text-white font-medium">{{
                  mailingAddress.address1 || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Country</span
                >
                <span class="text-white font-medium">{{
                  mailingAddress.country || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >State</span
                >
                <span class="text-white font-medium">{{
                  mailingAddress.state || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >City</span
                >
                <span class="text-white font-medium">{{
                  mailingAddress.city || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Pincode</span
                >
                <span class="text-white font-medium">{{
                  mailingAddress.pincode || "-"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Permanent Address -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-home text-sm text-primary-400" /> Permanent
                Address
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Permanent Address')"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div class="flex flex-col gap-1 md:col-span-2">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Address Line 1</span
                >
                <span class="text-white font-medium">{{
                  permanentAddress.address1 || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Country</span
                >
                <span class="text-white font-medium">{{
                  permanentAddress.country || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >State</span
                >
                <span class="text-white font-medium">{{
                  permanentAddress.state || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >City</span
                >
                <span class="text-white font-medium">{{
                  permanentAddress.city || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Pincode</span
                >
                <span class="text-white font-medium">{{
                  permanentAddress.pincode || "-"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Passport Information -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-id-card text-sm text-primary-400" /> Passport
                Information
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Passport Info')"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Passport Number</span
                >
                <span class="text-white font-medium font-mono">{{
                  applicant.passportNo || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Issue Date</span
                >
                <span class="text-white font-medium">{{
                  formatDate(applicant.passportIssueDate) || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Expiry Date</span
                >
                <span class="text-white font-medium">{{
                  formatDate(applicant.passportExpiryDate) || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Issue Country</span
                >
                <span class="text-white font-medium">{{
                  applicant.passportIssueCountry || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >City of Birth</span
                >
                <span class="text-white font-medium">{{
                  applicant.cityOfBirth || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Country of Birth</span
                >
                <span class="text-white font-medium">{{
                  applicant.countryOfBirth || "-"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Nationality -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-flag text-sm text-primary-400" /> Nationality
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Nationality')"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Nationality</span
                >
                <span class="text-white font-medium">{{
                  applicant.nationality || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Citizenship</span
                >
                <span class="text-white font-medium">{{
                  applicant.citizenship || "-"
                }}</span>
              </div>
              <div class="flex flex-col gap-1 md:col-span-2">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Is the applicant a citizen of more than one country?</span
                >
                <span class="text-white font-medium">{{
                  applicant.otherCitizenships?.length > 0
                    ? applicant.otherCitizenships.join(", ")
                    : "No"
                }}</span>
              </div>
              <div class="flex flex-col gap-1 md:col-span-2">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Is the applicant living and studying in any other
                  country?</span
                >
                <span class="text-white font-medium">
                  {{
                    applicant.livingInOtherCountry
                      ? `Yes, in ${applicant.currentCountry}`
                      : "No"
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Section: Background Info -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-info-circle text-sm text-primary-400" />
                Background Info
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Background Info')"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Has applicant applied for immigration?</span
                >
                <span class="text-white font-medium">{{
                  applicant.immigrationApplied ? "Yes" : "No"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Serious medical condition?</span
                >
                <span class="text-white font-medium">{{
                  applicant.medicalCondition ? "Yes" : "No"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Visa refusal?</span
                >
                <span class="text-white font-medium">{{
                  applicant.visaRefusal ? "Yes" : "No"
                }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span
                  class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                  >Criminal offence?</span
                >
                <span class="text-white font-medium">{{
                  applicant.criminalOffence ? "Yes" : "No"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Important Contacts -->
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-users text-sm text-primary-400" /> Important
                Contacts
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Contacts')"
              />
            </div>

            <div class="space-y-6">
              <div
                v-for="(contact, idx) in applicant.emergencyContacts"
                :key="idx"
                class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 border-b border-white/10 pb-4 last:border-0 last:pb-0"
              >
                <h4 class="md:col-span-2 font-bold text-sm text-surface-300">
                  Emergency Contact {{ idx + 1 }}
                </h4>
                <div class="flex flex-col gap-1">
                  <span
                    class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                    >Name</span
                  >
                  <span class="text-white font-medium">{{ contact.name }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span
                    class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                    >Phone</span
                  >
                  <span class="text-white font-medium">{{
                    contact.phone
                  }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span
                    class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                    >Email</span
                  >
                  <span class="text-white font-medium">{{
                    contact.email || "-"
                  }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span
                    class="text-xs text-surface-400 uppercase font-bold tracking-wider"
                    >Relation</span
                  >
                  <span class="text-white font-medium">{{
                    contact.relation
                  }}</span>
                </div>
              </div>
              <div
                v-if="!applicant.emergencyContacts?.length"
                class="text-surface-500 italic text-sm"
              >
                No emergency contacts listed.
              </div>
            </div>
          </div>
        </div>

        <!-- Pane 2: Academic Qualifications -->
        <div v-show="activeTab === 1" class="p-8 space-y-8">
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-book text-sm text-primary-400" /> Academic
                Qualifications
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Academic Info')"
              />
            </div>

            <div class="space-y-6">
              <div
                v-for="(edu, idx) in applicant.educationHistory"
                :key="idx"
                class="border-b border-white/10 pb-6 last:border-0 last:pb-0"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-white font-bold text-lg">
                      {{ edu.qualification || "Unknown Qualification" }}
                    </h4>
                    <p class="text-surface-400 text-sm">
                      {{ edu.institution || "Unknown Institution" }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p
                      class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-500/10 text-primary-400 mb-1"
                    >
                      {{ edu.grade || "N/A" }}
                    </p>
                    <p class="text-surface-500 text-xs text-nowrap">
                      {{ formatDate(edu.startDate) }} -
                      {{ formatDate(edu.endDate) }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-if="!applicant.educationHistory?.length"
                class="text-surface-500 italic text-sm text-center py-4"
              >
                No academic qualifications listed.
              </div>
            </div>
          </div>
        </div>

        <!-- Pane 3: Work Experience -->
        <div v-show="activeTab === 2" class="p-8 space-y-8">
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-briefcase text-sm text-primary-400" /> Work
                Experience
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('Work Experience')"
              />
            </div>

            <div class="space-y-6">
              <div
                v-for="(job, idx) in applicant.workExperience"
                :key="idx"
                class="border-b border-white/10 pb-6 last:border-0 last:pb-0"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-white font-bold text-lg">
                      {{ job.title || "Unknown Title" }}
                    </h4>
                    <p class="text-surface-400 text-sm">
                      {{ job.employer || "Unknown Employer" }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-surface-500 text-xs text-nowrap">
                      {{ formatDate(job.startDate) }} -
                      {{ job.endDate ? formatDate(job.endDate) : "Present" }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-if="!applicant.workExperience?.length"
                class="text-surface-500 italic text-sm text-center py-4"
              >
                No work experience listed.
              </div>
            </div>
          </div>
        </div>

        <!-- Pane 4: Tests -->
        <div v-show="activeTab === 3" class="p-8 space-y-8">
          <div class="bg-white/5 rounded-xl border border-white/10 p-6">
            <div class="flex justify-between items-start mb-6">
              <h3
                class="flex items-center gap-2 text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10"
              >
                <i class="pi pi-check-square text-sm text-primary-400" />
                English Proficiency
              </h3>
              <Button
                label="Edit"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                class="text-xs! py-1! px-3!"
                @click="openEditDialog('English Proficiency')"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="(test, idx) in applicant.englishProficiency"
                :key="idx"
                class="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h4 class="text-white font-bold text-lg">
                      {{ test.testName || "Unknown Test" }}
                    </h4>
                    <p class="text-surface-400 text-xs">
                      Taken on {{ formatDate(test.dateTaken) }}
                    </p>
                  </div>
                  <div
                    class="bg-primary-500/20 text-primary-400 px-3 py-1 rounded font-black text-lg border border-primary-500/30"
                  >
                    {{ test.overallScore }}
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="bg-white/5 p-2 rounded flex justify-between">
                    <span class="text-surface-400">Listening</span>
                    <span class="text-white font-bold">{{
                      test.listeningScore
                    }}</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded flex justify-between">
                    <span class="text-surface-400">Reading</span>
                    <span class="text-white font-bold">{{
                      test.readingScore
                    }}</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded flex justify-between">
                    <span class="text-surface-400">Speaking</span>
                    <span class="text-white font-bold">{{
                      test.speakingScore
                    }}</span>
                  </div>
                  <div class="bg-white/5 p-2 rounded flex justify-between">
                    <span class="text-surface-400">Writing</span>
                    <span class="text-white font-bold">{{
                      test.writingScore
                    }}</span>
                  </div>
                  <div
                    v-if="test.trfNumber"
                    class="col-span-2 mt-2 text-[10px] text-surface-500 text-center font-mono"
                  >
                    TRF: {{ test.trfNumber }}
                  </div>
                </div>
              </div>

              <div
                v-if="!applicant.englishProficiency?.length"
                class="col-span-1 md:col-span-2 text-surface-500 italic text-sm text-center py-4"
              >
                No English proficiency tests listed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Edit Dialog -->
  <Dialog
    v-model:visible="editDialogVisible"
    :header="`Edit ${editingSection}`"
    modal
    class="w-full max-w-2xl"
    :draggable="false"
    :dismissableMask="true"
  >
    <div
      v-if="editingSection === 'Personal Info'"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">First Name</label>
        <InputText v-model="formData.firstName" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Last Name</label>
        <InputText v-model="formData.lastName" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Date of Birth</label>
        <Calendar
          v-model="formData.dateOfBirth"
          dateFormat="dd/mm/yy"
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Gender</label>
        <Dropdown
          v-model="formData.gender"
          :options="['Male', 'Female', 'Other']"
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Marital Status</label>
        <Dropdown
          v-model="formData.maritalStatus"
          :options="['Single', 'Married', 'Divorced']"
          class="w-full"
        />
      </div>
    </div>

    <div v-else-if="editingSection === 'Mailing Address'">
      <div v-for="(addr, idx) in formData.addresses" :key="idx">
        <div
          v-if="addr.type === 'MAILING'"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div class="flex flex-col gap-2 col-span-2">
            <label class="text-sm font-bold text-surface-400"
              >Address Line 1</label
            >
            <InputText v-model="addr.address1" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">City</label>
            <InputText v-model="addr.city" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">State</label>
            <InputText v-model="addr.state" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">Pincode</label>
            <InputText v-model="addr.pincode" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">Country</label>
            <InputText v-model="addr.country" class="w-full" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="editingSection === 'Permanent Address'">
      <div v-for="(addr, idx) in formData.addresses" :key="idx">
        <div
          v-if="addr.type === 'PERMANENT'"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div class="flex flex-col gap-2 col-span-2">
            <label class="text-sm font-bold text-surface-400"
              >Address Line 1</label
            >
            <InputText v-model="addr.address1" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">City</label>
            <InputText v-model="addr.city" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">State</label>
            <InputText v-model="addr.state" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">Pincode</label>
            <InputText v-model="addr.pincode" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-surface-400">Country</label>
            <InputText v-model="addr.country" class="w-full" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="editingSection === 'Passport Info'"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400"
          >Passport Number</label
        >
        <InputText v-model="formData.passportNo" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Issue Date</label>
        <Calendar
          v-model="formData.passportIssueDate"
          dateFormat="dd/mm/yy"
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Expiry Date</label>
        <Calendar
          v-model="formData.passportExpiryDate"
          dateFormat="dd/mm/yy"
          class="w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Issue Country</label>
        <InputText v-model="formData.passportIssueCountry" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">City of Birth</label>
        <InputText v-model="formData.cityOfBirth" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400"
          >Country of Birth</label
        >
        <InputText v-model="formData.countryOfBirth" class="w-full" />
      </div>
    </div>

    <div
      v-else-if="editingSection === 'Nationality'"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Nationality</label>
        <InputText v-model="formData.nationality" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">Citizenship</label>
        <InputText v-model="formData.citizenship" class="w-full" />
      </div>
    </div>

    <div
      v-else-if="editingSection === 'Background Info'"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="formData.immigrationApplied"
            binary
            inputId="imm"
          />
          <label for="imm" class="text-sm font-medium"
            >Has applicant applied for immigration?</label
          >
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox v-model="formData.medicalCondition" binary inputId="med" />
          <label for="med" class="text-sm font-medium"
            >Serious medical condition?</label
          >
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox v-model="formData.visaRefusal" binary inputId="visa" />
          <label for="visa" class="text-sm font-medium">Visa refusal?</label>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox v-model="formData.criminalOffence" binary inputId="crim" />
          <label for="crim" class="text-sm font-medium"
            >Criminal offence?</label
          >
        </div>
      </div>
    </div>

    <div v-else-if="editingSection === 'Contacts'" class="space-y-6">
      <div
        v-for="(contact, idx) in formData.emergencyContacts"
        :key="idx"
        class="p-4 bg-white/5 rounded-xl border border-white/10 relative"
      >
        <h4
          class="text-xs font-bold text-primary-400 uppercase tracking-widest mb-4"
        >
          Emergency Contact #{{ idx + 1 }}
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-surface-400 uppercase"
              >Full Name</label
            >
            <InputText
              v-model="contact.name"
              placeholder="Contact Name"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-surface-400 uppercase"
              >Relationship</label
            >
            <InputText
              v-model="contact.relation"
              placeholder="e.g. Father, Spouse"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-surface-400 uppercase"
              >Phone Number</label
            >
            <InputText
              v-model="contact.phone"
              placeholder="+1234567890"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-surface-400 uppercase"
              >Email Address (Optional)</label
            >
            <InputText
              v-model="contact.email"
              placeholder="email@example.com"
              class="w-full"
            />
          </div>
        </div>
        <Button
          v-if="formData.emergencyContacts.length > 1"
          icon="pi pi-trash"
          severity="danger"
          text
          rounded
          class="absolute top-2 right-2"
          @click="formData.emergencyContacts.splice(idx, 1)"
        />
      </div>
      <Button
        label="Add More Contact"
        icon="pi pi-plus"
        size="small"
        text
        @click="
          formData.emergencyContacts.push({ name: '', phone: '', relation: '' })
        "
      />
    </div>

    <div v-else class="text-center py-8 flex flex-col items-center">
      <i
        class="pi pi-briefcase text-4xl text-surface-500 mb-3"
        v-if="editingSection.includes('Work')"
      ></i>
      <i
        class="pi pi-book text-4xl text-surface-500 mb-3"
        v-else-if="editingSection.includes('Academic')"
      ></i>
      <i
        class="pi pi-globe text-4xl text-surface-500 mb-3"
        v-else-if="editingSection.includes('English')"
      ></i>
      <i
        class="pi pi-users text-4xl text-surface-500 mb-3"
        v-else-if="editingSection.includes('Contacts')"
      ></i>
      <i class="pi pi-pencil text-4xl text-surface-500 mb-3" v-else></i>
      <p class="text-surface-400 italic">
        Editing for <strong>{{ editingSection }}</strong> is currently handling
        complex list structures.
      </p>
      <p class="text-xs text-surface-500 mt-2">
        Please use the main admin tools for these sections for now.
      </p>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        @click="editDialogVisible = false"
      />
      <Button label="Save Changes" icon="pi pi-check" @click="saveProfile" />
    </template>
  </Dialog>

  <!-- Reset Password Dialog -->
  <Dialog
    v-model:visible="passwordDialogVisible"
    header="Reset User Password"
    modal
    class="w-full max-w-md"
    :draggable="false"
  >
    <div class="flex flex-col gap-4 py-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-surface-400">New Password</label>
        <Password
          v-model="newPassword"
          toggleMask
          class="w-full"
          inputClass="w-full"
          placeholder="Enter new strong password"
        />
        <small class="text-surface-500">Minimum 8 characters required.</small>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        @click="passwordDialogVisible = false"
      />
      <Button
        label="Reset Now"
        icon="pi pi-key"
        severity="warn"
        @click="handleResetPassword"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
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
