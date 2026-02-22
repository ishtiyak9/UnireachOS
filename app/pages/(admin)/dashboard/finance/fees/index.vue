<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Fee Collections | UniReach OS",
});

const loading = ref(true);
const collections = ref<any[]>([]);

const fetchCollections = async () => {
  try {
    const { data } = await useFetch("/api/admin/finance/fees");
    if (data.value?.success) {
      collections.value = data.value.data;
    }
  } catch (e) {
    console.error("Failed to fetch fee collections:", e);
  } finally {
    loading.value = false;
  }
};

const selectedFee = ref<any>(null);
const settlementVisible = ref(false);
const receiptVisible = ref(false);
const newCollectionVisible = ref(false);

const openSettlement = (fee: any) => {
  selectedFee.value = fee;
  settlementVisible.value = true;
};

const openReceipt = (fee: any) => {
  selectedFee.value = fee;
  receiptVisible.value = true;
};

const handleSettlementSuccess = () => {
  fetchCollections();
};

onMounted(() => {
  fetchCollections();
});

const getStatusSeverity = (status: string) => {
  const map: any = {
    PAID: "success",
    PENDING: "info",
    OVERDUE: "danger",
    WAIVED: "secondary",
    REFUNDED: "warn",
  };
  return map[status] || "secondary";
};

const formatCurrency = (amount: number, currency: string = "BDT") => {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency }).format(
    amount
  );
};
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <DashboardPageHeader
      title="Fee"
      highlight="Collections"
      subtitle="Institutional service fees, visa processing, and application charges."
    >
      <template #actions>
        <Button
          icon="pi pi-plus"
          label="New Collection"
          class="bg-linear-to-r! from-primary-400! to-primary-600! border-0! text-black! text-[10px]! font-black uppercase tracking-wider px-4 rounded-xl shadow-lg shadow-primary-500/10"
          @click="newCollectionVisible = true"
        />
      </template>
    </DashboardPageHeader>

    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
    >
      <DashboardGlassTable
        :value="collections"
        :loading="loading"
        paginator
        :rows="15"
      >
        <Column header="Applicant" class="py-4">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-xs font-black text-white uppercase"
                >{{ data.applicant.firstName }}
                {{ data.applicant.lastName }}</span
              >
              <span
                class="text-[9px] text-surface-500 font-bold tracking-widest"
                >{{ data.applicant.user.email }}</span
              >
            </div>
          </template>
        </Column>
        <Column field="feeType" header="Type">
          <template #body="{ data }">
            <span
              class="text-[10px] font-black text-primary-400 uppercase tracking-tighter"
              >{{ data.feeType.replace(/_/g, " ") }}</span
            >
          </template>
        </Column>
        <Column header="Value">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-xs font-black text-white">{{
                formatCurrency(data.amount, data.currency)
              }}</span>
              <span
                v-if="data.currency !== 'BDT'"
                class="text-[9px] text-surface-500 font-bold uppercase tracking-tighter"
                >~ BDT {{ data.amountBDT.toLocaleString() }}</span
              >
            </div>
          </template>
        </Column>
        <Column header="Status">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="getStatusSeverity(data.status)"
              class="text-[8px] font-black tracking-widest uppercase px-3! py-1! rounded-lg!"
            />
          </template>
        </Column>
        <Column header="Due Date">
          <template #body="{ data }">
            <span
              v-if="data.dueDate"
              class="text-[10px] font-bold"
              :class="
                data.status === 'PENDING' &&
                $dayjs(data.dueDate).isBefore($dayjs())
                  ? 'text-rose-400'
                  : 'text-surface-400'
              "
            >
              {{ $dayjs(data.dueDate).format("DD MMM YYYY") }}
            </span>
            <span v-else class="text-surface-600">—</span>
          </template>
        </Column>
        <Column field="paymentMethod" header="Method">
          <template #body="{ data }">
            <span
              v-if="data.paymentMethod"
              class="text-[9px] font-black text-surface-300 uppercase italic"
              >{{ data.paymentMethod.replace(/_/g, " ") }}</span
            >
            <span v-else class="text-surface-700">—</span>
          </template>
        </Column>
        <Column header="..." class="text-right">
          <template #body="{ data }">
            <div class="flex items-center justify-end gap-2">
              <Button
                v-if="data.status === 'PENDING'"
                icon="pi pi-dollar"
                label="Collect"
                class="p-button-text p-button-sm text-[9px] font-black uppercase tracking-widest text-primary-500! hover:text-white!"
                @click="openSettlement(data)"
              />
              <Button
                v-if="data.status === 'PAID'"
                icon="pi pi-receipt"
                label="Receipt"
                class="p-button-text p-button-sm text-[9px] font-bold uppercase tracking-widest text-surface-500! hover:text-white!"
                @click="openReceipt(data)"
              />
            </div>
          </template>
        </Column>
      </DashboardGlassTable>
    </div>

    <!-- Modals -->
    <DashboardFinanceFeeSettlementModal
      :fee="selectedFee"
      :visible="settlementVisible"
      @close="settlementVisible = false"
      @success="handleSettlementSuccess"
    />
    <DashboardFinanceMoneyReceiptModal
      :record="selectedFee"
      :visible="receiptVisible"
      @close="receiptVisible = false"
    />
    <DashboardFinanceNewFeeCollectionModal
      :visible="newCollectionVisible"
      @close="newCollectionVisible = false"
      @success="fetchCollections"
    />
  </div>
</template>
