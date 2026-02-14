<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const {
  data: assets,
  refresh,
  pending,
} = await useFetch("/api/admin/marketing/assets");

const showCreateModal = ref(false);
const submitting = ref(false);

const newAsset = ref({
  title: "",
  description: "",
  fileUrl: "",
  fileType: "PDF",
  visibility: "ALL",
  thumbnail: "",
});

const visibilityOptions = ref([
  {
    label: "All Channels (Public)",
    value: "ALL",
    icon: "pi pi-globe",
    color: "text-emerald-400",
  },
  {
    label: "Partner Network Only",
    value: "PARTNERS",
    icon: "pi pi-briefcase",
    color: "text-amber-400",
  },
  {
    label: "Internal Staff Only",
    value: "INTERNAL",
    icon: "pi pi-shield",
    color: "text-blue-400",
  },
]);

const fileTypes = ref(["IMAGE", "PDF", "ZIP", "VIDEO", "DOC"]);

const saveAsset = async () => {
  if (!newAsset.value.title || !newAsset.value.fileUrl) return;

  submitting.value = true;
  try {
    await $fetch("/api/admin/marketing/assets", {
      method: "POST",
      body: newAsset.value,
    });
    await refresh();
    showCreateModal.value = false;
    newAsset.value = {
      title: "",
      description: "",
      fileUrl: "",
      fileType: "PDF",
      visibility: "ALL",
      thumbnail: "",
    };
  } catch (error) {
    console.error("Failed to deploy asset", error);
  } finally {
    submitting.value = false;
  }
};

const deleteAsset = async (id: string) => {
  try {
    await $fetch(`/api/admin/marketing/assets/${id}`, { method: "DELETE" });
    await refresh();
  } catch (error) {
    console.error("Failed to purge asset", error);
  }
};

const getVisibilityIcon = (v: string) => {
  return visibilityOptions.value.find((o) => o.value === v);
};
</script>

<template>
  <div class="p-6 space-y-8 bg-surface-950 min-h-screen font-[Outfit]">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1
          class="text-3xl font-bold text-white tracking-tight italic uppercase"
        >
          Marketing <span class="text-blue-500">Toolkit</span>
        </h1>
        <p class="text-surface-400 text-sm">
          Deploy and manage promotional intelligence across global clusters.
        </p>
      </div>
      <Button
        label="Deploy New Asset"
        icon="pi pi-plus"
        class="bg-blue-600! border-none! shadow-[0_0_20px_rgba(37,99,235,0.3)] !text-[10px] !font-black !uppercase !tracking-widest"
        @click="showCreateModal = true"
      />
    </div>

    <!-- Assets Grid -->
    <div
      v-if="pending"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="h-64 rounded-3xl bg-surface-900 animate-pulse"
      />
    </div>

    <div
      v-else-if="assets?.length"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="asset in assets"
        :key="asset.id"
        class="group relative bg-surface-900 border border-surface-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl"
      >
        <!-- Preview / Thumbnail -->
        <div
          class="h-40 bg-surface-950 flex items-center justify-center relative overflow-hidden"
        >
          <div v-if="asset.thumbnail" class="absolute inset-0">
            <img
              :src="asset.thumbnail"
              class="w-full h-full object-cover opacity-50"
            />
          </div>
          <i
            :class="[
              asset.fileType === 'IMAGE'
                ? 'pi pi-image'
                : asset.fileType === 'VIDEO'
                ? 'pi pi-video'
                : asset.fileType === 'PDF'
                ? 'pi pi-file-pdf'
                : 'pi pi-file',
              'text-4xl text-surface-700 relative z-10',
            ]"
          ></i>

          <div class="absolute top-3 left-3 flex gap-2">
            <Tag
              :value="asset.fileType"
              severity="secondary"
              class="!text-[8px] !bg-black/50 !backdrop-blur-md"
            />
          </div>

          <div class="absolute top-3 right-3 z-20">
            <Button
              icon="pi pi-trash"
              class="!w-8 !h-8 !rounded-full !bg-rose-500/20 !text-rose-500 hover:!bg-rose-500 hover:!text-white !border-none transition-all duration-300 opacity-0 group-hover:opacity-100"
              @click="deleteAsset(asset.id)"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3
              class="text-sm font-bold text-white uppercase tracking-tight truncate flex-1 mr-2"
            >
              {{ asset.title }}
            </h3>
            <div v-tooltip.top="getVisibilityIcon(asset.visibility)?.label">
              <i
                :class="[
                  getVisibilityIcon(asset.visibility)?.icon,
                  getVisibilityIcon(asset.visibility)?.color,
                  'text-xs',
                ]"
              ></i>
            </div>
          </div>
          <p
            class="text-[10px] text-surface-500 line-clamp-2 leading-relaxed h-8"
          >
            {{ asset.description || "No tactical briefing provided." }}
          </p>

          <div
            class="pt-4 mt-4 border-t border-surface-800 flex items-center justify-between"
          >
            <span class="text-[9px] font-mono text-surface-500">{{
              new Date(asset.createdAt).toLocaleDateString()
            }}</span>
            <a
              :href="asset.fileUrl"
              target="_blank"
              class="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <i class="pi pi-external-link text-[10px]"></i>
              <span class="text-[10px] uppercase font-black">Open Link</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center p-20 text-center space-y-4"
    >
      <i class="pi pi-megaphone text-6xl text-surface-800" />
      <p
        class="text-surface-500 text-sm font-medium uppercase tracking-[0.2em]"
      >
        Repository Depleted
      </p>
    </div>

    <!-- Genesis Modal -->
    <Dialog
      v-model:visible="showCreateModal"
      modal
      header="Tactical Asset Injection"
      :style="{ width: '30rem' }"
      class="neural-modal"
    >
      <div class="space-y-6 pt-4">
        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
            >Asset Title</label
          >
          <InputText
            v-model="newAsset.title"
            placeholder="e.g. 2026 Germany Prospectus"
            class="w-full bg-surface-950! border-surface-800! text-sm!"
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
            >Briefing (Description)</label
          >
          <Textarea
            v-model="newAsset.description"
            rows="3"
            class="w-full bg-surface-950! border-surface-800! text-sm!"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
              >Target Cluster</label
            >
            <Select
              v-model="newAsset.visibility"
              :options="visibilityOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full bg-surface-950! border-surface-800! text-sm!"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
              >Asset Format</label
            >
            <Select
              v-model="newAsset.fileType"
              :options="fileTypes"
              class="w-full bg-surface-950! border-surface-800! text-sm!"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1"
            >Intelligence Source (URL)</label
          >
          <InputText
            v-model="newAsset.fileUrl"
            placeholder="https://..."
            class="w-full bg-surface-950! border-surface-800! text-sm!"
          />
        </div>

        <div class="pt-4 flex gap-3">
          <Button
            label="Abort"
            text
            @click="showCreateModal = false"
            class="flex-1 !text-surface-400"
          />
          <Button
            label="Deploy Intelligence"
            class="flex-1 bg-blue-600! border-none!"
            @click="saveAsset"
            :loading="submitting"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
@reference "../../../../assets/css/main.css";

:deep(.p-dialog-header) {
  @apply bg-surface-950 border-b border-surface-800 py-4;
}
:deep(.p-dialog-title) {
  @apply text-xs font-black uppercase tracking-[0.2em] text-surface-400;
}
:deep(.p-dialog-content) {
  @apply bg-surface-900;
}
</style>
