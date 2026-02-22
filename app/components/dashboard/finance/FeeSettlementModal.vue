<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  fee: any;
  visible: boolean;
}>();

const emit = defineEmits(["close", "success"]);

const loading = ref(false);
const errorMsg = ref("");

// Form state
const paymentMethod = ref("BANK_TRANSFER");
const paymentRef = ref("");
const paidAt = ref<Date>(new Date());
const amount = ref(0);
const notes = ref("");

// Sync amount from fee when it changes
watch(
  () => props.fee,
  (fee) => {
    if (fee) amount.value = fee.amount ?? 0;
  },
  { immediate: true }
);

const paymentMethods = [
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Wire Transfer", value: "WIRE_TRANSFER" },
  { label: "Cheque", value: "CHEQUE" },
  { label: "Cash", value: "CASH" },
  { label: "Online Payment", value: "ONLINE_PAYMENT" },
];

const isValid = computed(() => {
  return (
    paymentMethod.value &&
    paymentRef.value.length >= 2 &&
    amount.value > 0 &&
    paidAt.value
  );
});

const resetForm = () => {
  paymentMethod.value = "BANK_TRANSFER";
  paymentRef.value = "";
  paidAt.value = new Date();
  notes.value = "";
  errorMsg.value = "";
  if (props.fee) amount.value = props.fee.amount ?? 0;
};

const onSubmit = async () => {
  if (!isValid.value) {
    errorMsg.value = "Please fill all required fields.";
    return;
  }

  loading.value = true;
  errorMsg.value = "";

  try {
    const data: any = await $fetch(
      `/api/admin/finance/fees/${props.fee.id}/collect`,
      {
        method: "PATCH",
        body: {
          paymentMethod: paymentMethod.value,
          paymentRef: paymentRef.value,
          paidAt: paidAt.value.toISOString(),
          amount: amount.value,
          notes: notes.value || null,
        },
      }
    );
    if (data.success) {
      emit("success");
      emit("close");
      resetForm();
    }
  } catch (e: any) {
    errorMsg.value =
      e?.data?.message || "Payment collection failed. Please try again.";
    console.error("Payment collection failure:", e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    header="FEE SETTLEMENT ENGINE"
    modal
    @update:visible="$emit('close')"
    class="w-full max-w-lg border-white/5 bg-surface-950 shadow-2xl rounded-3xl overflow-hidden"
    :pt="{ mask: { class: 'backdrop-blur-md bg-black/40' } }"
  >
    <div v-if="fee" class="space-y-6 pt-4">
      <!-- Fee Summary Card -->
      <div
        class="p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10 mb-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <span
              class="text-[10px] font-black text-primary-400 uppercase tracking-widest"
              >Target Applicant</span
            >
            <p class="text-white font-black text-sm uppercase">
              {{ fee.applicant.firstName }} {{ fee.applicant.lastName }}
            </p>
          </div>
          <Tag
            :value="fee.feeType"
            class="text-[8px] font-black tracking-widest uppercase bg-surface-800 text-surface-400 border-0"
          />
        </div>
        <div class="flex justify-between items-end">
          <div>
            <span
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
              >Amt Due</span
            >
            <p class="text-white font-black text-xl">
              {{ fee.currency }} {{ fee.amount.toLocaleString() }}
            </p>
          </div>
          <div class="text-right">
            <span
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
              >Record Code</span
            >
            <p class="text-surface-400 font-bold text-xs">{{ fee.code }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMsg"
        class="px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[10px] font-bold uppercase tracking-widest"
      >
        <i class="pi pi-exclamation-triangle mr-2" />{{ errorMsg }}
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label
              class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
              >Payment Method</label
            >
            <Select
              v-model="paymentMethod"
              :options="paymentMethods"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
              >Payment Reference <span class="text-rose-400">*</span></label
            >
            <InputText
              v-model="paymentRef"
              placeholder="e.g. TRN-98214"
              class="w-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label
              class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
              >Paid At</label
            >
            <DatePicker v-model="paidAt" show-icon fluid />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
              >Received Amount <span class="text-rose-400">*</span></label
            >
            <InputNumber
              v-model="amount"
              mode="currency"
              :currency="fee.currency || 'BDT'"
              locale="en-BD"
              fluid
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
            >Notes / Remarks</label
          >
          <Textarea
            v-model="notes"
            placeholder="Optional internal reference..."
            rows="2"
            class="w-full"
          />
        </div>

        <div class="pt-4 flex gap-3">
          <Button
            label="Cancel"
            class="flex-1 p-button-text !text-surface-400 !font-black !text-[10px] uppercase tracking-widest"
            @click="$emit('close')"
          />
          <Button
            label="Confirm Settlement"
            icon="pi pi-check"
            :loading="loading"
            :disabled="!isValid"
            class="flex-1 bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! font-black text-[10px] uppercase tracking-widest px-8 rounded-xl"
            @click="onSubmit"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>
