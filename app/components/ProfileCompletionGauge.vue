<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: "compact" | "full";
    userId?: string;
    tabStateKey?: string;
    navigationPath?: string;
  }>(),
  {
    tabStateKey: "activeProfileTab",
    navigationPath: "/applicant-portal/profile",
  }
);

const { completionPercentage, nextAction, pending } = useProfile(
  computed(() => props.userId)
);

const activeTab = useState(props.tabStateKey, () => 0);

const navigateToTab = (tabIndex: number) => {
  activeTab.value = tabIndex;
  if (props.navigationPath) {
    navigateTo(props.navigationPath);
  }
};
</script>

<template>
  <div v-if="!pending" class="flex items-center gap-6 group/guage">
    <!-- The Gauge Circular UI -->
    <div class="relative w-16 h-16 shrink-0">
      <svg class="w-16 h-16 transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          stroke-width="4"
          fill="transparent"
          class="text-white/5"
        />
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="currentColor"
          stroke-width="4"
          fill="transparent"
          :stroke-dasharray="2 * Math.PI * 30"
          :stroke-dashoffset="
            2 * Math.PI * 30 * (1 - (completionPercentage || 0) / 100)
          "
          class="text-primary-500 transition-all duration-1000 ease-out"
          stroke-linecap="round"
        />
      </svg>
      <div
        class="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white"
      >
        {{ completionPercentage }}%
      </div>
    </div>

    <!-- Textual Intelligence -->
    <div class="flex flex-col gap-1 min-w-0">
      <h4
        class="text-[10px] font-black text-surface-500 uppercase tracking-widest"
      >
        Profile Density
      </h4>
      <div
        v-if="nextAction && completionPercentage < 100"
        class="flex flex-col"
      >
        <span
          class="text-[9px] font-black text-white uppercase italic truncate"
        >
          SYNC: {{ nextAction.label }}
        </span>
        <button
          @click="navigateToTab(nextAction.tab)"
          class="text-[8px] font-black text-primary-400 uppercase tracking-tighter hover:text-primary-300 transition-colors text-left flex items-center gap-1"
        >
          Optimize Now <i class="pi pi-arrow-right text-[7px]"></i>
        </button>
      </div>
      <div v-else class="flex items-center gap-2">
        <span class="text-xs font-black text-white uppercase italic">
          {{
            completionPercentage === 100 ? "fully optimized" : "synchronizing"
          }}
        </span>
        <div
          v-if="completionPercentage < 100"
          class="w-1 h-1 rounded-full bg-primary-500 animate-pulse"
        ></div>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center gap-4 animate-pulse">
    <div class="w-16 h-16 rounded-full bg-white/5" />
    <div class="space-y-2">
      <div class="w-20 h-2 bg-white/5 rounded" />
      <div class="w-12 h-2 bg-white/5 rounded" />
    </div>
  </div>
</template>
