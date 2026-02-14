<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import type { Document, DocumentCategory } from "@prisma/client";

definePageMeta({
  title: "Document Vault",
  layout: "applicant",
  middleware: "auth",
});

useHead({
  title: "Document Vault | Unireach OS",
});

const toast = useToast();
const { user: sessionUser } = useUserSession();

// --- STATE ---
const activeTab = ref(0);

// Fetch Documents
const {
  data: documents,
  refresh,
  pending: docsPending,
} = useFetch<Document[]>(() =>
  sessionUser.value?.id
    ? `/api/applicants/${sessionUser.value.id}/documents`
    : null
);

// Fetch Profile for Education History logic
const { data: profileResponse, pending: profilePending } = useFetch(() =>
  sessionUser.value?.id
    ? `/api/applicants/${sessionUser.value.id}/profile`
    : null
);

const profile = computed(() => profileResponse.value?.data || {});
const educationHistory = computed(() => profile.value.educationHistory || []);

// --- DYNAMIC STUDY LEVEL LOGIC ---
// Mirroring the academic qualification logic: Inferred based on existing history
const inferredStudyLevel = computed(() => {
  if (!educationHistory.value.length) return "Bachelors";

  const levels = educationHistory.value.map((e: any) => e.level);

  if (levels.includes("POSTGRADUATE")) return "PhD";
  if (levels.includes("UNDERGRADUATE")) return "Masters";
  if (levels.includes("GRADE_12") || levels.includes("DIPLOMA"))
    return "Bachelors";

  return "Bachelors";
});

// --- CONFIGURATION ---
const categories = {
  IDENT: [
    { id: "PASSPORT", label: "Copy of Passport", mandatory: true },
    { id: "PASSPORT_PHOTO", label: "Passport Size Photo", mandatory: true },
    { id: "CV", label: "Curriculum Vitae (CV)", mandatory: true },
    {
      id: "SOP_ESSAY",
      label: "SOP / Essay / Personal Statement",
      mandatory: true,
    },
    { id: "LOR", label: "Letter of Recommendation (LOR)", mandatory: true },
  ],
  ACAD: [
    { id: "STD_10_MARKSHEET", label: "Std. 10th Marksheet", mandatory: true },
    {
      id: "STD_10_CERTIFICATE",
      label: "Std. 10th Certificate",
      mandatory: true,
    },
    { id: "STD_12_MARKSHEET", label: "Std. 12th Marksheet", mandatory: true },
    {
      id: "STD_12_CERTIFICATE",
      label: "Std. 12th Certificate",
      mandatory: true,
    },
    {
      id: "BACHELORS_TRANSCRIPTS",
      label: "Bachelors Individual Marksheets / Transcripts",
      mandatory: false,
    },
    {
      id: "BACHELORS_CERTIFICATE",
      label: "Bachelors Degree Certificate",
      mandatory: false,
    },
    {
      id: "MASTERS_TRANSCRIPTS",
      label: "Masters Transcripts",
      mandatory: false,
    },
    {
      id: "MASTERS_CERTIFICATE",
      label: "Masters Degree Certificate",
      mandatory: false,
    },
  ],
  LANG: [
    {
      id: "ENGLISH_CERTIFICATE",
      label: "English Language Certificate (IELTS/PTE/TOEFL)",
      mandatory: true,
    },
    {
      id: "MOI_LETTER",
      label: "Medium of Instruction (MOI) Letter",
      mandatory: true,
    },
  ],
  OPTIONAL: [
    {
      id: "CONSOLIDATED_MARKSHEET",
      label: "Consolidated Marksheets",
      mandatory: false,
    },
    {
      id: "WORK_EXPERIENCE_LETTER",
      label: "Work Experience Letter",
      mandatory: false,
    },
    { id: "POWER_OF_ATTORNEY", label: "Power of Attorney", mandatory: false },
    { id: "GRE_GMAT", label: "GRE / GMAT Score Card", mandatory: false },
  ],
};

// Help helper to get document by category
const getDocByCategory = (cat: string) =>
  documents.value?.find(
    (d) => d.category === cat && d.uploadSource === "APPLICANT"
  );

// Filter Official Docs
const officialDocs = computed(
  () => documents.value?.filter((d) => d.uploadSource === "STAFF") || []
);

// Dynamic Mandatory Check
const isMandatory = (docId: string) => {
  // Always mandatory
  const baseMandatory = [
    "STD_10_MARKSHEET",
    "STD_10_CERTIFICATE",
    "STD_12_MARKSHEET",
    "STD_12_CERTIFICATE",
    "PASSPORT",
    "PASSPORT_PHOTO",
    "CV",
    "SOP_ESSAY",
    "LOR",
    "ENGLISH_CERTIFICATE",
    "MOI_LETTER",
  ];
  if (baseMandatory.includes(docId)) return true;

  // Level-specific
  if (inferredStudyLevel.value === "Masters" && docId.includes("BACHELORS"))
    return true;
  if (
    inferredStudyLevel.value === "PhD" &&
    (docId.includes("BACHELORS") || docId.includes("MASTERS"))
  )
    return true;

  return false;
};

// --- ACTIONS ---
const fileInput = ref<HTMLInputElement | null>(null);
const uploadingCategory = ref<DocumentCategory | null>(null);

const triggerUpload = (cat: DocumentCategory) => {
  uploadingCategory.value = cat;
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file || !uploadingCategory.value) return;

  // 500KB Limit Check (500 * 1024 bytes)
  const MAX_SIZE = 500 * 1024;
  if (file.size > MAX_SIZE) {
    toast.add({
      severity: "error",
      summary: "File Too Large",
      detail: `"${file.name}" exceeds the 500KB limit. Please compress your file.`,
      life: 5000,
    });
    if (fileInput.value) fileInput.value.value = "";
    uploadingCategory.value = null;
    return;
  }

  // Strictly Maintain File Type (PDF, PNG, JPG, JPEG)
  const allowedExtensions = ["pdf", "png", "jpg", "jpeg"];
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split(".").pop();

  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    toast.add({
      severity: "error",
      summary: "Invalid File Type",
      detail: `Only PDF, PNG, and JPG/JPEG files are accepted.`,
      life: 5000,
    });
    if (fileInput.value) fileInput.value.value = "";
    uploadingCategory.value = null;
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", uploadingCategory.value);

  try {
    await $fetch(`/api/applicants/${sessionUser.value?.id}/documents`, {
      method: "POST",
      body: formData,
    });
    toast.add({
      severity: "success",
      summary: "Upload Successful",
      detail: `${file.name} has been archived.`,
      life: 3000,
    });
    refresh();
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Upload Failed",
      detail: e.data?.message || "File could not be uploaded.",
      life: 5000,
    });
  } finally {
    uploadingCategory.value = null;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const deleteDoc = async (id: string) => {
  try {
    await $fetch(`/api/documents/${id}`, { method: "DELETE" });
    toast.add({
      severity: "info",
      summary: "Deleted",
      detail: "Document removed from vault.",
      life: 2000,
    });
    refresh();
  } catch (e: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e.data?.message || "Failed to delete.",
      life: 5000,
    });
  }
};

const viewDoc = (id: string) => {
  window.open(`/api/documents/${id}/view`, "_blank");
};

// --- UNLOCK REQUEST LOGIC ---
const unlockDocDialogVisible = ref(false);
const docToUnlock = ref<string | null>(null);
const unlockReason = ref("");
const isRequestingUnlock = ref(false);

const triggerDocUnlock = (id: string) => {
  docToUnlock.value = id;
  unlockDocDialogVisible.value = true;
};

const submitDocUnlockRequest = async () => {
  if (unlockReason.value.length < 10) {
    toast.add({
      severity: "warn",
      summary: "Reason Too Short",
      detail: "Please provide a more detailed reason (min 10 chars).",
      life: 3000,
    });
    return;
  }

  isRequestingUnlock.value = true;
  try {
    await $fetch(
      `/api/applicants/${sessionUser.value?.id}/documents/${docToUnlock.value}/unlock-request`,
      {
        method: "POST",
        body: { reason: unlockReason.value },
      }
    );
    toast.add({
      severity: "success",
      summary: "Request Sent",
      detail: "Your request to unlock this document has been submitted.",
      life: 5000,
    });
    unlockDocDialogVisible.value = false;
    unlockReason.value = "";
    docToUnlock.value = null;
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "Request Failed",
      detail: err.data?.message || "Failed to submit request.",
      life: 5000,
    });
  } finally {
    isRequestingUnlock.value = false;
  }
};
</script>

<template>
  <div class="relative space-y-8 pb-32 max-w-5xl mx-auto">
    <!-- Hidden File Input -->
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      @change="handleFileChange"
      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
    />

    <!-- Background Decor -->
    <div
      class="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48"
    />

    <!-- Header -->
    <div
      class="relative flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div class="space-y-1">
        <h1 class="text-3xl lg:text-4xl font-black text-white tracking-tight">
          Document
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 italic"
            >Vault</span
          >
        </h1>
        <p class="text-surface-400 text-base font-medium">
          Centralized archive for your academic credentials and official
          correspondence.
        </p>
      </div>

      <!-- Upload Constraints Warning Banner -->
      <div
        class="flex items-center gap-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl animate-pulse-subtle"
      >
        <div
          class="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20"
        >
          <i class="pi pi-info-circle text-amber-500 text-xs" />
        </div>
        <div class="flex flex-col">
          <p
            class="text-[10px] font-black text-amber-500/80 uppercase tracking-widest"
          >
            Upload Logic
          </p>
          <p
            class="text-[11px] font-bold text-surface-300 uppercase tracking-wider"
          >
            Max 500KB • PDF, PNG, JPG Only
          </p>
        </div>
      </div>
    </div>

    <!-- Main Tabs -->
    <div class="flex items-center gap-10 border-b border-white/5 relative">
      <button
        @click="activeTab = 0"
        class="pb-5 text-[12px] font-black uppercase tracking-[0.3em] transition-all relative"
        :class="
          activeTab === 0
            ? 'text-primary-500'
            : 'text-surface-500 hover:text-surface-300'
        "
      >
        Personal Vault
        <div
          v-if="activeTab === 0"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 shadow-[0_-4px_15px_rgba(var(--primary-500),0.6)]"
        />
      </button>
      <button
        @click="activeTab = 1"
        class="pb-5 text-[12px] font-black uppercase tracking-[0.3em] transition-all relative"
        :class="
          activeTab === 1
            ? 'text-primary-500'
            : 'text-surface-500 hover:text-surface-300'
        "
      >
        Official Documents
        <div
          v-if="activeTab === 1"
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 shadow-[0_-4px_15px_rgba(var(--primary-500),0.6)]"
        />
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="docsPending" class="space-y-10 animate-pulse">
      <section v-for="i in 2" :key="i" class="space-y-4">
        <div class="flex items-center gap-4">
          <Skeleton width="150px" height="15px" class="!bg-white/5" />
          <div class="h-px bg-white/5 flex-grow" />
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="j in 3"
            :key="j"
            class="h-24 w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <Skeleton shape="circle" size="3rem" class="!bg-white/5" />
              <div class="space-y-2">
                <Skeleton width="200px" height="15px" class="!bg-white/5" />
                <Skeleton width="100px" height="10px" class="!bg-white/5" />
              </div>
            </div>
            <Skeleton
              width="80px"
              height="30px"
              class="!bg-white/5 rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-500/5 border border-red-500/20 rounded-3xl p-12 text-center backdrop-blur-xl"
    >
      <div
        class="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <i class="pi pi-cloud-offline text-2xl" />
      </div>
      <h2 class="text-xl font-black text-white uppercase tracking-widest mb-2">
        Vault Connection Error
      </h2>
      <p class="text-red-400/60 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
        We were unable to establish a secure link with your document vault.
        Please verify your connection status.
      </p>
      <Button
        label="Retry Sync"
        icon="pi pi-refresh"
        @click="refresh"
        class="bg-red-500! text-black! border-0! text-[12px]! font-black uppercase tracking-widest px-8 py-3 rounded-xl"
      />
    </div>

    <!-- TAB 0: Applicant Uploads (Vertical List Layout) -->
    <div
      v-else-if="activeTab === 0"
      class="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700"
    >
      <!-- Section: Identity -->
      <section class="space-y-4">
        <h2
          class="text-[13px] font-black text-primary-500/80 uppercase tracking-[0.4em] flex items-center gap-4"
        >
          Identity & Documents
          <div class="h-px bg-white/5 flex-grow" />
        </h2>
        <div class="flex flex-col gap-3">
          <ApplicantDocumentCard
            v-for="item in categories.IDENT"
            :key="item.id"
            :category="item.id as any"
            :label="item.label"
            :isMandatory="isMandatory(item.id)"
            :document="getDocByCategory(item.id)"
            @upload="triggerUpload"
            @delete="deleteDoc"
            @view="viewDoc"
            @requestUnlock="triggerDocUnlock"
          />
        </div>
      </section>

      <!-- Section: Academic -->
      <section class="space-y-4">
        <h2
          class="text-[13px] font-black text-primary-500/80 uppercase tracking-[0.4em] flex items-center gap-4"
        >
          Academic History
          <div class="h-px bg-white/5 flex-grow" />
        </h2>
        <div class="flex flex-col gap-3">
          <ApplicantDocumentCard
            v-for="item in categories.ACAD"
            :key="item.id"
            :category="item.id as any"
            :label="item.label"
            :isMandatory="isMandatory(item.id)"
            :document="getDocByCategory(item.id)"
            @upload="triggerUpload"
            @delete="deleteDoc"
            @view="viewDoc"
            @requestUnlock="triggerDocUnlock"
          />
        </div>
      </section>

      <!-- Section: Language -->
      <section class="space-y-4">
        <h2
          class="text-[13px] font-black text-primary-500/80 uppercase tracking-[0.4em] flex items-center gap-4"
        >
          Language Proficiency
          <div class="h-px bg-white/5 flex-grow" />
        </h2>
        <div class="flex flex-col gap-3">
          <ApplicantDocumentCard
            v-for="item in categories.LANG"
            :key="item.id"
            :category="item.id as any"
            :label="item.label"
            :isMandatory="isMandatory(item.id)"
            :document="getDocByCategory(item.id)"
            @upload="triggerUpload"
            @delete="deleteDoc"
            @view="viewDoc"
            @requestUnlock="triggerDocUnlock"
          />
        </div>
      </section>

      <!-- Section: Optional -->
      <section class="space-y-4">
        <h2
          class="text-[11px] font-black text-surface-600 uppercase tracking-[0.4em] flex items-center gap-4"
        >
          Supporting Exhibits
          <div class="h-px bg-white/5 flex-grow" />
        </h2>
        <div class="flex flex-col gap-3">
          <ApplicantDocumentCard
            v-for="item in categories.OPTIONAL"
            :key="item.id"
            :category="item.id as any"
            :label="item.label"
            :isMandatory="false"
            :document="getDocByCategory(item.id)"
            @upload="triggerUpload"
            @delete="deleteDoc"
            @view="viewDoc"
            @requestUnlock="triggerDocUnlock"
          />
          <ApplicantDocumentCard
            category="OTHER"
            label="Additional Specific Document"
            :isMandatory="false"
            :document="null"
            @upload="triggerUpload"
          />
        </div>
      </section>
    </div>

    <!-- TAB 1: UniReach Documents -->
    <div v-else class="animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div v-if="officialDocs.length > 0" class="flex flex-col gap-3">
        <ApplicantDocumentCard
          v-for="doc in officialDocs"
          :key="doc.id"
          :category="doc.category"
          :label="doc.category.replace(/_/g, ' ')"
          :document="doc"
          @view="viewDoc"
        />
      </div>
      <div
        v-else
        class="py-24 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/5 rounded-[40px] transition-all hover:bg-white/[0.02]"
      >
        <div
          class="w-20 h-20 rounded-[30px] bg-white/[0.02] flex items-center justify-center mb-6 shadow-inner"
        >
          <i class="pi pi-folder-open text-surface-700 text-3xl" />
        </div>
        <h3 class="text-sm font-black text-white uppercase tracking-[0.3em]">
          Vault is Empty
        </h3>
        <p class="text-[12px] text-surface-500 mt-2 font-medium">
          Official university letters and confirmations will appear here.
        </p>
      </div>
    </div>

    <!-- Protection Footer -->
    <div
      class="bg-surface-950/40 border border-white/5 rounded-[32px] p-8 backdrop-blur-3xl flex flex-col md:flex-row items-center gap-8 group"
    >
      <div
        class="w-16 h-16 rounded-2xl bg-primary-500/5 flex items-center justify-center border border-primary-500/10 group-hover:bg-primary-500/10 transition-all duration-500"
      >
        <i class="pi pi-shield text-primary-500 text-xl" />
      </div>
      <div class="text-center md:text-left">
        <h4 class="text-base font-black text-white uppercase tracking-widest">
          Enterprise Privacy Standards
        </h4>
        <p
          class="text-[13px] text-surface-500 font-medium leading-relaxed mt-2 max-w-2xl"
        >
          All uploads are automatically scanned for malware and encrypted at
          rest using AES-256. Verification logs are recorded for institutional
          compliance and audit trails.
        </p>
      </div>
    </div>

    <!-- Document Unlock Request Dialog -->
    <Dialog
      v-model:visible="unlockDocDialogVisible"
      modal
      header="Request Document Correction"
      :style="{ width: '450px' }"
      class="border border-white/10 bg-surface-950/90! backdrop-blur-2xl rounded-3xl"
    >
      <div class="space-y-6 py-4">
        <div
          class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4"
        >
          <i class="pi pi-exclamation-triangle text-amber-500 mt-1" />
          <p class="text-[12px] font-medium text-surface-300 leading-relaxed">
            This document is verified. To replace it, you must first request an
            unlock from the administration.
          </p>
        </div>

        <div class="space-y-2">
          <label
            class="text-[12px] font-black text-surface-500 uppercase tracking-widest"
            >Reason for Update</label
          >
          <Textarea
            v-model="unlockReason"
            rows="4"
            autoResize
            class="w-full !bg-white/[0.03] !border-white/10 !text-white rounded-2xl p-4 text-sm"
            placeholder="Explain why this document needs to be re-uploaded..."
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 mt-4">
          <Button
            label="Dismiss"
            text
            class="!text-surface-500 uppercase tracking-widest text-[12px] font-black"
            @click="unlockDocDialogVisible = false"
          />
          <Button
            label="Send Request"
            icon="pi pi-send"
            :loading="isRequestingUnlock"
            @click="submitDocUnlockRequest"
            class="!bg-amber-500 !text-black !border-0 !text-[12px] font-black uppercase tracking-widest px-6 rounded-xl"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.backdrop-blur-3xl {
  backdrop-filter: blur(60px) saturate(200%);
}
h1,
h2,
h3,
h4,
button {
  font-family: "Outfit", "Inter", sans-serif;
}
</style>
