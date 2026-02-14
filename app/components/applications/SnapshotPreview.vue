<script setup lang="ts">
const props = defineProps<{
  title: string;
  data: any;
  icon: string;
}>();
</script>

<template>
  <div
    class="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-lg h-full"
  >
    <div
      class="px-5 py-4 bg-surface-800/50 border-b border-surface-700 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <i :class="[icon, 'text-blue-400']"></i>
        <h3
          class="text-xs font-bold uppercase tracking-widest text-surface-200"
        >
          {{ title }}
        </h3>
      </div>
      <Tag
        value="STORED SNAPSHOT"
        severity="secondary"
        class="!text-[9px] font-mono opacity-50"
      />
    </div>

    <div class="p-5 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
      <div
        v-for="(value, key) in data"
        :key="key"
        class="group border-b border-surface-800/50 pb-2 last:border-0"
      >
        <template v-if="typeof value !== 'object' || value === null">
          <label
            class="text-[9px] font-bold text-surface-500 uppercase block mb-0.5 group-hover:text-blue-400 transition-colors"
          >
            {{ key.replace(/([A-Z])/g, " $1").trim() }}
          </label>
          <span class="text-sm text-surface-200 break-words">{{
            value || "N/A"
          }}</span>
        </template>

        <template v-else-if="Array.isArray(value) && value.length > 0">
          <label
            class="text-[9px] font-bold text-surface-500 uppercase block mb-1"
          >
            {{ key.replace(/([A-Z])/g, " $1").trim() }}
          </label>
          <div class="space-y-2">
            <div
              v-for="(item, idx) in value"
              :key="idx"
              class="p-2 rounded bg-surface-950 text-[11px] text-surface-400 border border-surface-800"
            >
              <pre class="whitespace-pre-wrap font-sans">{{
                JSON.stringify(item, null, 2)
              }}</pre>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--p-surface-700);
  border-radius: 9999px;
}
</style>
