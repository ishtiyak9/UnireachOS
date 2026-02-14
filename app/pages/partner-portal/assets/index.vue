<script setup lang="ts">
definePageMeta({
  layout: "partner",
  middleware: "auth",
});

const { data: assets, pending } = await useFetch(
  "/api/partners/marketing-assets"
);

const getFileIcon = (type: string) => {
  switch (type) {
    case "IMAGE":
      return "pi pi-image";
    case "VIDEO":
      return "pi pi-video";
    case "PDF":
      return "pi pi-file-pdf";
    case "ZIP":
      return "pi pi-box";
    default:
      return "pi pi-file";
  }
};
</script>

<template>
  <div class="space-y-8 pb-20 font-[Outfit]">
    <!-- Strategic Header -->
    <PartnerHeader
      title="Toolkit"
      subtitle="Accessing the global marketing repository for institutional brand assets."
      badge="Asset Distribution"
    >
      <template #title-prefix>Marketing&nbsp;</template>
    </PartnerHeader>

    <div class="px-4">
      <!-- Live Intelligence Grid -->
      <div
        v-if="pending"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="h-64 rounded-3xl bg-white/5 animate-pulse"
        />
      </div>

      <div
        v-else-if="assets?.length"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="asset in assets"
          :key="asset.id"
          class="group relative bg-[#0a0f0d] border border-emerald-900/10 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 shadow-2xl flex flex-col"
        >
          <!-- Preview / Thumbnail -->
          <div
            class="h-40 bg-black/40 flex items-center justify-center relative overflow-hidden shrink-0"
          >
            <div v-if="asset.thumbnail" class="absolute inset-0">
              <img
                :src="asset.thumbnail"
                class="w-full h-full object-cover opacity-30"
              />
            </div>
            <i
              :class="[
                getFileIcon(asset.fileType),
                'text-4xl text-emerald-900/40 relative z-10 group-hover:scale-110 group-hover:text-emerald-500/40 transition-all duration-500',
              ]"
            ></i>

            <div class="absolute top-3 left-3 flex gap-2">
              <span
                class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 backdrop-blur-md"
              >
                {{ asset.fileType }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 flex-1 flex flex-col">
            <h3
              class="text-sm font-bold text-white uppercase tracking-tight mb-2 group-hover:text-emerald-400 transition-colors"
            >
              {{ asset.title }}
            </h3>
            <p
              class="text-[10px] text-surface-500 line-clamp-3 leading-relaxed mb-6"
            >
              {{
                asset.description ||
                "Access high-fidelity institutional promotional material."
              }}
            </p>

            <div
              class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between"
            >
              <span
                class="text-[8px] font-black text-emerald-900 uppercase tracking-widest"
                >Authorized</span
              >
              <a
                :href="asset.fileUrl"
                target="_blank"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all duration-300 text-[9px] font-black uppercase tracking-widest"
              >
                <i class="pi pi-download"></i>
                Get Asset
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="h-[50vh] flex flex-col items-center justify-center text-center space-y-6"
      >
        <div class="relative">
          <div
            class="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-150"
          />
          <i class="pi pi-box text-6xl text-emerald-900/20 relative z-10" />
        </div>
        <div class="space-y-2">
          <h2
            class="text-2xl font-black text-white/40 uppercase tracking-tighter"
          >
            Vault <span class="text-emerald-900/40">Secured</span>
          </h2>
          <p
            class="text-[10px] font-black text-surface-600 uppercase tracking-[0.4em]"
          >
            No promotional intelligence shared with this cluster yet.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../../assets/css/main.css";
</style>
