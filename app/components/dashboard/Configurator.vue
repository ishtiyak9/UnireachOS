<script setup lang="ts">
import { useThemeConfig } from "~/composables/useThemeConfig";
import { onMounted, watch } from "vue";

const { state, applyTheme, primaryColors, surfaceColors } = useThemeConfig();

const onPrimaryChange = (name: string) => {
  state.value.primary = name;
  applyTheme();
};

const onSurfaceChange = (name: string) => {
  state.value.surface = name;
  applyTheme();
};

const onDarkModeChange = () => {
  state.value.isDark = !state.value.isDark;
  applyTheme();
};

onMounted(() => {
  applyTheme();
});

watch(
  () => state.value,
  () => {
    if (import.meta.client) {
      applyTheme();
    }
  },
  { deep: true }
);

const menuTypes = [
  { label: "Static", value: "static" },
  { label: "Overlay", value: "overlay" },
  { label: "Slim", value: "slim" },
  { label: "Slim+", value: "slim-plus" },
  { label: "Reveal", value: "reveal" },
  { label: "Drawer", value: "drawer" },
  { label: "Horizontal", value: "horizontal" },
];
</script>

<template>
  <Drawer
    v-model:visible="state.configuratorVisible"
    position="right"
    header="Settings"
    class="!w-80"
  >
    <div class="flex flex-col gap-6">
      <!-- Primary Colors -->
      <section>
        <span class="text-sm font-semibold text-surface-500 block mb-3"
          >Primary</span
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in primaryColors"
            :key="color.name"
            @click="onPrimaryChange(color.name)"
            class="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
            :style="{ backgroundColor: color.palette[500] }"
          >
            <i
              v-if="state.primary === color.name"
              class="pi pi-check text-xs text-white mix-blend-difference"
            />
          </button>
        </div>
      </section>

      <!-- Surface Colors -->
      <section>
        <span class="text-sm font-semibold text-surface-500 block mb-3"
          >Surface</span
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in surfaceColors"
            :key="color.name"
            @click="onSurfaceChange(color.name)"
            class="w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center border border-surface-200 dark:border-surface-700"
            :style="{ backgroundColor: color.palette[500] }"
          >
            <i
              v-if="state.surface === color.name"
              class="pi pi-check text-xs text-white mix-blend-difference"
            />
          </button>
        </div>
      </section>

      <!-- Color Scheme -->
      <section>
        <span class="text-sm font-semibold text-surface-500 block mb-3"
          >Color Scheme</span
        >
        <div
          class="flex items-center gap-2 p-1 bg-surface-100 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700"
        >
          <button
            @click="state.isDark = false"
            class="flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2"
            :class="
              !state.isDark
                ? 'bg-surface-0 text-surface-900 shadow-sm'
                : 'text-surface-500 hover:text-surface-900'
            "
          >
            <i class="pi pi-sun" />
            Light
          </button>
          <button
            @click="state.isDark = true"
            class="flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2"
            :class="
              state.isDark
                ? 'bg-surface-700 text-surface-0 shadow-sm'
                : 'text-surface-500 hover:text-surface-900'
            "
          >
            <i class="pi pi-moon" />
            Dark
          </button>
        </div>
      </section>

      <!-- Menu Type -->
      <section>
        <span class="text-sm font-semibold text-surface-500 block mb-3"
          >Menu Type</span
        >
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="type in menuTypes"
            :key="type.value"
            class="flex items-center"
          >
            <RadioButton
              v-model="state.menuMode"
              :inputId="type.value"
              :value="type.value"
            />
            <label :for="type.value" class="ml-2 text-sm">{{
              type.label
            }}</label>
          </div>
        </div>
      </section>

      <!-- Menu Profile -->
      <section>
        <span class="text-sm font-semibold text-surface-500 block mb-3"
          >Menu Profile</span
        >
        <div class="flex items-center gap-4">
          <div class="flex items-center">
            <RadioButton
              v-model="state.menuProfile"
              inputId="profile-start"
              value="start"
            />
            <label for="profile-start" class="ml-2 text-sm">Start</label>
          </div>
          <div class="flex items-center">
            <RadioButton
              v-model="state.menuProfile"
              inputId="profile-end"
              value="end"
            />
            <label for="profile-end" class="ml-2 text-sm">End</label>
          </div>
        </div>
      </section>
    </div>
  </Drawer>
</template>

<style scoped>
.spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
