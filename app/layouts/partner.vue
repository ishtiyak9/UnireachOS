<script setup lang="ts">
/**
 * PARTNER OPERATIONAL LAYOUT
 * Orchestrates Dashboard Sidebar and Topbar specific to Agent roles.
 */
const sidebarVisible = ref(true);
const isMobile = ref(false);

onMounted(() => {
  const checkMobile = () => {
    const wasMobile = isMobile.value;
    isMobile.value = window.innerWidth < 1024;
    if (wasMobile && !isMobile.value) sidebarVisible.value = true;
    if (!wasMobile && isMobile.value) sidebarVisible.value = false;
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);
});

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};
</script>

<template>
  <div
    class="min-h-screen bg-[#020202] text-white selection:bg-emerald-500/30 font-sans"
  >
    <!-- Background Architecture -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grain-y.com/assets/grain.png')]"
      />
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"
      />
    </div>

    <!-- Mobile Overlay Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobile && sidebarVisible"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        @click="toggleSidebar"
      />
    </Transition>

    <!-- Partner Component Registry -->
    <PartnerSidebar
      :visible="sidebarVisible"
      :is-mobile="isMobile"
      @toggle="toggleSidebar"
    />

    <div
      class="transition-all duration-300 ease-in-out relative z-10"
      :class="[sidebarVisible && !isMobile ? 'lg:pl-64' : 'pl-0']"
    >
      <PartnerTopbar
        @toggle-sidebar="toggleSidebar"
        :is-mobile="isMobile"
        :class="[sidebarVisible && !isMobile ? 'lg:left-64' : 'left-0']"
      />

      <main class="p-4 lg:p-8 pt-20 lg:pt-24 min-h-screen">
        <slot />
      </main>

      <footer class="p-6 border-t border-emerald-900/10 text-center">
        <p
          class="text-[9px] font-bold text-surface-600 uppercase tracking-[0.4em]"
        >
          UniReach Global Partner Network • Secured Intelligence Pathway
        </p>
      </footer>
    </div>
  </div>
</template>

<style>
/* Corporate Scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.3);
}
</style>
