<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  record: any;
  visible: boolean;
}>();

const emit = defineEmits(["close"]);

const printReceipt = () => {
  window.print();
};
</script>

<template>
  <Dialog
    :visible="visible"
    header="INSTITUTIONAL MONEY RECEIPT"
    modal
    @update:visible="$emit('close')"
    class="w-full max-w-2xl border-white/5 bg-surface-950 shadow-2xl rounded-3xl"
    :pt="{ mask: { class: 'backdrop-blur-md bg-black/40' } }"
  >
    <div
      v-if="record"
      id="money-receipt"
      class="p-8 bg-white text-slate-900 rounded-xl"
    >
      <!-- Header -->
      <div
        class="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-8"
      >
        <div>
          <img src="/icon.png" class="w-12 h-12 grayscale mb-4" />
          <h2 class="text-xl font-black tracking-tighter text-slate-900">
            UniReach <span class="text-slate-500 font-bold">Intelligence</span>
          </h2>
          <p
            class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1"
          >
            Official Payment Receipt • Verified Ledger
          </p>
        </div>
        <div class="text-right">
          <div
            class="bg-slate-900 text-white px-4 py-2 rounded-lg inline-block mb-2"
          >
            <span class="text-[9px] font-black uppercase tracking-widest"
              >Receipt No</span
            >
            <p class="text-lg font-black leading-none">{{ record.code }}</p>
          </div>
          <p class="text-[10px] text-slate-400 font-bold uppercase">
            {{
              $dayjs(record.paidAt || record.createdAt).format(
                "DD MMMM YYYY, HH:mm"
              )
            }}
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-8">
        <div class="grid grid-cols-2 gap-12">
          <div class="space-y-4">
            <div>
              <span
                class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1"
                >Received From</span
              >
              <p class="text-sm font-black text-slate-800 uppercase">
                {{ record.applicant.firstName }} {{ record.applicant.lastName }}
              </p>
              <p class="text-[10px] text-slate-500 font-medium">
                {{ record.applicant.user?.email }}
              </p>
            </div>
            <div v-if="record.application">
              <span
                class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1"
                >Linked Application</span
              >
              <p class="text-[10px] font-bold text-slate-800">
                {{ record.application.course.university.name }}
              </p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <span
                class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1"
                >Payment Method</span
              >
              <p
                class="text-[10px] font-black text-slate-800 uppercase tracking-tight"
              >
                {{ record.paymentMethod?.replace(/_/g, " ") || "UNSPECIFIED" }}
              </p>
              <p
                v-if="record.paymentRef"
                class="text-[9px] text-slate-400 font-medium"
              >
                REF: {{ record.paymentRef }}
              </p>
            </div>
            <div>
              <span
                class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1"
                >Fee Type</span
              >
              <p
                class="text-[10px] font-black text-slate-800 uppercase tracking-tight"
              >
                {{ record.feeType.replace(/_/g, " ") }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden"
        >
          <!-- Decorative Background Symbol -->
          <div
            class="absolute -right-4 -bottom-4 opacity-5 pointer-events-none"
          >
            <i class="pi pi-check-circle text-[120px] text-slate-900" />
          </div>

          <div class="flex justify-between items-center relative z-10">
            <div class="space-y-1">
              <h3
                class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
              >
                Total Settled Amount
              </h3>
              <p class="text-4xl font-black text-slate-900 tracking-tighter">
                {{ record.currency }} {{ record.amount.toLocaleString() }}
              </p>
            </div>
            <div class="text-right">
              <div
                class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-lg tracking-widest"
              >
                <i class="pi pi-verified text-[10px]" />
                Verified Paid
              </div>
            </div>
          </div>
        </div>

        <p
          class="text-[9px] text-slate-400 leading-relaxed italic border-t border-slate-100 pt-6"
        >
          This is a computer-generated receipt valid within the UniReach
          Intelligence OS. No physical signature is required for electronic
          verification. The amount mentioned above has been successfully
          credited to UniReach accounts.
        </p>
      </div>

      <!-- Footer -->
      <div
        class="mt-12 flex justify-between items-end border-t-2 border-slate-50 pt-8 opacity-20 hover:opacity-100 transition-opacity"
      >
        <div class="space-y-1">
          <p class="text-[8px] font-black text-slate-900 uppercase">
            Unireach Headquarters
          </p>
          <p class="text-[7px] text-slate-500 uppercase font-bold">
            Dhaka, Bangladesh • unireachbd.com
          </p>
        </div>
        <div class="text-right">
          <div class="w-24 h-px bg-slate-300 mb-2 mx-auto"></div>
          <p
            class="text-[8px] font-black text-slate-500 uppercase tracking-widest"
          >
            Digital Stamp
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-4 w-full pt-4">
        <Button
          label="Close"
          class="p-button-text !text-surface-400 !font-black !text-[10px] uppercase tracking-widest"
          @click="$emit('close')"
        />
        <Button
          label="Print Receipt"
          icon="pi pi-print"
          class="bg-surface-800! border-white/10! text-white! font-black text-[10px] uppercase tracking-widest px-8 rounded-xl flex-1"
          @click="printReceipt"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #money-receipt,
  #money-receipt * {
    visibility: visible;
  }
  #money-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 40px;
    border: none;
    box-shadow: none;
  }
}
</style>
