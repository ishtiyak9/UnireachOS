<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "auth",
  title: "Forgot Password",
});

const email = ref("");
const isLoading = ref(false);
const isSent = ref(false);

const handleReset = async () => {
  isLoading.value = true;
  // Simulate API call
  console.log("Sending reset link to:", email.value);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isLoading.value = false;
  isSent.value = true;
};
</script>

<template>
  <div class="relative w-full">
    <!-- Card Container -->
    <div
      class="relative bg-surface-900/50 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      <!-- Decor: Top Glow -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"
      />

      <!-- Header -->
      <div class="space-y-4 text-center mb-6">
        <div class="inline-flex justify-center">
          <BaseLogo class="scale-110" />
        </div>
        <div>
          <h1 class="text-xl font-black text-white tracking-tight mb-1">
            Reset Password
          </h1>
          <p class="text-xs text-surface-400">
            Enter your email to receive instructions
          </p>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="isSent" class="text-center space-y-6 py-4">
        <div
          class="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="pi pi-check-circle text-2xl text-primary-500" />
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-bold text-white">Check your email</h3>
          <p class="text-xs text-surface-400 leading-relaxed">
            We've sent a password reset link to<br />
            <span class="text-white font-medium">{{ email }}</span>
          </p>
        </div>
        <button
          @click="isSent = false"
          class="text-[10px] font-bold text-surface-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          Try another email
        </button>
      </div>

      <!-- Reset Form -->
      <form v-else @submit.prevent="handleReset" class="space-y-4">
        <!-- Email Input -->
        <div class="space-y-1">
          <label
            class="text-[10px] font-bold text-surface-300 uppercase tracking-wider ml-1"
            >Email Address</label
          >
          <div class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
            />
            <input
              v-model="email"
              type="email"
              placeholder="name@example.com"
              class="w-full bg-surface-950/50 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:bg-surface-900/80 transition-all duration-300"
              required
            />
            <i
              class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-surface-500 group-focus-within:text-primary-500 transition-colors"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full relative group overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-black font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div
            class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          />
          <span class="relative flex items-center justify-center gap-2">
            <i v-if="isLoading" class="pi pi-spinner animate-spin" />
            <span v-else>Send Reset Link</span>
          </span>
        </button>
      </form>

      <!-- Back to Login Link -->
      <div class="text-center mt-6">
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-2 text-[10px] font-bold text-surface-400 hover:text-white uppercase tracking-wider transition-colors group"
        >
          <i
            class="pi pi-arrow-left text-[8px] group-hover:-translate-x-1 transition-transform"
          />
          Back to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
