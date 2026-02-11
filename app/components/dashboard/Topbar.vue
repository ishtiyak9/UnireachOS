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
  const nodes = paths.filter((p) => p !== "dashboard");

  if (nodes.length === 0) {
    return [{ label: "OVERVIEW", to: "/dashboard", active: true }];
  }

  return nodes.map((node, index) => ({
    label: node.replace(/-/g, " ").toUpperCase(),
    to: "/dashboard/" + nodes.slice(0, index + 1).join("/"),
    active: index === nodes.length - 1,
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
    class="fixed top-0 left-0 right-0 z-40 flex flex-col group/header transition-[left] duration-300 ease-in-out"
  >
    <!-- Main Topbar -->
    <header
      class="h-12 bg-surface-950/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-6 flex items-center justify-between relative"
    >
      <!-- Glass Highlight -->
      <div
        class="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-500/20 to-transparent"
      />

      <!-- Left: Mobile Toggle & Breadcrumbs -->
      <div class="flex items-center gap-4">
        <button
          class="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-95"
          @click="emit('toggleSidebar')"
        >
          <i class="pi pi-bars text-xs" />
        </button>

        <!-- Refined In-Header Breadcrumbs -->
        <nav class="hidden md:flex items-center gap-3">
          <NuxtLink
            to="/dashboard"
            class="text-surface-600 hover:text-primary-400 transition-colors flex items-center group/home"
          >
            <i
              class="pi pi-home text-[10px] group-hover/home:scale-110 transition-transform"
            />
          </NuxtLink>

          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <div class="flex items-center gap-3">
              <span class="text-surface-800 text-[8px] font-black select-none"
                >/</span
              >
              <NuxtLink
                v-if="!crumb.active"
                :to="crumb.to"
                class="text-[9px] font-black text-surface-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                {{ crumb.label }}
              </NuxtLink>
              <span
                v-else
                class="text-[9px] font-black text-primary-500/80 uppercase tracking-[0.2em]"
              >
                {{ crumb.label }}
              </span>
            </div>
          </template>
        </nav>
      </div>

      <!-- Right: Search & User Actions -->
      <div class="flex items-center gap-3">
        <!-- Slim Command Search -->
        <div
          class="hidden sm:flex items-center bg-white/2 border border-white/5 rounded-full px-3 py-1 focus-within:bg-white/5 focus-within:border-primary-500/30 transition-all duration-300 group/search"
        >
          <i
            class="pi pi-search text-[10px] text-surface-600 group-focus-within/search:text-primary-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Intelligence Search..."
            class="bg-transparent border-none text-[10px] text-white placeholder-surface-700 focus:outline-none ml-2 w-32 uppercase font-black tracking-widest"
          />
        </div>

        <!-- Notification & Settings -->
        <div class="flex items-center gap-1 border-x border-white/5 px-2">
          <button
            class="w-8 h-8 rounded-full hover:bg-white/5 transition-all relative group/btn"
            @click="notificationDrawerVisible = true"
          >
            <i
              class="pi pi-bell text-xs text-surface-400 group-hover/btn:text-white"
            />
            <span
              v-if="unreadCount > 0"
              class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary-500 rounded-full"
            />
          </button>

          <button
            class="w-8 h-8 rounded-full hover:bg-white/5 transition-all group/btn"
            @click="toggleConfigurator"
          >
            <i
              class="pi pi-cog text-xs text-surface-400 group-hover/btn:text-white"
            />
          </button>
        </div>

        <!-- Profile -->
        <div class="relative" ref="userMenuRef">
          <button
            class="flex items-center gap-3 hover:opacity-80 transition-all group/profile"
            @click="toggleUserMenu"
          >
            <div class="flex flex-col items-end hidden lg:flex">
              <span
                class="text-[9px] font-black text-white uppercase tracking-wider"
                >{{ fullName }}</span
              >
              <span
                class="text-[7px] font-bold text-primary-500 uppercase tracking-[0.2em] opacity-80 mt-0.5"
                >{{ user?.roleName }}</span
              >
            </div>
            <Avatar
              :label="userInitials"
              shape="circle"
              class="bg-linear-to-br from-primary-400 to-primary-600 text-black font-black text-[8px]! w-7! h-7! border-0"
            />
          </button>

          <!-- Dropdown -->
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
              class="absolute right-0 mt-3 w-52 bg-surface-950 border border-white/5 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-3xl overflow-hidden"
            >
              <div class="px-3 py-2.5 mb-1 border-b border-white/5">
                <div
                  class="text-[8px] font-black text-surface-500 uppercase tracking-widest mb-1"
                >
                  Active Identity
                </div>
                <div
                  class="text-[10px] font-black text-white uppercase truncate"
                >
                  {{ fullName }}
                </div>
              </div>

              <NuxtLink
                to="/dashboard/profile"
                class="flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-wider"
                @click="userMenuVisible = false"
              >
                <i class="pi pi-user text-xs" />
                Profile Details
              </NuxtLink>

              <NuxtLink
                to="/dashboard/settings"
                class="flex items-center gap-2.5 px-3 py-2 text-[10px] font-bold text-surface-400 hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-wider"
                @click="userMenuVisible = false"
              >
                <i class="pi pi-sliders-h text-xs" />
                Environment settings
              </NuxtLink>

              <div class="h-px bg-white/5 my-1" />

              <button
                class="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-black text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all uppercase tracking-wider"
                @click="handleLogout"
              >
                <i class="pi pi-power-off text-xs" />
                Terminate Session
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>
  </div>

  <!-- Notification Drawer -->
  <DashboardNotificationDrawer v-model:visible="notificationDrawerVisible" />
</template>
