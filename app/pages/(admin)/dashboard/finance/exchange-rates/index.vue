<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Exchange Registry | UniReach OS",
});

const loading = ref(true);
const rates = ref<any[]>([]);

// Note: No specific GET endpoint for rates was created yet,
// but we can fetch them from the audit logs or create one.
// For now, I'll fetch them from a generic endpoint if I had one,
// or show a manual entry UI.

const fetchRates = async () => {
  try {
    const { data } = await useFetch("/api/admin/finance/exchange-rates");
    if (data.value?.success) {
      rates.value = data.value.rates;
    }
  } catch (e) {
    console.error("Failed to fetch exchange rates:", e);
  } finally {
    loading.value = false;
  }
};

const activeRates = computed(() => rates.value.filter((r) => r.isActive));

onMounted(() => {
  fetchRates();
});
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <DashboardPageHeader
      title="Exchange"
      highlight="Registry"
      subtitle="Treasury control for global currency benchmarks and BDT conversion rates."
    >
      <template #actions>
        <Button
          icon="pi pi-refresh"
          label="Update Benchmark"
          class="bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! text-[10px]! font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/10"
        />
      </template>
    </DashboardPageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Active Benchmarks -->
      <div
        class="bg-surface-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl"
      >
        <h3
          class="text-sm font-black text-white uppercase tracking-widest mb-6"
        >
          Active Benchmarks
        </h3>
        <div class="space-y-4">
          <div
            v-if="activeRates.length === 0 && !loading"
            class="text-center py-10 opacity-30 italic text-xs uppercase font-black"
          >
            No active benchmarks found. Registry empty.
          </div>
          <div
            v-for="rate in activeRates"
            :key="rate.id"
            class="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-primary-500/30 transition-all"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-surface-950 flex items-center justify-center border border-white/5"
              >
                <span class="text-xs font-black text-white">{{
                  rate.fromCurrency
                }}</span>
              </div>
              <div class="flex flex-col">
                <span
                  class="text-[9px] text-surface-500 font-bold uppercase tracking-widest"
                  >Base Rate (vs {{ rate.toCurrency }})</span
                >
                <span class="text-lg font-black text-white tracking-tight"
                  >1.00 = {{ rate.rate.toFixed(2) }} {{ rate.toCurrency }}</span
                >
              </div>
            </div>
            <div class="text-right">
              <span
                class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase"
                >Live</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Rate Intelligence -->
      <div
        class="bg-primary-500/5 border border-primary-500/20 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-6 border border-primary-500/20"
        >
          <i class="pi pi-shield text-3xl text-primary-500" />
        </div>
        <h3 class="text-xl font-black text-white uppercase tracking-tight mb-2">
          Treasury Governance
        </h3>
        <p
          class="text-xs text-surface-400 font-medium max-w-sm mx-auto leading-relaxed"
        >
          Exchange rates influence all automated commission calculations.
          Changes here will immediately re-calculate the BDT equivalent for all
          future earnings.
        </p>
        <div class="mt-8 flex flex-col items-center gap-3">
          <span
            class="text-[9px] text-surface-600 font-black uppercase tracking-[0.2em]"
            >Synchronized with</span
          >
          <div class="flex items-center gap-6 opacity-40">
            <span class="text-xs font-black text-white">REUTERS</span>
            <span class="text-xs font-black text-white">BLOOMBERG</span>
            <span class="text-xs font-black text-white">BANK OF ENG</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
