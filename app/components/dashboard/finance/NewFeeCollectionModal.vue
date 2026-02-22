<script setup lang="ts">
import { ref, watch, computed } from "vue";

const emit = defineEmits(["close", "success"]);

const props = defineProps<{
  visible: boolean;
}>();

// ─── State ───────────────────────────────────────────────────────────
const loading = ref(false);
const submitting = ref(false);
const errorMsg = ref("");
const applicants = ref<any[]>([]);
const applicantSearch = ref("");

// Form state
const applicantId = ref("");
const feeType = ref("SERVICE_FEE");
const amount = ref<number>(0);
const currency = ref("BDT");
const description = ref("");
const dueDate = ref<Date | null>(null);

// ─── Options ─────────────────────────────────────────────────────────
const feeTypes = [
  { label: "Application Fee", value: "APPLICATION_FEE" },
  { label: "Service Fee", value: "SERVICE_FEE" },
  { label: "Visa Fee", value: "VISA_FEE" },
  { label: "Document Fee", value: "DOCUMENT_FEE" },
  { label: "Tuition Deposit", value: "TUITION_DEPOSIT" },
  { label: "Courier Fee", value: "COURIER_FEE" },
  { label: "Assessment Fee", value: "ASSESSMENT_FEE" },
  { label: "Other", value: "OTHER" },
];

const currencies = [
  { label: "BDT – Bangladeshi Taka", value: "BDT" },
  { label: "GBP – British Pound", value: "GBP" },
  { label: "USD – US Dollar", value: "USD" },
  { label: "EUR – Euro", value: "EUR" },
  { label: "AUD – Australian Dollar", value: "AUD" },
  { label: "CAD – Canadian Dollar", value: "CAD" },
];

// ─── Fetch applicants on open ────────────────────────────────────────
watch(
  () => props.visible,
  async (open) => {
    if (open && applicants.value.length === 0) {
      loading.value = true;
      try {
        const data: any[] = await $fetch("/api/admin/users?category=APPLICANT");
        applicants.value = (data || []).filter(
          (u: any) => u.roleCode === "applicant"
        );
      } catch (e) {
        console.error("Failed to load applicants", e);
      } finally {
        loading.value = false;
      }
    }
  }
);

// ─── Filtered applicant list ─────────────────────────────────────────
const filteredApplicants = computed(() => {
  if (!applicantSearch.value) return applicants.value;
  const q = applicantSearch.value.toLowerCase();
  return applicants.value.filter(
    (a: any) =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
  );
});

// ─── Selected applicant label ─────────────────────────────────────────
const selectedApplicant = computed(() =>
  applicants.value.find((a: any) => a.id === applicantId.value)
);

// ─── Validation ───────────────────────────────────────────────────────
const isValid = computed(() => {
  return applicantId.value && feeType.value && amount.value > 0;
});

// ─── Reset ────────────────────────────────────────────────────────────
const reset = () => {
  applicantId.value = "";
  feeType.value = "SERVICE_FEE";
  amount.value = 0;
  currency.value = "BDT";
  description.value = "";
  dueDate.value = null;
  errorMsg.value = "";
  applicantSearch.value = "";
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
    const data: any = await $fetch("/api/admin/finance/fees", {
      method: "POST",
      body: {
        applicantId: applicantId.value,
        feeType: feeType.value,
        amount: amount.value,
        currency: currency.value,
        description: description.value || null,
        dueDate: dueDate.value ? dueDate.value.toISOString() : null,
      },
    });

    if (data.success) {
      emit("success");
      emit("close");
      reset();
    }
  } catch (e: any) {
    errorMsg.value =
      e?.data?.message || "Failed to create fee collection. Try again.";
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    header="NEW FEE COLLECTION"
    modal
    @update:visible="$emit('close')"
    class="w-full max-w-lg"
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

      <!-- Applicant Select -->
      <div class="flex flex-col gap-2">
        <label
          class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
        >
          Applicant <span class="text-rose-400">*</span>
        </label>
        <div
          v-if="loading"
          class="flex items-center gap-2 text-surface-500 text-xs py-2"
        >
          <i class="pi pi-spin pi-spinner text-xs" />
          Loading applicants...
        </div>
        <div v-else class="space-y-2">
          <InputText
            v-model="applicantSearch"
            placeholder="Search by name or email..."
            class="w-full text-xs"
          />
          <div
            class="max-h-40 overflow-y-auto rounded-xl border border-white/5 bg-surface-900/80 divide-y divide-white/5"
          >
            <div
              v-if="filteredApplicants.length === 0"
              class="px-4 py-3 text-[10px] text-surface-500 font-bold uppercase italic text-center"
            >
              No applicants found
            </div>
            <button
              v-for="a in filteredApplicants"
              :key="a.id"
              type="button"
              @click="
                applicantId = a.id;
                applicantSearch = '';
              "
              class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              :class="applicantId === a.id ? 'bg-primary-500/10' : ''"
            >
              <div>
                <p class="text-[11px] font-black text-white uppercase">
                  {{ a.firstName }} {{ a.lastName }}
                </p>
                <p class="text-[9px] text-surface-500 font-medium">
                  {{ a.email }}
                </p>
              </div>
              <i
                v-if="applicantId === a.id"
                class="pi pi-check text-primary-400 text-xs"
              />
            </button>
          </div>
          <!-- Selected display -->
          <div
            v-if="selectedApplicant"
            class="flex items-center gap-2 px-3 py-2 bg-primary-500/5 border border-primary-500/10 rounded-xl"
          >
            <i class="pi pi-user text-primary-400 text-xs" />
            <span class="text-[10px] font-black text-primary-300 uppercase">
              {{ selectedApplicant.firstName }} {{ selectedApplicant.lastName }}
            </span>
            <button
              @click="applicantId = ''"
              class="ml-auto text-surface-500 hover:text-rose-400"
            >
              <i class="pi pi-times text-[10px]" />
            </button>
          </div>
        </div>
      </div>

      <!-- Fee Type + Currency Row -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Fee Type <span class="text-rose-400">*</span>
          </label>
          <Select
            v-model="feeType"
            :options="feeTypes"
            option-label="label"
            option-value="value"
            class="w-full"
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

      <!-- Amount + Due Date Row -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Amount <span class="text-rose-400">*</span>
          </label>
          <InputNumber
            v-model="amount"
            mode="currency"
            :currency="currency"
            locale="en-BD"
            fluid
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
          >
            Due Date
          </label>
          <DatePicker
            v-model="dueDate"
            show-icon
            fluid
            placeholder="Optional"
          />
        </div>
      </div>

      <!-- Description -->
      <div class="flex flex-col gap-2">
        <label
          class="text-[10px] font-black text-surface-400 uppercase tracking-widest"
        >
          Description / Notes
        </label>
        <Textarea
          v-model="description"
          placeholder="e.g. Application processing fee for Oxford intake..."
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
          label="Issue Fee"
          icon="pi pi-plus"
          :loading="submitting"
          :disabled="!isValid"
          class="flex-1 bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! font-black text-[10px] uppercase tracking-widest px-8 rounded-xl"
          @click="onSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>
