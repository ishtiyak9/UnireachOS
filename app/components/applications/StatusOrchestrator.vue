<script setup lang="ts">
import {
  APPLICATION_PRIORITIES,
  ALL_LEAD_STATUSES,
} from "~/../shared/constants";

const props = defineProps<{
  application: any;
}>();

const emit = defineEmits(["updated"]);
const loading = ref(false);

const localStatus = ref(props.application.status);
const localPriority = ref(props.application.priority);
const updateReason = ref("");

const updateState = async () => {
  if (!updateReason.value && localStatus.value !== props.application.status) {
    // Optionally require a reason for status changes
  }

  loading.value = true;
  try {
    await $fetch(`/api/admin/applications/${props.application.id}`, {
      method: "PATCH",
      body: {
        status: localStatus.value,
        priority: localPriority.value,
        reason: updateReason.value,
      },
    });
    emit("updated");
    updateReason.value = "";
  } catch (e) {
    console.error("Failed to orchestrate state change", e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="bg-surface-900 border border-surface-800 rounded-2xl p-6 shadow-xl space-y-6"
  >
    <div class="flex items-center gap-2 mb-2">
      <i class="pi pi-sliders-h text-blue-400"></i>
      <h3 class="text-sm font-bold uppercase tracking-widest text-surface-200">
        State Orchestrator
      </h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label
          class="text-[10px] font-bold text-surface-500 uppercase tracking-tighter"
          >Internal Status</label
        >
        <Select
          v-model="localStatus"
          :options="ALL_LEAD_STATUSES"
          class="w-full !bg-surface-950 !border-surface-700 !text-sm"
        />
      </div>

      <div class="space-y-2">
        <label
          class="text-[10px] font-bold text-surface-500 uppercase tracking-tighter"
          >Execution Priority</label
        >
        <Select
          v-model="localPriority"
          :options="Object.keys(APPLICATION_PRIORITIES)"
          class="w-full !bg-surface-950 !border-surface-700 !text-sm"
        />
      </div>
    </div>

    <div class="space-y-2">
      <label
        class="text-[10px] font-bold text-surface-500 uppercase tracking-tighter"
        >Logic / Change Reason (Optional)</label
      >
      <Textarea
        v-model="updateReason"
        placeholder="Enter tactical reason for this state transition..."
        rows="2"
        class="w-full !bg-surface-950 !border-surface-700 !text-sm focus:!border-blue-500 transition-all"
      />
    </div>

    <Button
      label="Execute State Transition"
      icon="pi pi-check-circle"
      @click="updateState"
      :loading="loading"
      :disabled="
        localStatus === application.status &&
        localPriority === application.priority
      "
      class="w-full !bg-blue-600 !border-none hover:!bg-blue-500 transition-all shadow-[0_4px_10px_rgba(37,99,235,0.2)]"
    />
  </div>
</template>
