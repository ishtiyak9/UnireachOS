<script setup lang="ts">
const sidebarVisible = ref(true);
const isMobile = ref(false);

// Check if mobile on mount
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024;
    if (isMobile.value) {
      sidebarVisible.value = false;
    }
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });
});

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div
    class="min-h-screen bg-surface-950 text-surface-200 selection:bg-primary-500/30"
  >
    <!-- Background Texture/Depth -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"
      />
      <div
        class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4"
      />
    </div>

    <!-- Sidebar -->
    <DashboardSidebar
      :visible="sidebarVisible"
      :is-mobile="isMobile"
      @toggle="toggleSidebar"
    />

    <!-- Theme Configurator -->
    <DashboardConfigurator />

    <!-- Topbar -->
    <DashboardTopbar
      @toggle-sidebar="toggleSidebar"
      :class="[sidebarVisible && !isMobile ? 'lg:left-64' : 'left-0']"
    />

    <!-- Main Content Area -->
    <div
      class="relative z-10 transition-all duration-300 min-h-screen flex flex-col overflow-x-hidden"
      :class="[sidebarVisible && !isMobile ? 'lg:ml-64' : 'ml-0']"
    >
      <!-- Spacer for fixed Topbar (Header h-12 = h-12) -->
      <div class="h-12 w-full shrink-0" />

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-8 w-full max-w-[100vw]">
        <slot />
      </main>

      <!-- Footer Placeholder -->
      <footer class="p-6 border-t border-white/5 text-center mt-auto">
        <p
          class="text-[9px] font-black text-surface-600 uppercase tracking-[0.3em]"
        >
          &copy; 2026 UniReach Intelligence Systems v4.0.0
        </p>
      </footer>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarVisible && isMobile"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
      @click="toggleSidebar"
    />
  </div>
</template>

<style>
/* Global Dashboard Overrides */
body {
  background-color: #0a0a0a;
}

/* Custom Scrollbar for the whole app */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.2);
}
</style>
