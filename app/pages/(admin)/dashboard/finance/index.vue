<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Financial Intelligence | UniReach OS",
});

const loading = ref(true);
const stats = ref<any>(null);
const activity = ref<any[]>([]);
const revenueData = ref<any[]>([]);

const chartData = computed(() => ({
  labels: revenueData.value.map((r: any) => r.month),
  datasets: [
    {
      label: "Gross Yield (BDT)",
      data: revenueData.value.map((r: any) => r.total),
      fill: true,
      borderColor: "#d4af37", // primary-500
      backgroundColor: "rgba(212, 175, 55, 0.1)",
      tension: 0.4,
      pointBackgroundColor: "#d4af37",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#d4af37",
    },
  ],
}));

const chartOptions = {
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      ticks: {
        callback: (value: number) => `৳${value.toLocaleString()}`,
      },
    },
  },
};

const fetchOverview = async () => {
  try {
    const { data } = await useFetch("/api/admin/finance/overview");
    if (data.value?.success) {
      stats.value = data.value.stats;
      activity.value = data.value.recentActivity;
      revenueData.value = data.value.revenueByMonth;
    }
  } catch (e) {
    console.error("Failed to fetch financial overview:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOverview();
});

const formationStats = computed(() => [
  {
    label: "Total Gross Yield",
    value: stats.value?.totalRevenue
      ? `BDT ${stats.value.totalRevenue.toLocaleString()}`
      : "BDT 0",
    change: "+12.4%", // Placeholder for now
    trend: "up",
    icon: "pi pi-chart-line",
    color: "from-primary-400 to-primary-600",
  },
  {
    label: "Accounts Receivable",
    value: stats.value?.accountsReceivable
      ? `BDT ${stats.value.accountsReceivable.toLocaleString()}`
      : "BDT 0",
    change: "+5.1%",
    trend: "up",
    icon: "pi pi-arrow-down-left",
    color: "from-blue-400 to-indigo-600",
  },
  {
    label: "Accounts Payable",
    value: stats.value?.accountsPayable
      ? `BDT ${stats.value.accountsPayable.toLocaleString()}`
      : "BDT 0",
    change: "Healthy",
    trend: "down",
    icon: "pi pi-arrow-up-right",
    color: "from-rose-400 to-orange-500",
  },
  {
    label: "Service Fees Collected",
    value: stats.value?.totalFeesCollected
      ? `BDT ${stats.value.totalFeesCollected.toLocaleString()}`
      : "BDT 0",
    change: "+8.2%",
    trend: "up",
    icon: "pi pi-wallet",
    color: "from-emerald-400 to-teal-600",
  },
]);

const getActionColor = (action: string) => {
  const map: any = {
    CREATED: "text-primary-400",
    PAYMENT_RECORDED: "text-emerald-400",
    INVOICE_SENT: "text-blue-400",
    PAYOUT_APPROVED: "text-purple-400",
    DEBIT_NOTE_RAISED: "text-rose-400",
  };
  return map[action] || "text-surface-400";
};

const formatCurrency = (amount: number, currency: string = "BDT") => {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(
    amount
  );
};
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <!-- Atmospheric Background -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"
    />
    <div
      class="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"
    />

    <!-- Finance Header -->
    <DashboardPageHeader
      title="Financial"
      highlight="Intelligence"
      subtitle="Institutional ledger, global revenue registry, and partnership yields."
    >
      <template #actions>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard/finance/agreements">
            <Button
              icon="pi pi-file-pdf"
              label="Agreements"
              class="bg-surface-800! border-white/10! text-white! text-[10px]! font-black uppercase tracking-wider px-4 rounded-xl hover:bg-surface-700!"
            />
          </NuxtLink>
          <NuxtLink to="/dashboard/finance/fees">
            <Button
              icon="pi pi-wallet"
              label="Collect Fees"
              class="bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! text-[10px]! font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/10"
            />
          </NuxtLink>
        </div>
      </template>
    </DashboardPageHeader>

    <!-- Stat Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardNeuralStatCard
        v-for="stat in formationStats"
        :key="stat.label"
        v-bind="stat"
      />
    </div>

    <!-- Main Content: Revenue & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Revenue Matrix (Chart) -->
      <div
        class="lg:col-span-8 bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
      >
        <div class="flex items-center justify-between mb-8">
          <div class="space-y-1">
            <h3 class="text-lg font-black text-white uppercase tracking-tight">
              Revenue Dynamics
            </h3>
            <p class="text-xs text-surface-400 font-medium">
              Monthly yield aggregation (BDT equivalent)
            </p>
          </div>
          <div
            class="flex bg-surface-950/50 p-1 rounded-xl border border-white/5"
          >
            <button
              class="px-3 py-1 text-[10px] font-bold text-black bg-primary-500 rounded-lg shadow-sm"
            >
              6 Months
            </button>
            <button
              class="px-3 py-1 text-[10px] font-bold text-surface-400 hover:text-white transition-colors"
            >
              1 Year
            </button>
          </div>
        </div>

        <div
          class="h-[350px] relative rounded-2xl bg-surface-950/30 border border-white/5 overflow-hidden p-4"
        >
          <BaseChart
            type="line"
            :data="chartData"
            :options="chartOptions"
            height="100%"
            class="!bg-transparent !border-0 !p-0 !shadow-none"
          />
        </div>
      </div>

      <!-- Quick Actions / Links -->
      <div class="lg:col-span-4 space-y-6">
        <div
          class="bg-primary-500/5 border border-primary-500/20 rounded-3xl p-6 backdrop-blur-xl"
        >
          <h3
            class="text-sm font-black text-primary-400 uppercase tracking-widest mb-4"
          >
            Treasury Tools
          </h3>
          <div class="grid grid-cols-1 gap-3">
            <NuxtLink
              to="/dashboard/finance/exchange-rates"
              class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"
                >
                  <i class="pi pi-refresh text-blue-400" />
                </div>
                <div class="text-left">
                  <p class="text-[11px] font-black text-white uppercase">
                    FX Registry
                  </p>
                  <p class="text-[9px] text-surface-500 font-bold uppercase">
                    Update Exchange Rates
                  </p>
                </div>
              </div>
              <i
                class="pi pi-chevron-right text-[10px] text-surface-600 group-hover:text-white transition-colors"
              />
            </NuxtLink>

            <NuxtLink
              to="/dashboard/finance/earnings"
              class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"
                >
                  <i class="pi pi-database text-emerald-400" />
                </div>
                <div class="text-left">
                  <p class="text-[11px] font-black text-white uppercase">
                    Revenue Ledger
                  </p>
                  <p class="text-[9px] text-surface-500 font-bold uppercase">
                    All Commission Earnings
                  </p>
                </div>
              </div>
              <i
                class="pi pi-chevron-right text-[10px] text-surface-600 group-hover:text-white transition-colors"
              />
            </NuxtLink>

            <NuxtLink
              to="/dashboard/finance/payouts"
              class="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20"
                >
                  <i class="pi pi-users text-orange-400" />
                </div>
                <div class="text-left">
                  <p class="text-[11px] font-black text-white uppercase">
                    Agent Payouts
                  </p>
                  <p class="text-[9px] text-surface-500 font-bold uppercase">
                    Manage Disbursements
                  </p>
                </div>
              </div>
              <i
                class="pi pi-chevron-right text-[10px] text-surface-600 group-hover:text-white transition-colors"
              />
            </NuxtLink>
          </div>
        </div>

        <!-- System Health Mini -->
        <div
          class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />
            <span
              class="text-[10px] font-black text-white uppercase tracking-widest"
              >Neural Compliance Engine</span
            >
          </div>
          <p class="text-[10px] text-surface-500 font-medium leading-relaxed">
            All financial reporting is generated with multi-factor audit trails.
            Exchange rates are synchronized with global treasury benchmarks.
          </p>
        </div>
      </div>
    </div>

    <!-- Audit Log: Recent Financial Activity -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl"
    >
      <div class="flex items-center justify-between mb-8">
        <div class="space-y-1">
          <h3 class="text-lg font-black text-white uppercase tracking-tight">
            Audit Trail
          </h3>
          <p class="text-xs text-surface-400 font-medium">
            Real-time ledger of all financial state modifications.
          </p>
        </div>
        <Button
          label="View Full Ledger"
          icon="pi pi-list"
          class="p-button-text p-button-sm text-[10px] font-black uppercase tracking-wider !text-primary-500"
        />
      </div>

      <DashboardGlassTable
        :value="activity"
        striped-rows
        :loading="loading"
        responsive-layout="stack"
      >
        <Column
          field="createdAt"
          header="Timestamp"
          class="text-[11px] font-bold"
        >
          <template #body="{ data }">
            <span class="text-surface-400">{{
              $dayjs(data.createdAt).format("DD MMM, HH:mm")
            }}</span>
          </template>
        </Column>
        <Column
          field="action"
          header="Action"
          class="text-[10px] font-black uppercase"
        >
          <template #body="{ data }">
            <span :class="getActionColor(data.action)">{{
              data.action.replace(/_/g, " ")
            }}</span>
          </template>
        </Column>
        <Column
          field="entityType"
          header="Subject"
          class="text-[11px] font-bold text-white"
        >
          <template #body="{ data }">
            <div class="flex flex-col">
              <span>{{ data.entityType }}</span>
              <span class="text-[9px] text-surface-500 font-medium">{{
                data.entityCode || data.entityId.substring(0, 8)
              }}</span>
            </div>
          </template>
        </Column>
        <Column field="amount" header="Value">
          <template #body="{ data }">
            <span v-if="data.amount" class="text-[11px] font-black text-white">
              {{ formatCurrency(data.amount, data.currency) }}
            </span>
            <span v-else class="text-surface-600">—</span>
          </template>
        </Column>
        <Column
          field="performedByName"
          header="Actor"
          class="text-[11px] font-bold text-surface-300"
        />
      </DashboardGlassTable>
    </div>
  </div>
</template>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px) saturate(180%);
}
</style>
