<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "partner",
  middleware: "auth",
});

const toast = useToast();

// Tactical Profile State
const loading = ref(true);
const saving = ref(false);
const profile = ref({
  // Personal Details
  firstName: "",
  lastName: "",
  address: "",
  country: "",
  primaryEmail: "",
  primaryPhone: "",

  // Company Details
  agencyName: "",
  companyAddress: "",
  licenseNo: "",

  // Operational Settings
  showCommissionInSearch: true,
  sendCommissionNotifications: true,
  showCommissionPaymentTab: true,

  // Bank Account Details
  beneficiaryName: "",
  bankAccountNumber: "",
  bankName: "",
  bankBranch: "",
  bankLocation: "",
  bankCountry: "",
  bankState: "",
  bankCity: "",
  bankSwiftCode: "",
  bankIban: "",

  phone: "",
});

// Load Strategic Intelligence
const fetchProfile = async () => {
  try {
    const data = await $fetch("/api/partners/profile");
    if (data) {
      profile.value = { ...profile.value, ...data };
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Neural Link Failure",
      detail: "Failed to retrieve executive profile data.",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Synchronize Intelligence
const saveProfile = async () => {
  saving.value = true;
  try {
    const response = await $fetch("/api/partners/profile", {
      method: "PATCH",
      body: profile.value,
    });

    if (response.success) {
      toast.add({
        severity: "success",
        summary: "Strategy Synchronized",
        detail: "Your executive profile has been safely stored.",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Sync Failure",
      detail: "Failed to transmit profile updates to registry.",
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<template>
  <div class="space-y-8 pb-32">
    <!-- Executive Header -->
    <PartnerHeader
      title="Profile"
      subtitle="Managing the core personal, corporate, and financial identifiers of your partnership."
      badge="Executive Identity"
    >
      <template #title-prefix>Strategic&nbsp;</template>
    </PartnerHeader>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <i class="pi pi-spin pi-spinner text-3xl text-emerald-500 mb-4" />
      <p
        class="text-[10px] font-black text-surface-500 uppercase tracking-widest italic animate-pulse"
      >
        Retrieving Strategic Nodes...
      </p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Tactical Form -->
      <div class="lg:col-span-8 space-y-8">
        <!-- Personal Identification Cluster -->
        <section
          class="p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-3xl space-y-6"
        >
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"
            >
              <i class="pi pi-user text-emerald-500 text-sm" />
            </div>
            <h3
              class="text-sm font-black text-white uppercase tracking-widest italic"
            >
              Personal Identification
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >First Name</label
              >
              <InputText
                v-model="profile.firstName"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Strategic Agent Name"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Last Name</label
              >
              <InputText
                v-model="profile.lastName"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Entity Descriptor"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Physical Landmark (Address)</label
              >
              <InputText
                v-model="profile.address"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Operational HQ"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Registered / Primary Email</label
              >
              <InputText
                v-model="profile.primaryEmail"
                disabled
                class="w-full bg-white/2! border-white/10! text-white/50! text-xs! font-bold! rounded-xl! opacity-60"
                placeholder="comm-link@agency.com"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Primary Phone</label
              >
              <InputText
                v-model="profile.primaryPhone"
                disabled
                class="w-full bg-white/2! border-white/10! text-white/50! text-xs! font-bold! rounded-xl! opacity-60"
                placeholder="+X XXX XXX XXXX"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Country</label
              >
              <InputText
                v-model="profile.country"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Strategic Territory"
              />
            </div>
          </div>
        </section>

        <!-- Corporate Registration Cluster -->
        <section
          class="p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-3xl space-y-6"
        >
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"
            >
              <i class="pi pi-briefcase text-emerald-500 text-sm" />
            </div>
            <h3
              class="text-sm font-black text-white uppercase tracking-widest italic"
            >
              Corporate Registration
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Company / Agency Name</label
              >
              <InputText
                v-model="profile.agencyName"
                disabled
                class="w-full bg-white/2! border-white/10! text-white/50! text-xs! font-bold! rounded-xl! opacity-60"
                placeholder="Corporate Identity"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Corporate Headquarters Address</label
              >
              <InputText
                v-model="profile.companyAddress"
                disabled
                class="w-full bg-white/2! border-white/10! text-white/50! text-xs! font-bold! rounded-xl! opacity-60"
                placeholder="Registered Business Address"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Registration Number</label
              >
              <InputText
                v-model="profile.licenseNo"
                disabled
                class="w-full bg-white/2! border-white/10! text-white/50! text-xs! font-bold! rounded-xl! opacity-60"
                placeholder="Govt License / Reg ID"
              />
            </div>
          </div>
        </section>

        <!-- Financial Nodes (Bank Details) -->
        <section
          class="p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-3xl space-y-6"
        >
          <div class="flex items-center gap-3 mb-2">
            <div
              class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"
            >
              <i class="pi pi-wallet text-emerald-500 text-sm" />
            </div>
            <h3
              class="text-sm font-black text-white uppercase tracking-widest italic"
            >
              Bank Account Details
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Beneficiary Name *</label
              >
              <InputText
                v-model="profile.beneficiaryName"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="As per Bank Records"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Bank Name *</label
              >
              <InputText
                v-model="profile.bankName"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Institutional Entity"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Account Number *</label
              >
              <InputText
                v-model="profile.bankAccountNumber"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="X-XXXX-XXXX"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Branch *</label
              >
              <InputText
                v-model="profile.bankBranch"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Regional Office"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >SWIFT / BIC Code</label
              >
              <InputText
                v-model="profile.bankSwiftCode"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="International Routing Key"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Bank Location (Full Address) *</label
              >
              <InputText
                v-model="profile.bankLocation"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Physical Bank HQ"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Bank Country *</label
              >
              <InputText
                v-model="profile.bankCountry"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Institution Territory"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Bank State *</label
              >
              <InputText
                v-model="profile.bankState"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Regional State/Province"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >Bank City *</label
              >
              <InputText
                v-model="profile.bankCity"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Locality"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="text-[9px] font-black text-surface-400 uppercase tracking-widest ml-1"
                >IBAN (Optional)</label
              >
              <InputText
                v-model="profile.bankIban"
                class="w-full bg-white/2! border-white/10! text-white! text-xs! font-bold! rounded-xl!"
                placeholder="Account IBAN Descriptor"
              />
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Operational Intelligence -->
      <div class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-8">
          <!-- Sync Trigger Card -->
          <div
            class="p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-3xl flex flex-col items-center text-center space-y-6"
          >
            <div
              class="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center"
            >
              <i class="pi pi-shield text-emerald-500 text-3xl" />
            </div>
            <div class="space-y-2">
              <h4
                class="text-sm font-black text-white uppercase italic tracking-tight"
              >
                Strategy Synchronization
              </h4>
              <p class="text-[10px] text-surface-500 leading-relaxed font-bold">
                Transmit your executive parameters to the UniReach core registry
                for operational validation.
              </p>
            </div>
            <Button
              label="SYNCHRONIZE PROFILE"
              icon="pi pi-sync"
              class="w-full bg-emerald-500! border-0! text-black! font-black! tracking-widest! text-[10px]! p-4! rounded-xl! hover:scale-105! transition-all!"
              :loading="saving"
              @click="saveProfile"
            />
          </div>

          <!-- Operational Flags Hub -->
          <div
            class="p-8 rounded-3xl border border-white/5 bg-white/1 backdrop-blur-3xl space-y-8"
          >
            <h3
              class="text-[10px] font-black text-surface-500 uppercase tracking-[0.4em]"
            >
              Operational Intelligence
            </h3>

            <div class="space-y-6">
              <div class="flex items-center justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <span
                    class="text-[10px] font-black text-white uppercase italic"
                    >Program Commission Transparency</span
                  >
                  <span class="text-[8px] font-bold text-surface-500 uppercase"
                    >Show commission values in global search.</span
                  >
                </div>
                <InputSwitch v-model="profile.showCommissionInSearch" />
              </div>

              <div class="flex items-center justify-between gap-4">
                <div class="flex flex-col gap-1">
                  <span
                    class="text-[10px] font-black text-white uppercase italic"
                    >Payout Notifications</span
                  >
                  <span class="text-[8px] font-bold text-surface-500 uppercase"
                    >Receive alerts for financial node transfers.</span
                  >
                </div>
                <InputSwitch v-model="profile.sendCommissionNotifications" />
              </div>

              <div
                class="flex items-center justify-between gap-4 border-t border-white/5 pt-6"
              >
                <div class="flex flex-col gap-1">
                  <span
                    class="text-[10px] font-black text-white uppercase italic"
                    >Financial Ledger Accessibility</span
                  >
                  <span class="text-[8px] font-bold text-surface-500 uppercase"
                    >Enable Reward/Commission terminal in UI.</span
                  >
                </div>
                <InputSwitch v-model="profile.showCommissionPaymentTab" />
              </div>
            </div>
          </div>

          <!-- Security Footprint -->
          <div class="p-6 text-center opacity-40">
            <i class="pi pi-lock text-[10px] text-surface-600 mb-2" />
            <p
              class="text-[8px] font-bold text-surface-600 uppercase tracking-[0.2em]"
            >
              Secured Registry Protocol • UniReach AES-256
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) {
  transition: all 0.3s ease;
}
:deep(.p-inputtext:focus) {
  background: rgba(16, 185, 129, 0.05) !important;
  border-color: rgba(16, 185, 129, 0.3) !important;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
}
:deep(.p-inputswitch-slider) {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: #10b981 !important;
}
</style>
