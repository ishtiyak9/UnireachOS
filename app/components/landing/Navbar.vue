<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isScrolled = ref<boolean>(false);
const mobileMenuOpen = ref<boolean>(false);

const menuItems = [
  { label: "About Us", to: "/about" },
  { label: "Study Abroad", to: "/students" },
  { label: "Destinations", to: "/destinations" },
  {
    label: "Migration",
    children: [
      {
        label: "Business Immigration",
        to: "/business-immigration",
        icon: "pi pi-briefcase",
      },
      { label: "Job Immigration", to: "/Job-immigration", icon: "pi pi-user" },
    ],
  },
  { label: "Success Stories", to: "/success-stories" },
  { label: "Contact", to: "/contact" },
];

const activeDropdown = ref<string | null>(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav
    class="w-full h-16 md:h-14 sticky top-0 z-50 border-b border-white/5 bg-surface-950/80 backdrop-blur-2xl transition-all duration-500"
    :class="{ 'h-14 md:h-12 shadow-2xl shadow-black/20': isScrolled }"
  >
    <div
      class="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between"
    >
      <!-- Logo Section -->
      <BaseLogo />

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-1">
        <template v-for="item in menuItems" :key="item.label">
          <div
            v-if="item.children"
            class="relative group"
            @mouseenter="activeDropdown = item.label"
            @mouseleave="activeDropdown = null"
          >
            <button
              class="relative flex items-center gap-1.5 px-4 py-2 text-[10px] font-black text-surface-300 hover:text-white transition-all tracking-[0.15em] uppercase group"
            >
              <span class="relative z-10">{{ item.label }}</span>
              <i
                class="pi pi-chevron-down text-[7px] transition-transform group-hover:rotate-180 relative z-10"
              ></i>
              <!-- Hover Gradient Underline -->
              <div
                class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <!-- Subtle Glow -->
              <div
                class="absolute inset-0 bg-primary-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </button>

            <!-- Ultra-Premium Dropdown -->
            <div
              v-show="activeDropdown === item.label"
              class="absolute top-full left-0 mt-3 w-64 p-1.5 bg-surface-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in duration-200 overflow-hidden"
            >
              <!-- Gradient Border Glow -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-primary-600/20 rounded-2xl blur-xl opacity-50"
              ></div>

              <div class="relative space-y-1 p-1">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.label"
                  :to="child.to"
                  class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group/item relative overflow-hidden"
                >
                  <!-- Hover Gradient Background -->
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  ></div>

                  <div
                    class="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 flex items-center justify-center border border-primary-500/20 group-hover/item:border-primary-500/40 group-hover/item:scale-110 transition-all duration-300"
                  >
                    <i
                      :class="[
                        child.icon,
                        'text-sm text-primary-500 group-hover/item:text-primary-400',
                      ]"
                    ></i>
                  </div>
                  <span
                    class="relative text-[10px] font-black uppercase tracking-[0.15em] text-surface-300 group-hover/item:text-white transition-colors"
                  >
                    {{ child.label }}
                  </span>
                  <i
                    class="pi pi-arrow-right text-[8px] text-primary-500 ml-auto opacity-0 group-hover/item:opacity-100 transform translate-x-[-4px] group-hover/item:translate-x-0 transition-all duration-300"
                  ></i>
                </NuxtLink>
              </div>
            </div>
          </div>
          <NuxtLink
            v-else
            :to="item.to"
            class="relative px-4 py-2 text-[10px] font-black text-surface-300 hover:text-white transition-all tracking-[0.15em] uppercase group"
          >
            <span class="relative z-10">{{ item.label }}</span>
            <!-- Hover Gradient Underline -->
            <div
              class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <!-- Subtle Glow -->
            <div
              class="absolute inset-0 bg-primary-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </NuxtLink>
        </template>
      </div>

      <!-- Premium Action Buttons -->
      <div class="hidden md:flex items-center gap-3">
        <button
          class="relative px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-surface-400 hover:text-white transition-all group overflow-hidden"
        >
          <span class="relative z-10">Sign In</span>
          <div
            class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity"
          ></div>
        </button>
        <NuxtLink
          to="/apply"
          class="relative px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-black bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105 group overflow-hidden"
        >
          <span class="relative z-10">Apply Now</span>
          <!-- Animated Shine Effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
          ></div>
        </NuxtLink>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="md:hidden">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <i
            :class="[
              mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars',
              'text-white text-sm',
            ]"
          ></i>
        </button>
      </div>
    </div>

    <!-- Premium Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-x-0 top-16 md:top-14 bg-surface-950/98 backdrop-blur-3xl border-b border-white/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl z-40"
      >
        <template v-for="item in menuItems" :key="item.label">
          <div v-if="item.children" class="flex flex-col gap-3">
            <span
              class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-500 opacity-60 px-1"
              >{{ item.label }}</span
            >
            <NuxtLink
              v-for="child in item.children"
              :key="child.label"
              :to="child.to"
              class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all group"
              @click="mobileMenuOpen = false"
            >
              <div
                class="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
              >
                <i :class="[child.icon, 'text-primary-500 text-sm']"></i>
              </div>
              <span
                class="text-sm font-black text-white uppercase tracking-wider group-hover:text-primary-500 transition-colors"
              >
                {{ child.label }}
              </span>
            </NuxtLink>
          </div>
          <NuxtLink
            v-else
            :to="item.to"
            class="text-lg font-black text-white uppercase tracking-tight hover:text-primary-500 transition-colors px-1"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
        <hr class="border-white/10" />
        <div class="flex flex-col gap-3">
          <button
            class="w-full h-12 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all"
          >
            Sign In
          </button>
          <NuxtLink
            to="/apply"
            class="w-full h-12 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-[10px] font-black uppercase tracking-widest text-black hover:shadow-xl hover:shadow-primary-500/30 transition-all flex items-center justify-center"
            @click="mobileMenuOpen = false"
          >
            Apply Now
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>
