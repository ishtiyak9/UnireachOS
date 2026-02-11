<script setup lang="ts">
import type {
  Document,
  DocumentCategory,
  DocumentStatus,
} from "@prisma/client";

interface Props {
  category: DocumentCategory;
  label: string;
  isMandatory?: boolean;
  document?: Document | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMandatory: false,
  loading: false,
});

const emit = defineEmits<{
  (e: "upload", category: DocumentCategory): void;
  (e: "delete", id: string): void;
  (e: "view", id: string): void;
  (e: "requestUnlock", id: string): void;
}>();

const getStatusDetails = (status?: DocumentStatus) => {
  switch (status) {
    case "VERIFIED":
      return {
        label: "Verified",
        color: "success",
        icon: "pi pi-check-circle",
      };
    case "REJECTED":
      return { label: "Rejected", color: "danger", icon: "pi pi-times-circle" };
    case "PENDING":
      return { label: "Under Review", color: "warn", icon: "pi pi-clock" };
    case "OFFICIAL":
      return { label: "Official", color: "info", icon: "pi pi-shield" };
    default:
      return {
        label: "Missing",
        color: "secondary",
        icon: "pi pi-cloud-upload",
      };
  }
};

const statusDetails = computed(() => getStatusDetails(props.document?.status));

const fileIcon = computed(() => {
  if (!props.document) return "pi pi-cloud-upload text-xl";
  const mime = props.document.mimeType || "";
  if (mime.includes("pdf")) return "pi pi-file-pdf text-indigo-400 text-xl";
  if (mime.includes("image")) return "pi pi-image text-emerald-400 text-xl";
  return "pi pi-file text-surface-400 text-xl";
});

const handleUpload = () => {
  // Only block if document exists AND is locked (verified)
  if (props.document?.isLocked) return;
  emit("upload", props.category);
};
</script>

<template>
  <div
    class="relative group animate-fade-in-up w-full"
    :class="[loading ? 'opacity-50 pointer-events-none' : '']"
  >
    <!-- Horizontal Glass Card -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.05] hover:border-primary-500/30 transition-all duration-300 backdrop-blur-md gap-4"
    >
      <!-- Left: Icon & Info -->
      <div class="flex items-center gap-4 flex-grow min-w-0">
        <div
          class="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors"
        >
          <i :class="fileIcon" />
        </div>

        <div class="min-w-0 flex flex-col justify-center">
          <div class="flex items-center gap-2">
            <h3
              class="text-sm font-bold text-white truncate max-w-[200px] md:max-w-none"
            >
              {{ label }}
            </h3>
            <span
              v-if="isMandatory && !document"
              class="text-[7px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded border border-primary-500/20 whitespace-nowrap"
            >
              Mandatory
            </span>
          </div>
          <div class="flex items-center gap-3 mt-1">
            <p
              v-if="document"
              class="text-[12px] text-surface-400 font-medium truncate max-w-[150px] md:max-w-[250px]"
            >
              {{ document.name }}
            </p>
            <p v-else class="text-[12px] text-surface-500 italic">
              Awaiting upload...
            </p>
            <span
              v-if="document"
              class="text-[11px] text-surface-600 font-mono"
            >
              {{ (document.fileSize / 1024).toFixed(1) }} KB
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Status & Actions -->
      <div
        class="flex items-center justify-between md:justify-end gap-3 flex-shrink-0"
      >
        <!-- Status Badge -->
        <div
          v-if="document"
          :class="[
            'px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest flex items-center gap-1.5',
            document.status === 'VERIFIED'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : document.status === 'REJECTED'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : document.status === 'PENDING'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          ]"
        >
          <i :class="statusDetails.icon" class="text-[12px]" />
          {{ statusDetails.label }}
        </div>

        <div class="flex items-center gap-1">
          <!-- Action Buttons -->
          <template v-if="document">
            <Button
              icon="pi pi-eye"
              size="small"
              text
              class="!w-8 !h-8 !p-0 !text-surface-400 hover:!text-primary-400"
              @click="emit('view', document.id)"
            />
            <Button
              v-if="!document.isLocked"
              icon="pi pi-trash"
              size="small"
              text
              class="!w-8 !h-8 !p-0 !text-surface-400 hover:!text-rose-400"
              @click="emit('delete', document.id)"
            />
          </template>

          <Button
            v-if="document?.isLocked"
            icon="pi pi-unlock"
            size="small"
            text
            class="!w-8 !h-8 !p-0 !text-surface-500 hover:!text-amber-500"
            v-tooltip.top="'Request Unlock'"
            @click="emit('requestUnlock', document.id)"
          />

          <Button
            v-if="!document || !document.isLocked"
            :label="document ? 'Replace' : 'Upload'"
            :icon="document ? 'pi pi-sync' : 'pi pi-cloud-upload'"
            size="small"
            variant="text"
            class="!text-[12px] !font-black !uppercase !tracking-widest"
            :class="
              document
                ? '!text-surface-400 hover:!text-white'
                : '!bg-primary-500 !text-black !px-4 hover:!bg-primary-400 border-0'
            "
            @click="handleUpload"
          />
        </div>
      </div>
    </div>

    <!-- Footnote for Rejection -->
    <div
      v-if="document?.status === 'REJECTED' && document.adminNote"
      class="mt-2 ml-16 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 animate-in slide-in-from-top-1 duration-300"
    >
      <div class="flex items-start gap-2">
        <i class="pi pi-exclamation-circle text-rose-400 text-xs mt-0.5" />
        <div class="space-y-1">
          <span
            class="text-[11px] font-black text-rose-400 uppercase tracking-widest leading-none"
            >Correction Required</span
          >
          <p class="text-[12px] text-surface-300 leading-relaxed">
            {{ document.adminNote }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
