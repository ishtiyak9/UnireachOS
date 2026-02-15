<script setup lang="ts">
import { ref, reactive, computed } from "vue";
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Profile Settings | UniReach OS",
});

const { user } = useUserSession();
const isSaving = ref(false);
const message = ref({ text: "", type: "" });

// Initialize form with current profile data
const form = reactive({
  firstName: user.value?.profile?.firstName || "",
  lastName: user.value?.profile?.lastName || "",
  phone: user.value?.profile?.phone || "",
  nationality: user.value?.profile?.nationality || "",
  passportNo: user.value?.profile?.passportNo || "",
  dateOfBirth: user.value?.profile?.dateOfBirth
    ? new Date(user.value.profile.dateOfBirth).toISOString().split("T")[0]
    : "",
  agencyName: user.value?.profile?.agencyName || "",
  department: user.value?.profile?.department || "",
  position: user.value?.profile?.position || "",
  notificationPreferences: {
    emailEnabled: user.value?.notificationPreferences?.emailEnabled ?? true,
    pushEnabled: user.value?.notificationPreferences?.pushEnabled ?? true,
    systemEnabled: user.value?.notificationPreferences?.systemEnabled ?? true,
    agentEnabled: user.value?.notificationPreferences?.agentEnabled ?? true,
    applicantEnabled:
      user.value?.notificationPreferences?.applicantEnabled ?? true,
    leadEnabled: user.value?.notificationPreferences?.leadEnabled ?? true,
    marketingEnabled:
      user.value?.notificationPreferences?.marketingEnabled ?? false,
  },
});

const saveProfile = async () => {
  isSaving.value = true;
  message.value = { text: "", type: "" };

  try {
    const res = await $fetch("/api/auth/profile", {
      method: "POST",
      body: form,
    });

    if (res.success) {
      message.value = { text: "Profile updated successfully", type: "success" };
      // Session is updated by server, refresh or re-fetch session if needed
      // useUserSession already reacts to session changes in some setups
    }
  } catch (err: any) {
    message.value = {
      text: err.data?.message || "Failed to update profile",
      type: "error",
    };
  } finally {
    isSaving.value = false;
  }
};

const userInitials = computed(() => {
  if (form.firstName && form.lastName) {
    return (form.firstName.charAt(0) + form.lastName.charAt(0)).toUpperCase();
  }
  return user.value?.email?.charAt(0).toUpperCase() || "U";
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-12 p-6">
    <!-- Header: Identity Card -->
    <div
      class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
    >
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full translate-x-24 -translate-y-24"
      />

      <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div class="relative">
          <Avatar
            :label="userInitials"
            shape="circle"
            class="bg-linear-to-br! from-primary-400! to-primary-600! text-black! font-black! text-2xl! w-24! h-24! shadow-2xl ring-4 ring-white/5"
          />
          <div
            class="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-surface-950 flex items-center justify-center"
          >
            <i class="pi pi-check text-xs text-black font-black" />
          </div>
        </div>

        <div class="text-center md:text-left space-y-2">
          <h1 class="text-3xl font-black text-white uppercase tracking-tight">
            {{ form.firstName }} {{ form.lastName }}
          </h1>
          <div class="flex flex-wrap justify-center md:justify-start gap-3">
            <span
              class="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black text-primary-400 uppercase tracking-widest"
            >
              {{ user?.roleName }}
            </span>

            <!-- Corporate / Identity ID -->
            <span
              v-if="user?.profile?.employeeId"
              class="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest"
            >
              ID: {{ user.profile.employeeId }}
            </span>
            <span
              v-else-if="user?.profile?.agentCode"
              class="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-400 uppercase tracking-widest"
            >
              CODE: {{ user.profile.agentCode }}
            </span>
            <span
              v-else-if="user?.profile?.passportNo"
              class="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-widest"
            >
              PPT: {{ user.profile.passportNo }}
            </span>

            <span
              class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-surface-400 uppercase tracking-widest"
            >
              {{ user?.email }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Message -->
    <transition name="fade">
      <div
        v-if="message.text"
        :class="[
          'p-4 rounded-2xl border text-sm font-bold flex items-center gap-3',
          message.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        ]"
      >
        <i
          :class="
            message.type === 'success'
              ? 'pi pi-check-circle'
              : 'pi pi-exclamation-circle'
          "
        />
        {{ message.text }}
      </div>
    </transition>

    <!-- Profile Edit Form -->
    <div
      class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div class="flex items-center gap-3 border-b border-white/5 pb-4">
        <i class="pi pi-user text-primary-500" />
        <h2 class="text-lg font-black text-white uppercase tracking-wider">
          Personal Information
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Common Fields -->
        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >First Name</label
          >
          <InputText
            v-model="form.firstName"
            class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
            >Last Name</label
          >
          <InputText
            v-model="form.lastName"
            class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
          />
        </div>

        <!-- Applicant Specific -->
        <template v-if="user?.roleCategory === 'APPLICANT'">
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Phone Number</label
            >
            <InputText
              v-model="form.phone"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>

          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Nationality</label
            >
            <InputText
              v-model="form.nationality"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>

          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Passport Number</label
            >
            <InputText
              v-model="form.passportNo"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>

          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Date of Birth</label
            >
            <InputText
              v-model="form.dateOfBirth"
              type="date"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>
        </template>

        <!-- Agent Specific -->
        <template v-if="user?.roleCategory === 'AGENT'">
          <div class="space-y-2 col-span-1 md:col-span-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Agency Name</label
            >
            <InputText
              v-model="form.agencyName"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Contact Phone</label
            >
            <InputText
              v-model="form.phone"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>
        </template>

        <!-- Staff Specific -->
        <template v-if="user?.roleCategory === 'SYSTEM'">
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Department</label
            >
            <InputText
              v-model="form.department"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1"
              >Position</label
            >
            <InputText
              v-model="form.position"
              class="w-full bg-surface-950! border-white/10! text-white! rounded-xl py-3"
            />
          </div>
        </template>
      </div>

      <div class="flex justify-end pt-6 border-t border-white/5">
        <Button
          :label="isSaving ? 'Synchronizing...' : 'Save Profile Changes'"
          :icon="isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
          :disabled="isSaving"
          @click="saveProfile"
          class="bg-primary-500! text-black! border-0! text-[10px]! font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-lg shadow-primary-500/20"
        />
      </div>
    </div>

    <!-- Notification Preferences -->
    <div
      class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div class="flex items-center gap-3 border-b border-white/5 pb-4">
        <i class="pi pi-bell text-primary-500" />
        <h2 class="text-lg font-black text-white uppercase tracking-wider">
          Notification Preferences
        </h2>
      </div>

      <div class="md:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <!-- Channels -->
          <div class="space-y-4">
            <h3
              class="text-xs font-black text-surface-400 uppercase tracking-widest mb-4"
            >
              Channels
            </h3>
            <div
              class="flex items-center justify-between p-4 bg-surface-950/50 rounded-xl border border-white/5"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-white">
                  Email Notifications
                </div>
                <div class="text-xs text-surface-400">
                  Receive copy via email
                </div>
              </div>
              <ToggleSwitch
                v-model="form.notificationPreferences.emailEnabled"
              />
            </div>
            <div
              class="flex items-center justify-between p-4 bg-surface-950/50 rounded-xl border border-white/5"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-white">
                  Push Notifications
                </div>
                <div class="text-xs text-surface-400">
                  Receive in-app alerts
                </div>
              </div>
              <ToggleSwitch
                v-model="form.notificationPreferences.pushEnabled"
              />
            </div>
            <div
              class="flex items-center justify-between p-4 bg-surface-950/50 rounded-xl border border-white/5"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-white">
                  Marketing & Promos
                </div>
                <div class="text-xs text-surface-400">
                  Receive feature updates
                </div>
              </div>
              <ToggleSwitch
                v-model="form.notificationPreferences.marketingEnabled"
              />
            </div>
          </div>

          <!-- Categories -->
          <div class="space-y-4">
            <h3
              class="text-xs font-black text-surface-400 uppercase tracking-widest mb-4"
            >
              Categories
            </h3>
            <div
              v-if="user?.permissions?.includes('notification:view_system')"
              class="flex items-center justify-between p-4 bg-surface-950/50 rounded-xl border border-white/5"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-white">System Alerts</div>
                <div class="text-xs text-surface-400">
                  Maintenance & Security
                </div>
              </div>
              <ToggleSwitch
                v-model="form.notificationPreferences.systemEnabled"
              />
            </div>
            <div
              class="flex items-center justify-between p-4 bg-surface-950/50 rounded-xl border border-white/5"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-white">Agent Updates</div>
                <div class="text-xs text-surface-400">Partner activities</div>
              </div>
              <ToggleSwitch
                v-model="form.notificationPreferences.agentEnabled"
              />
            </div>
            <div
              class="flex items-center justify-between p-4 bg-surface-950/50 rounded-xl border border-white/5"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-white">
                  Applicant Updates
                </div>
                <div class="text-xs text-surface-400">Student applications</div>
              </div>
              <ToggleSwitch
                v-model="form.notificationPreferences.applicantEnabled"
              />
            </div>
            <div
              class="flex items-center justify-between p-4 bg-surface-950/50 rounded-xl border border-white/5"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-white">Lead Updates</div>
                <div class="text-xs text-surface-400">New inquiries</div>
              </div>
              <ToggleSwitch
                v-model="form.notificationPreferences.leadEnabled"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-6 border-t border-white/5">
        <Button
          :label="isSaving ? 'Synchronizing...' : 'Update Preferences'"
          :icon="isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-check-circle'"
          :disabled="isSaving"
          @click="saveProfile"
          class="bg-surface-100! text-surface-950! border-0! text-[10px]! font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-lg hover:bg-white! transition-colors"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.p-inputtext) {
  transition: all 0.3s ease;
}

:deep(.p-inputtext:focus) {
  border-color: rgba(var(--p-primary-500), 0.5) !important;
  box-shadow: 0 0 0 2px rgba(var(--p-primary-500), 0.1) !important;
}
</style>
