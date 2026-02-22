<script setup lang="ts">
import { ref, watch, computed } from "vue";

const emit = defineEmits(["close", "success"]);

const props = defineProps<{
  visible: boolean;
}>();

// ─── State ───────────────────────────────────────────────────────────
const submitting = ref(false);
const loadingUniversities = ref(false);
const universities = ref<any[]>([]);
const errorMsg = ref("");

// Form state
const universityId = ref("");
const code = ref("");
const commissionType = ref("PERCENTAGE");
const commissionRate = ref<number>(0);
const currency = ref("GBP");
const invoiceTrigger = ref("ON_ENROLLMENT");
const paymentTermDays = ref(30);
const status = ref("DRAFT");
const effectiveFrom = ref<Date>(new Date());
const effectiveTo = ref<Date | null>(null);
const notes = ref("");

// ─── Options ─────────────────────────────────────────────────────────
const commissionTypes = [
  { label: "Percentage (%)", value: "PERCENTAGE" },
  { label: "Fixed Amount", value: "FIXED_AMOUNT" },
  { label: "Tiered Structure", value: "TIERED" },
];

const currencies = [
  { label: "GBP – British Pound", value: "GBP" },
  { label: "USD – US Dollar", value: "USD" },
  { label: "EUR – Euro", value: "EUR" },
  { label: "AUD – Australian Dollar", value: "AUD" },
  { label: "CAD – Canadian Dollar", value: "CAD" },
  { label: "BDT – Bangladeshi Taka", value: "BDT" },
];

const triggers = [
  { label: "On Enrollment", value: "ON_ENROLLMENT" },
  { label: "On Offer Accepted", value: "ON_OFFER_ACCEPTED" },
  { label: "On Visa Approval", value: "ON_VISA_APPROVAL" },
  { label: "On Tuition Payment", value: "ON_TUITION_PAYMENT" },
  { label: "Manual", value: "MANUAL" },
];

const statuses = [
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

const termOptions = [
  { label: "Net 14 Days", value: 14 },
  { label: "Net 30 Days", value: 30 },
  { label: "Net 45 Days", value: 45 },
  { label: "Net 60 Days", value: 60 },
  { label: "Net 90 Days", value: 90 },
];

// ─── Fetch universities on open ──────────────────────────────────────
watch(
  () => props.visible,
  async (open) => {
    if (open && universities.value.length === 0) {
      loadingUniversities.value = true;
      try {
        const data: any = await $fetch("/api/admin/universities");
        universities.value = (data?.universities || data || []).map(
          (u: any) => ({
            label: u.name,
            value: u.id,
          })
        );
      } catch (e) {
        console.error("Failed to load universities", e);
      } finally {
        loadingUniversities.value = false;
      }
    }
  }
);

// ─── Auto-generate code ───────────────────────────────────────────────
watch(universityId, (id) => {
  const uni = universities.value.find((u: any) => u.value === id);
  if (uni) {
    const prefix = uni.label
      .replace(/[^A-Za-z]/g, "")
      .substring(0, 4)
      .toUpperCase();
    code.value = `AGR-${prefix}-${new Date().getFullYear()}`;
  }
});

// ─── Validation ───────────────────────────────────────────────────────
const isValid = computed(() => {
  return (
    universityId.value &&
    code.value.length >= 3 &&
    commissionRate.value > 0 &&
    effectiveFrom.value
  );
});

// ─── Reset ────────────────────────────────────────────────────────────
const reset = () => {
  universityId.value = "";
  code.value = "";
  commissionType.value = "PERCENTAGE";
  commissionRate.value = 0;
  currency.value = "GBP";
  invoiceTrigger.value = "ON_ENROLLMENT";
  paymentTermDays.value = 30;
  status.value = "DRAFT";
  effectiveFrom.value = new Date();
  effectiveTo.value = null;
  notes.value = "";
  errorMsg.value = "";
};

// ─── Submit ───────────────────────────────────────────────────────────
const onSubmit = async () => {
  if (!isValid.value) {
    errorMsg.value = "Please fill all required fields.";
    return;
  }

  submitting.value = true;
  errorMsg.value = "";

  try {
    const data: any = await $fetch("/api/admin/finance/agreements", {
      method: "POST",
      body: {
        universityId: universityId.value,
        code: code.value,
        commissionType: commissionType.value,
        commissionRate: commissionRate.value,
        currency: currency.value,
        invoiceTrigger: invoiceTrigger.value,
        paymentTermDays: paymentTermDays.value,
        status: status.value,
        effectiveFrom: effectiveFrom.value.toISOString(),
        effectiveTo: effectiveTo.value ? effectiveTo.value.toISOString() : null,
        notes: notes.value || null,
      },
    });

    if (data.success) {
      emit("success");
      emit("close");
      reset();
    }
  } catch (e: any) {
    errorMsg.value =
      e?.data?.message || "Failed to create agreement. Please try again.";
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    header="NEW PARTNERSHIP AGREEMENT"
    modal
    @update:visible="$emit('close')"
    class="w-full max-w-2xl"
    :pt="{
      root: {
        class:
          'border border-white/5 bg-surface-950 shadow-2xl rounded-3xl overflow-hidden',
      },
      mask: { class: 'backdrop-blur-md bg-black/50' },
      header: { class: 'bg-surface-950 border-b border-white/5 px-8 py-5' },
      title: {
        class: 'text-[11px] font-black text-white uppercase tracking-[0.2em]',
      },
      content: { class: 'bg-surface-950 px-8 py-6' },
    }"
  >
    <div class="space-y-6">
      <!-- Error -->
      <div
        v-if="errorMsg"
        class="flex items-center gap-3 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl"
      >
        <i class="pi pi-exclamation-triangle text-rose-400 text-xs" />
        <span
          class="text-rose-400 text-[10px] font-bold uppercase tracking-widest"
          >{{ errorMsg }}</span
        >
      </div>

      <!-- Section: Institution -->
      <div class="space-y-1 pb-2 border-b border-white/5">
        <p
          class="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em]"
        >
          01 — Institution
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            University <span class="text-rose-400">*</span>
          </label>
          <div
            v-if="loadingUniversities"
            class="flex items-center gap-2 text-surface-500 text-xs py-2"
          >
            <i class="pi pi-spin pi-spinner text-xs" /> Loading universities...
          </div>
          <Select
            v-else
            v-model="universityId"
            :options="universities"
            option-label="label"
            option-value="value"
            placeholder="Select university..."
            filter
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Agreement Code <span class="text-rose-400">*</span>
          </label>
          <InputText
            v-model="code"
            placeholder="e.g. AGR-OXFD-2026"
            class="w-full font-mono"
          />
        </div>
      </div>

      <!-- Section: Commission Structure -->
      <div class="space-y-1 pb-2 border-b border-white/5">
        <p
          class="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em]"
        >
          02 — Commission Structure
        </p>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Type <span class="text-rose-400">*</span>
          </label>
          <Select
            v-model="commissionType"
            :options="commissionTypes"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Rate <span class="text-rose-400">*</span>
          </label>
          <InputNumber
            v-model="commissionRate"
            :suffix="commissionType === 'PERCENTAGE' ? '%' : ''"
            :min="0"
            :max-fraction-digits="2"
            fluid
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Currency
          </label>
          <Select
            v-model="currency"
            :options="currencies"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
      </div>

      <!-- Section: Terms & Trigger -->
      <div class="space-y-1 pb-2 border-b border-white/5">
        <p
          class="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em]"
        >
          03 — Terms & Invoice Trigger
        </p>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Invoice Trigger <span class="text-rose-400">*</span>
          </label>
          <Select
            v-model="invoiceTrigger"
            :options="triggers"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Payment Terms
          </label>
          <Select
            v-model="paymentTermDays"
            :options="termOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Initial Status
          </label>
          <Select
            v-model="status"
            :options="statuses"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
      </div>

      <!-- Section: Validity Period -->
      <div class="space-y-1 pb-2 border-b border-white/5">
        <p
          class="text-[9px] font-black text-primary-400 uppercase tracking-[0.2em]"
        >
          04 — Validity Period
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Effective From <span class="text-rose-400">*</span>
          </label>
          <DatePicker v-model="effectiveFrom" show-icon fluid />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Effective To
            <span class="text-surface-600 font-medium normal-case ml-1"
              >(leave blank for open-ended)</span
            >
          </label>
          <DatePicker
            v-model="effectiveTo"
            show-icon
            fluid
            placeholder="Open-ended"
          />
        </div>
      </div>

      <!-- Notes -->
      <div class="flex flex-col gap-2">
        <label
          class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
        >
          Internal Notes
        </label>
        <Textarea
          v-model="notes"
          placeholder="e.g. Agreed via email on Jan 15. Includes foundation year programmes..."
          rows="2"
          class="w-full text-xs"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 w-full pt-2">
        <Button
          label="Cancel"
          class="p-button-text text-surface-400! font-black! text-[10px]! uppercase tracking-widest"
          @click="
            $emit('close');
            reset();
          "
        />
        <Button
          label="Create Agreement"
          icon="pi pi-file-edit"
          :loading="submitting"
          :disabled="!isValid"
          class="flex-1 bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! font-black text-[10px] uppercase tracking-widest px-8 rounded-xl"
          @click="onSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>
