<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "auth",
  title: "Create Account",
});

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  isLoading.value = true;
  // Simulate API call
  console.log("Registering with:", name.value, email.value, password.value);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  isLoading.value = false;
  // Handle success/error
};

const handleSocialLogin = (provider: string) => {
  console.log("Register with:", provider);
};
</script>

<template>
  <div class="relative w-full">
    <!-- Card Container -->
    <div
      class="relative bg-surface-900/50 border border-white/10 rounded-3xl p-5 md:p-6 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      <!-- Decor: Top Glow -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"
      />

      <!-- Header -->
      <div class="space-y-3 text-center mb-5">
        <div class="inline-flex justify-center">
          <BaseLogo class="scale-100" />
        </div>
        <div>
          <h1 class="text-lg font-black text-white tracking-tight mb-0.5">
            Create Account
          </h1>
          <p class="text-[10px] text-surface-400">
            Start your journey with Unireach
          </p>
        </div>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-3">
        <!-- Name & Email Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- Name Input -->
          <div class="space-y-1">
            <label
              class="text-[9px] font-bold text-surface-300 uppercase tracking-wider ml-1"
              >Full Name</label
            >
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
              />
              <input
                v-model="name"
                type="text"
                placeholder="John Doe"
                class="w-full bg-surface-950/50 border border-white/10 rounded-xl px-3 py-2 pl-9 text-[11px] text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:bg-surface-900/80 transition-all duration-300"
                required
              />
              <i
                class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-500 group-focus-within:text-primary-500 transition-colors"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div class="space-y-1">
            <label
              class="text-[9px] font-bold text-surface-300 uppercase tracking-wider ml-1"
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
                class="w-full bg-surface-950/50 border border-white/10 rounded-xl px-3 py-2 pl-9 text-[11px] text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:bg-surface-900/80 transition-all duration-300"
                required
              />
              <i
                class="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-500 group-focus-within:text-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Password Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label
              class="text-[9px] font-bold text-surface-300 uppercase tracking-wider ml-1"
              >Password</label
            >
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
              />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full bg-surface-950/50 border border-white/10 rounded-xl px-3 py-2 pl-9 text-[11px] text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:bg-surface-900/80 transition-all duration-300"
                required
              />
              <i
                class="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-500 group-focus-within:text-primary-500 transition-colors"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label
              class="text-[9px] font-bold text-surface-300 uppercase tracking-wider ml-1"
              >Confirm</label
            >
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
              />
              <input
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full bg-surface-950/50 border border-white/10 rounded-xl px-3 py-2 pl-9 text-[11px] text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:bg-surface-900/80 transition-all duration-300"
                required
              />
              <i
                class="pi pi-lock absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-500 group-focus-within:text-primary-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Show Password Toggle -->
        <div class="flex items-center justify-end">
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="flex items-center gap-1.5 text-[9px] font-bold text-surface-400 hover:text-white transition-colors focus:outline-none uppercase tracking-wider"
          >
            <i
              :class="[
                showPassword ? 'pi pi-eye-slash' : 'pi pi-eye',
                'text-[10px]',
              ]"
            />
            {{ showPassword ? "Hide" : "Show" }}
          </button>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full relative group overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-black font-black text-[10px] uppercase tracking-widest py-2.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div
            class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          />
          <span class="relative flex items-center justify-center gap-2">
            <i v-if="isLoading" class="pi pi-spinner animate-spin" />
            <span v-else>Create Account</span>
          </span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/10" />
        </div>
        <div class="relative flex justify-center text-[9px]">
          <span class="px-2 bg-surface-900 text-surface-500 font-medium"
            >Or register with</span
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
            class="pi pi-google text-[10px] text-white group-hover:scale-110 transition-transform"
          />
          <span class="text-[9px] font-bold text-white uppercase tracking-wide"
            >Google</span
          >
        </button>
        <button
          @click="handleSocialLogin('facebook')"
          class="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <i
            class="pi pi-facebook text-[10px] text-blue-400 group-hover:scale-110 transition-transform"
          />
          <span class="text-[9px] font-bold text-white uppercase tracking-wide"
            >Facebook</span
          >
        </button>
      </div>

      <!-- Login Link -->
      <div class="text-center mt-4">
        <p class="text-[9px] text-surface-400">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-primary-500 hover:text-primary-400 font-bold uppercase tracking-wider transition-colors ml-1"
          >
            Sign In
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
