<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "auth",
  title: "Login",
});

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  // Simulate API call
  console.log("Logging in with:", email.value, password.value);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isLoading.value = false;
  // Handle success/error
};

const handleSocialLogin = (provider: string) => {
  console.log("Login with:", provider);
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
            Welcome Back
          </h1>
          <p class="text-xs text-surface-400">
            Sign in to access your dashboard
          </p>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Input -->
        <div class="space-y-1">
          <label
            class="text-[10px] font-bold text-surface-300 uppercase tracking-wider ml-1"
            >Email Address</label
          >
          <div class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
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

        <!-- Password Input -->
        <div class="space-y-1">
          <div class="flex items-center justify-between ml-1">
            <label
              class="text-[10px] font-bold text-surface-300 uppercase tracking-wider"
              >Password</label
            >
            <NuxtLink
              to="/forgot-password"
              class="text-[10px] font-bold text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-wider"
              >Forgot?</NuxtLink
            >
          </div>
          <div class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
            />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full bg-surface-950/50 border border-white/10 rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:bg-surface-900/80 transition-all duration-300"
              required
            />
            <i
              class="pi pi-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-surface-500 group-focus-within:text-primary-500 transition-colors"
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white transition-colors focus:outline-none"
            >
              <i
                :class="[
                  showPassword ? 'pi pi-eye-slash' : 'pi pi-eye',
                  'text-xs',
                ]"
              />
            </button>
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
            <span v-else>Sign In</span>
          </span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/10" />
        </div>
        <div class="relative flex justify-center text-[10px]">
          <span class="px-2 bg-surface-900 text-surface-500 font-medium"
            >Or continue with</span
          >
        </div>
      </div>

      <!-- Social Logins -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="handleSocialLogin('google')"
          class="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <i
            class="pi pi-google text-xs text-white group-hover:scale-110 transition-transform"
          />
          <span class="text-[10px] font-bold text-white uppercase tracking-wide"
            >Google</span
          >
        </button>
        <button
          @click="handleSocialLogin('facebook')"
          class="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <i
            class="pi pi-facebook text-xs text-blue-400 group-hover:scale-110 transition-transform"
          />
          <span class="text-[10px] font-bold text-white uppercase tracking-wide"
            >Facebook</span
          >
        </button>
      </div>

      <!-- Register Link -->
      <div class="text-center mt-6">
        <p class="text-[10px] text-surface-400">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="text-primary-500 hover:text-primary-400 font-bold uppercase tracking-wider transition-colors ml-1"
          >
            Sign Up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
