<script setup lang="ts">
definePageMeta({
  title: "Document Vault",
  layout: "applicant",
  middleware: "auth",
});

useHead({
  title: "Document Vault | UniReach OS",
});

const { user } = useUserSession();

// Mock Data for Vault
const documents = ref([
  {
    id: 1,
    name: "Academic_Transcript_Undergrad.pdf",
    type: "Academic",
    status: "VERIFIED",
    date: "2026-01-15",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Passport_Scan_Main.jpg",
    type: "Identity",
    status: "VERIFIED",
    date: "2026-01-10",
    size: "1.2 MB",
  },
  {
    id: 3,
    name: "IELTS_Certificate_2025.pdf",
    type: "Language",
    status: "PENDING",
    date: "2026-02-05",
    size: "850 KB",
  },
  {
    id: 4,
    name: "Personal_Statement_Draft_V2.docx",
    type: "Supporting",
    status: "DRAFT",
    date: "2026-02-10",
    size: "45 KB",
  },
]);

const filters = ref({
  global: { value: null, matchMode: "contains" },
});

const getStatusBadge = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "DRAFT":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-surface-500/10 text-surface-400 border-surface-500/20";
  }
};
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <!-- Background Decor (Identical Design) -->
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"
    />

    <!-- Header -->
    <div
      class="relative flex flex-col md:flex-row md:items-end justify-between gap-4"
    >
      <div class="space-y-1">
        <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
          Document
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 italic"
            >Vault</span
          >
        </h1>
        <p class="text-surface-400 text-sm font-medium">
          Secure, encrypted storage for your institutional credentials.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <Button
          icon="pi pi-upload"
          label="Upload Document"
          class="!bg-linear-to-r !from-primary-500 !to-primary-600 !border-0 !text-black !text-[10px] font-black uppercase tracking-wider px-6 rounded-xl shadow-lg shadow-primary-500/20"
        />
      </div>
    </div>

    <!-- Vault Table -->
    <DashboardGlassTable
      :value="documents"
      v-model:filters="filters"
      dataKey="id"
      :paginator="true"
      :rows="10"
    >
      <template #header>
        <div
          class="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-white/5 bg-white/[0.01] gap-4"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center border border-primary-500/20"
            >
              <i class="pi pi-shield text-primary-500 text-xs" />
            </div>
            <span
              class="text-[10px] font-black uppercase tracking-[0.2em] text-white"
              >Encrypted Archive</span
            >
          </div>
          <div class="p-input-icon-left w-full md:w-auto">
            <i class="pi pi-search text-surface-600" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Filter vault..."
              class="!bg-surface-950/50 !border-white/10 !text-[11px] w-full md:w-80 rounded-xl py-3"
            />
          </div>
        </div>
      </template>

      <Column field="name" header="Filename" sortable>
        <template #body="{ data }">
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center"
            >
              <i
                class="pi pi-file-pdf text-indigo-400"
                v-if="data.name.endsWith('.pdf')"
              />
              <i
                class="pi pi-image text-emerald-400"
                v-else-if="data.name.endsWith('.jpg')"
              />
              <i class="pi pi-file text-surface-400" v-else />
            </div>
            <div class="flex flex-col">
              <span class="text-white font-bold text-sm tracking-tight">{{
                data.name
              }}</span>
              <span
                class="text-[9px] text-surface-500 uppercase font-black tracking-widest"
                >{{ data.size }}</span
              >
            </div>
          </div>
        </template>
      </Column>

      <Column field="type" header="Category" sortable>
        <template #body="{ data }">
          <span
            class="text-xs font-bold text-surface-400 uppercase tracking-wider"
            >{{ data.type }}</span
          >
        </template>
      </Column>

      <Column field="status" header="Verification" sortable>
        <template #body="{ data }">
          <div
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest',
              getStatusBadge(data.status),
            ]"
          >
            {{ data.status }}
          </div>
        </template>
      </Column>

      <Column field="date" header="Upload Date" sortable>
        <template #body="{ data }">
          <span class="text-[10px] text-surface-400 font-mono">{{
            data.date
          }}</span>
        </template>
      </Column>

      <Column header="Actions" headerStyle="width: 5rem;">
        <template #body>
          <div class="flex items-center gap-2">
            <Button
              icon="pi pi-download"
              text
              class="!text-surface-400 hover:!text-primary-500"
            />
            <Button
              icon="pi pi-trash"
              text
              class="!text-surface-400 hover:!text-rose-500"
            />
          </div>
        </template>
      </Column>
    </DashboardGlassTable>

    <!-- Integrity Footer -->
    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex items-center gap-6"
    >
      <div
        class="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20"
      >
        <i class="pi pi-lock text-primary-500" />
      </div>
      <div>
        <h4 class="text-xs font-black text-white uppercase tracking-widest">
          End-to-End Encryption
        </h4>
        <p
          class="text-[10px] text-surface-500 font-medium uppercase mt-1 tracking-tight"
        >
          Your documents are secured with AES-256 institutional grade
          encryption.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(40px) saturate(180%);
}
h1,
h2,
h3,
h4 {
  font-family: "Outfit", "Inter", sans-serif;
}
</style>
