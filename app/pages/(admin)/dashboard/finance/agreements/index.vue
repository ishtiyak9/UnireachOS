<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Partnership Agreements | UniReach OS",
});

const loading = ref(true);
const agreements = ref<any[]>([]);

const fetchAgreements = async () => {
  try {
    const { data } = await useFetch("/api/admin/finance/agreements");
    if (data.value?.success) {
      agreements.value = data.value.agreements;
    }
  } catch (e) {
    console.error("Failed to fetch agreements:", e);
  } finally {
    loading.value = false;
  }
};

const newAgreementVisible = ref(false);

onMounted(() => {
  fetchAgreements();
});

const getStatusSeverity = (status: string) => {
  const map: any = {
    ACTIVE: "success",
    DRAFT: "info",
    SUSPENDED: "warn",
    EXPIRED: "secondary",
    TERMINATED: "danger",
  };
  return map[status] || "secondary";
};
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <DashboardPageHeader
      title="Partnership"
      highlight="Agreements"
      subtitle="Institutional commission contracts and yield structures."
    >
      <template #actions>
        <Button
          icon="pi pi-plus"
          label="New Agreement"
          class="bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! text-[10px]! font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/10"
          @click="newAgreementVisible = true"
        />
      </template>
    </DashboardPageHeader>

    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
    >
      <DashboardGlassTable
        :value="agreements"
        :loading="loading"
        paginator
        :rows="10"
      >
        <Column header="University" class="py-4">
          <template #body="{ data }">
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center p-1 overflow-hidden"
              >
                <img
                  v-if="data.university.logo"
                  :src="data.university.logo"
                  class="w-full h-full object-contain"
                />
                <i v-else class="pi pi-building text-surface-600" />
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-black text-white uppercase">{{
                  data.university.name
                }}</span>
                <span
                  class="text-[9px] text-surface-500 font-bold tracking-widest"
                  >{{ data.university.code }} •
                  {{ data.university.country }}</span
                >
              </div>
            </div>
          </template>
        </Column>
        <Column
          field="code"
          header="Agreement Code"
          class="text-[10px] font-black tracking-widest text-primary-400"
        />
        <Column header="Yield Structure">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-xs font-black text-white">
                {{
                  data.commissionType === "PERCENTAGE"
                    ? `${data.commissionRate}%`
                    : `${data.currency} ${data.commissionRate}`
                }}
              </span>
              <span
                class="text-[8px] text-surface-500 font-bold uppercase tracking-tighter"
                >Trigger: {{ data.invoiceTrigger.replace(/_/g, " ") }}</span
              >
            </div>
          </template>
        </Column>
        <Column header="Terms">
          <template #body="{ data }">
            <span class="text-[10px] font-bold text-surface-400 uppercase"
              >{{ data.paymentTermDays }} Days Net</span
            >
          </template>
        </Column>
        <Column header="Validity">
          <template #body="{ data }">
            <div class="flex flex-col text-[10px] font-medium">
              <span class="text-surface-300"
                >From:
                {{ $dayjs(data.effectiveFrom).format("DD MMM YYYY") }}</span
              >
              <span class="text-surface-500"
                >To:
                {{
                  data.effectiveTo
                    ? $dayjs(data.effectiveTo).format("DD MMM YYYY")
                    : "Forever"
                }}</span
              >
            </div>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
              class="text-[8px] font-black tracking-widest uppercase px-3! py-1! rounded-lg!"
            />
          </template>
        </Column>
        <Column header="..." class="text-right">
          <template #body>
            <Button
              icon="pi pi-ellipsis-v"
              class="p-button-text p-button-sm text-surface-400 hover:text-white"
            />
          </template>
        </Column>
      </DashboardGlassTable>
    </div>

    <DashboardFinanceNewAgreementModal
      :visible="newAgreementVisible"
      @close="newAgreementVisible = false"
      @success="fetchAgreements"
    />
  </div>
</template>
