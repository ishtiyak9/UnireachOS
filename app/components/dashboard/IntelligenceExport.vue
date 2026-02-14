<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  data: any[];
  columns: { field: string; header: string }[];
  fileName?: string;
  label?: string;
  reportTitle?: string;
}>();

const menu = ref();
const isExporting = ref(false);

const items = [
  {
    label: "Excel Spreadsheet",
    icon: "pi pi-file-excel",
    command: () => exportToExcel(),
  },
  {
    label: "PDF Document",
    icon: "pi pi-file-pdf",
    command: () => exportToPDF(),
  },
];

const toggle = (event: any) => {
  menu.value.toggle(event);
};

// Tactical Script Injector - Bypasses local environment restrictions
const loadDependency = (id: string, url: string) => {
  return new Promise((resolve) => {
    if ((window as any)[id]) return resolve((window as any)[id]);
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve((window as any)[id]);
    document.head.appendChild(script);
  });
};

const exportToExcel = async () => {
  isExporting.value = true;
  try {
    await loadDependency(
      "XLSX",
      "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"
    );
    const XLSX = (window as any).XLSX;

    const worksheet = XLSX.utils.json_to_sheet(
      props.data.map((item) => {
        const row: any = {};
        props.columns.forEach((col) => {
          row[col.header] = item[col.field];
        });
        return row;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Intelligence");
    XLSX.writeFile(workbook, `${props.fileName || "export"}.xlsx`);
  } catch (error) {
    console.error("Excel Export Error:", error);
  } finally {
    isExporting.value = false;
  }
};

const exportToPDF = async () => {
  isExporting.value = true;
  try {
    // PDF requires both jsPDF and AutoTable
    await loadDependency(
      "jspdf",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    );
    await loadDependency(
      "jspdfAutotable",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"
    );

    // @ts-ignore
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();

    const headers = props.columns.map((c) => c.header);
    const body = props.data.map((row) =>
      props.columns.map((c) => row[c.field])
    );

    // UniReach OS Branding
    doc.setFontSize(18);
    doc.text(
      props.reportTitle?.toUpperCase() || "MISSION INTELLIGENCE REPORT",
      14,
      15
    );
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`GENERATED: ${new Date().toLocaleString()}`, 14, 22);

    // @ts-ignore
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [15, 15, 15], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    doc.save(`${props.fileName || "report"}.pdf`);
  } catch (error) {
    console.error("PDF Export Error:", error);
  } finally {
    isExporting.value = false;
  }
};
</script>

<template>
  <div class="relative inline-block">
    <Button
      type="button"
      icon="pi pi-download"
      :label="label || 'Export Data'"
      @click="toggle"
      :loading="isExporting"
      class="bg-surface-900! border-white/5! text-surface-400! hover:text-white! text-[9px]! font-black! uppercase! tracking-[0.2em]! px-4! h-10! rounded-xl! transition-all shadow-xl hover:bg-surface-800!"
    />

    <Menu
      ref="menu"
      :model="items"
      :popup="true"
      class="bg-surface-950! border-white/10! shadow-2xl! min-w-48 overflow-hidden rounded-2xl"
    >
      <template #item="{ item, props }">
        <a
          v-ripple
          class="flex items-center px-4 py-3.5 cursor-pointer group hover:bg-white/5 transition-colors"
          v-bind="props.action"
        >
          <div
            class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-primary-500/10 transition-colors"
          >
            <span
              :class="[
                item.icon,
                'text-surface-500 group-hover:text-primary-500 text-xs',
              ]"
            />
          </div>
          <div class="flex flex-col">
            <span
              class="text-[10px] font-black uppercase tracking-widest text-surface-300 group-hover:text-white transition-colors"
            >
              {{ item.label }}
            </span>
            <span
              class="text-[8px] text-surface-600 font-bold uppercase tracking-widest"
            >
              {{ item.label.includes("Excel") ? "XLSX" : "PDF" }} FORMAT
            </span>
          </div>
        </a>
      </template>
    </Menu>
  </div>
</template>

<style scoped>
:deep(.p-menu) {
  padding: 0.5rem !important;
}
:deep(.p-menu-list) {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.25rem !important;
}
</style>
