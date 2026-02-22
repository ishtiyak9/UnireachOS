<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Revenue Ledger | UniReach OS",
});

const loading = ref(true);
const earnings = ref<any[]>([]);

const fetchEarnings = async () => {
  try {
    const { data } = await useFetch("/api/admin/finance/earnings");
    if (data.value?.success) {
      earnings.value = data.value.data;
    }
  } catch (e) {
    console.error("Failed to fetch earnings:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEarnings();
});

const getStatusSeverity = (status: string) => {
  const map: any = {
    RECEIVED: "success",
    INVOICED: "info",
    PENDING_INVOICE: "warn",
    PARTIALLY_RECEIVED: "info",
    OVERDUE: "danger",
    DISPUTED: "danger",
    CANCELLED: "secondary",
  };
  return map[status] || "secondary";
};

const formatCurrency = (amount: number, currency: string = "GBP") => {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    amount
  );
};
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <DashboardPageHeader
      title="Revenue"
      highlight="Ledger"
      subtitle="Global accounts receivable registry tracking institutional yields."
    />

    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
    >
      <DashboardGlassTable
        :value="earnings"
        :loading="loading"
        paginator
        :rows="15"
      >
        <Column header="Application Intelligence" class="py-4">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-xs font-black text-white uppercase"
                >{{ data.application.applicant.firstName }}
                {{ data.application.applicant.lastName }}</span
              >
              <span
                class="text-[9px] text-surface-500 font-bold tracking-widest"
                >{{ data.application.code }} •
                {{ data.application.course.university.name }}</span
              >
            </div>
          </template>
        </Column>
        <Column field="trigger" header="Event">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span
                class="text-[10px] font-black text-primary-400 uppercase tracking-tighter"
                >{{ data.trigger.replace(/_/g, " ") }}</span
              >
              <span class="text-[8px] text-surface-500 font-medium">{{
                $dayjs(data.triggerDate).format("DD MMM YYYY")
              }}</span>
            </div>
          </template>
        </Column>
        <Column header="Gross Yield">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-xs font-black text-white">{{
                formatCurrency(data.grossAmount, data.currency)
              }}</span>
              <span
                v-if="data.grossAmountBDT"
                class="text-[9px] text-surface-500 font-bold uppercase tracking-tighter"
                >~ BDT {{ data.grossAmountBDT.toLocaleString() }}</span
              >
            </div>
          </template>
        </Column>
        <Column header="Partner Share">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-xs font-black text-rose-400"
                >- {{ formatCurrency(data.agentShare, data.currency) }}</span
              >
              <span
                class="text-[8px] text-surface-600 font-medium tracking-tighter"
                >{{
                  data.application.applicant.agent?.agencyName || "Direct"
                }}</span
              >
            </div>
          </template>
        </Column>
        <Column header="Net Recovery">
          <template #body="{ data }">
            <span class="text-xs font-black text-emerald-400">{{
              formatCurrency(data.netAmount, data.currency)
            }}</span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status.replace(/_/g, ' ')"
              :severity="getStatusSeverity(data.status)"
              class="text-[8px] font-black tracking-widest uppercase px-3! py-1! rounded-lg!"
            />
          </template>
        </Column>
        <Column header="Invoice">
          <template #body="{ data }">
            <div v-if="data.invoice" class="flex items-center gap-2">
              <i class="pi pi-file-o text-primary-500 text-[10px]" />
              <span class="text-[10px] font-bold text-surface-300">{{
                data.invoice.code
              }}</span>
            </div>
            <span
              v-else
              class="text-[9px] text-surface-600 font-black uppercase tracking-widest italic"
              >Not Issued</span
            >
          </template>
        </Column>
      </DashboardGlassTable>
    </div>
  </div>
</template>
