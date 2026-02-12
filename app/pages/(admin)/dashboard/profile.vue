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
