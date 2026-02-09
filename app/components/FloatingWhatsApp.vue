<script setup lang="ts">
import { ref, onMounted } from "vue";
import { contactInfo } from "@/config/contact";

const showMessage = ref(false);
const phoneNumber = contactInfo.whatsapp.number.replace("+", "");
const prefilledMessage = encodeURIComponent(
  "Hi Unireach! I'm interested in studying in Europe."
);

const whatsappUrl = `https://wa.me/${phoneNumber}?text=${prefilledMessage}`;

// Show the "Chat with us" bubble after a slight delay for attention
onMounted(() => {
  setTimeout(() => {
    showMessage.value = true;
  }, 3000);
});
</script>

<template>
  <div
    class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
  >
    <!-- Chat Bubble (Simulated Message) -->
    <Transition name="fade-slide">
      <div
        v-if="showMessage"
        class="pointer-events-auto bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-xl rounded-2xl rounded-br-none p-4 max-w-[200px] relative animate-float"
      >
        <div class="flex items-start gap-3">
          <div class="relative">
            <div
              class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200"
            >
              <i class="pi pi-user text-emerald-600 text-xs"></i>
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-surface-900"
            ></div>
          </div>
          <div class="flex-1 space-y-1">
            <p
              class="text-[10px] font-bold text-surface-400 uppercase tracking-wider"
            >
              Support
            </p>
            <p
              class="text-xs font-medium text-surface-900 dark:text-surface-0 leading-snug"
            >
              Hi! Looking for
              <span class="text-emerald-500 font-bold">scholarships?</span>
            </p>
          </div>
        </div>

        <!-- Close Button -->
        <button
          @click="showMessage = false"
          class="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-500 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
        >
          <i class="pi pi-times text-[10px]"></i>
        </button>
      </div>
    </Transition>

    <!-- Floating Action Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="pointer-events-auto group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all duration-300"
    >
      <!-- Pulse Effect -->
      <div
        class="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20"
      ></div>
      <div
        class="absolute inset-0 rounded-full border border-white/50 animate-pulse"
      ></div>

      <!-- Icon -->
      <i class="pi pi-whatsapp text-white text-xl"></i>

      <!-- Badge -->
      <div
        class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white dark:border-surface-950 flex items-center justify-center animate-bounce"
      >
        <span class="text-[9px] font-bold text-white">1</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) translateX(10px) scale(0.9);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
