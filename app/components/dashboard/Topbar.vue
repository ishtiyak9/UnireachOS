<script setup lang="ts">
import { useThemeConfig } from "~/composables/useThemeConfig";
const emit = defineEmits(["toggleSidebar"]);

const route = useRoute();
const { user } = useUserSession();
const { state } = useThemeConfig();

const { unreadCount } = useNotifications();
const notificationDrawerVisible = ref(false);

// Breadcrumb generation
const breadcrumbs = computed(() => {
  const paths = route.path.split("/").filter(Boolean);
  return paths.map((path, index) => ({
    label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
    to: "/" + paths.slice(0, index + 1).join("/"),
    active: index === paths.length - 1,
  }));
});

const userMenuVisible = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const toggleUserMenu = (event: Event) => {
  event.stopPropagation();
  userMenuVisible.value = !userMenuVisible.value;
};

const closeUserMenu = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuVisible.value = false;
  }
};

const toggleConfigurator = () => {
  state.value.configuratorVisible = !state.value.configuratorVisible;
};

onMounted(() => {
  window.addEventListener("click", closeUserMenu);
});

onUnmounted(() => {
  window.removeEventListener("click", closeUserMenu);
});

const handleLogout = async () => {
  await $fetch("/api/auth/logout", { method: "POST" });
  await navigateTo("/login");
};

const userInitials = computed(() => {
  if (!user.value?.profile?.firstName || !user.value?.profile?.lastName) {
    return user.value?.email?.charAt(0).toUpperCase() || "U";
  }
  return (
    user.value.profile.firstName.charAt(0) +
    user.value.profile.lastName.charAt(0)
  ).toUpperCase();
});

const fullName = computed(() => {
  if (!user.value?.profile?.firstName || !user.value?.profile?.lastName) {
    return user.value?.email?.split("@")[0] || "User";
  }
  return `${user.value.profile.firstName} ${user.value.profile.lastName}`;
});
</script>

<template>
  <div
    class="fixed top-0 right-0 z-40 flex flex-col group/header transition-[left] duration-300 ease-in-out"
  >
    <!-- Main Navigation Bar -->
    <header
      class="h-11 bg-surface-950/40 backdrop-blur-md border-b border-white/[0.03] px-4 lg:px-6 transition-all duration-500 hover:bg-surface-950/60 relative"
    >
      <!-- Top Border Highlight -->
      <div
        class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-700"
      />

      <div
        class="h-full flex items-center justify-between mx-auto w-full relative"
      >
        <!-- Left Section -->
        <div class="flex items-center gap-4">
          <button
            class="lg:hidden w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-95"
            @click="emit('toggleSidebar')"
          >
            <i class="pi pi-bars text-[10px]" />
          </button>

          <!-- Minimalist Breadcrumbs -->
          <nav class="hidden md:flex items-center gap-2">
            <NuxtLink
              to="/dashboard"
              class="text-surface-500 hover:text-primary-400 transition-colors"
            >
              <i class="pi pi-home text-[10px]" />
            </NuxtLink>

            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <i class="pi pi-angle-right text-[7px] text-surface-700" />
              <NuxtLink
                v-if="!crumb.active"
                :to="crumb.to"
                class="text-[8px] font-bold text-surface-500 hover:text-white uppercase tracking-[0.2em] whitespace-nowrap transition-colors"
              >
                {{ crumb.label }}
              </NuxtLink>
              <span
                v-else
                class="text-[8px] font-bold text-primary-500 uppercase tracking-[0.2em] whitespace-nowrap"
              >
                {{ crumb.label }}
              </span>
            </template>
          </nav>
        </div>

        <!-- Right Section Action Bar -->
        <div class="flex items-center gap-4">
          <!-- Slim Search -->
          <div
            class="hidden sm:flex items-center bg-white/[0.02] border border-white/[0.03] rounded-lg px-2.5 py-1 focus-within:bg-white/[0.05] focus-within:border-primary-500/30 transition-all duration-500 group/search"
          >
            <i
              class="pi pi-search text-[8px] text-surface-600 group-focus-within/search:text-primary-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Command..."
              class="bg-transparent border-none text-[8px] text-white placeholder-surface-700 focus:outline-none ml-2 w-24 lg:w-32 uppercase font-black tracking-widest"
            />
          </div>

          <!-- Action Hub -->
          <div class="flex items-center gap-1.5 text-surface-500">
            <button
              class="w-7 h-7 rounded-lg hover:text-white hover:bg-white/5 transition-all relative group/btn"
              @click="notificationDrawerVisible = true"
            >
              <i class="pi pi-bell text-[11px]" />
              <span
                v-if="unreadCount > 0"
                class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_5px_rgba(212,175,55,1)]"
              />
            </button>

            <button
              class="w-7 h-7 rounded-lg hover:text-white hover:bg-white/5 transition-all"
              @click="toggleConfigurator"
            >
              <i class="pi pi-cog text-[11px]" />
            </button>
          </div>

          <!-- User Quick Access -->
          <div class="relative" ref="userMenuRef">
            <button
              class="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-white/5 transition-all group/profile"
              @click="toggleUserMenu"
            >
              <div class="flex flex-col items-end hidden lg:flex">
                <span
                  class="text-[8px] font-black text-white uppercase tracking-wider group-hover/profile:text-primary-400 transition-colors"
                  >{{ fullName }}</span
                >
                <span
                  class="text-[6px] font-black text-surface-600 uppercase tracking-[0.3em] mt-0.5"
                  >{{ user?.roleName }}</span
                >
              </div>
              <Avatar
                :label="userInitials"
                shape="circle"
                class="!bg-gradient-to-br !from-primary-400 !to-primary-600 !text-black !font-black !text-[7px] !w-6 !h-6 !border-0 transition-transform group-hover/profile:scale-105"
              />
            </button>

            <!-- Ultra Slim Dropdown -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="scale-95 opacity-0 -translate-y-2"
              enter-to-class="scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="scale-100 opacity-100 translate-y-0"
              leave-to-class="scale-95 opacity-0 -translate-y-1"
            >
              <div
                v-if="userMenuVisible"
                class="absolute right-0 mt-2 w-48 bg-surface-900 border border-white/5 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-3xl overflow-hidden"
              >
                <div class="px-2.5 py-2 mb-1 border-b border-white/5">
                  <div
                    class="text-[8px] font-black text-surface-500 uppercase tracking-[0.2em] mb-1"
                  >
                    Session Info
                  </div>
                  <div
                    class="text-[9px] font-black text-white uppercase truncate"
                  >
                    {{ fullName }}
                  </div>
                </div>

                <NuxtLink
                  to="/dashboard/profile"
                  class="flex items-center gap-2.5 px-2.5 py-1.5 text-[9px] font-bold text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-wider"
                  @click="userMenuVisible = false"
                >
                  <i class="pi pi-shield text-[10px]" />
                  Account Protection
                </NuxtLink>

                <NuxtLink
                  to="/dashboard/settings"
                  class="flex items-center gap-2.5 px-2.5 py-1.5 text-[9px] font-bold text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-wider"
                  @click="userMenuVisible = false"
                >
                  <i class="pi pi-sliders-h text-[10px]" />
                  Control Panel
                </NuxtLink>

                <div class="h-px bg-white/5 my-1" />

                <button
                  class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[9px] font-black text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all uppercase tracking-wider"
                  @click="handleLogout"
                >
                  <i class="pi pi-power-off text-[10px]" />
                  Disconnect Session
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>
  </div>

  <!-- Notification Drawer -->
  <DashboardNotificationDrawer v-model:visible="notificationDrawerVisible" />
</template>
