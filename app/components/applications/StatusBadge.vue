<script setup lang="ts">
const props = defineProps<{
  status: string;
  external?: boolean;
}>();

const getSeverity = (status: string) => {
  const s = status.toLowerCase();
  if (
    s.includes("rejected") ||
    s.includes("withdrawn") ||
    s.includes("refused")
  )
    return "danger";
  if (
    s.includes("offer") ||
    s.includes("approved") ||
    s.includes("enrolled") ||
    s.includes("success")
  )
    return "success";
  if (
    s.includes("action") ||
    s.includes("requested") ||
    s.includes("incomplete")
  )
    return "warn";
  if (s.includes("under review") || s.includes("processing")) return "info";
  return "secondary";
};
</script>

<template>
  <Tag
    :value="status"
    :severity="getSeverity(status)"
    class="px-2 py-0.5 !text-[10px] font-bold uppercase ring-1 ring-inset"
    :class="{
      'ring-emerald-500/20 bg-emerald-500/10 text-emerald-400':
        getSeverity(status) === 'success',
      'ring-rose-500/20 bg-rose-500/10 text-rose-400':
        getSeverity(status) === 'danger',
      'ring-amber-500/20 bg-amber-500/10 text-amber-400':
        getSeverity(status) === 'warn',
      'ring-blue-500/20 bg-blue-500/10 text-blue-400':
        getSeverity(status) === 'info',
      'ring-slate-500/20 bg-slate-500/10 text-slate-400':
        getSeverity(status) === 'secondary',
    }"
  />
</template>
