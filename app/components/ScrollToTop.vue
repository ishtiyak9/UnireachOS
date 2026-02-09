<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);

const checkScroll = () => {
  isVisible.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", checkScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", checkScroll);
});
</script>

<template>
  <Transition name="fade-up">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-6 right-20 z-40 w-12 h-12 rounded-full bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-lg flex items-center justify-center text-surface-500 hover:text-primary-500 hover:border-primary-500 hover:-translate-y-1 transition-all duration-300 group"
      aria-label="Scroll to top"
    >
      <i class="pi pi-arrow-up text-lg group-hover:animate-bounce"></i>
    </button>
  </Transition>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
