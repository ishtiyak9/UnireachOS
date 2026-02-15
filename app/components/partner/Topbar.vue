<script setup lang="ts">
import { useThemeConfig } from "~/composables/useThemeConfig";
const props = defineProps<{
  isMobile?: boolean;
}>();

const emit = defineEmits(["toggleSidebar"]);

const route = useRoute();
const { user, clear } = useUserSession();
const { state } = useThemeConfig();
const { unreadCount } = useNotifications();
const notificationDrawerVisible = ref(false);

// Corporate Breadcrumbs
const breadcrumbs = computed(() => {
  const paths = route.path.split("/").filter(Boolean);
  const nodes = paths.filter((p) => p !== "partner-portal");

  if (nodes.length === 0) {
    return [
      { label: "STRATEGIC OVERVIEW", to: "/partner-portal", active: true },
    ];
  }

  return nodes.map((node, index) => ({
    label: node.replace(/-/g, " ").toUpperCase(),
    to: "/partner-portal/" + nodes.slice(0, index + 1).join("/"),
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

onMounted(() => {
  window.addEventListener("click", closeUserMenu);
});

onUnmounted(() => {
  window.removeEventListener("click", closeUserMenu);
});

const toast = useToast();
const isLoggingOut = ref(false);
const handleLogout = async () => {
  isLoggingOut.value = true;
  toast.add({
    severity: "info",
    summary: "Securing Portal",
    detail: "Disconnecting from the partner tactical network...",
    life: 2000,
  });

  try {
    await $fetch("/api/auth/logout", { method: "POST" });
    await clear();
    location.href = "/login";
  } catch (e) {
    isLoggingOut.value = false;
  }
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
    return user.value?.email?.split("@")[0] || "Representative";
  }
  return `${user.value.profile.firstName} ${user.value.profile.lastName}`;
});
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-40 flex flex-col transition-[left] duration-300 ease-in-out"
  >
    <header
      class="h-14 bg-[#0a0f0d]/80 backdrop-blur-xl border-b border-emerald-900/20 px-4 lg:px-6 flex items-center justify-between relative"
    >
      <!-- Emerald Highlight -->
      <div
        class="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent"
      />

      <!-- Left: Navigation/Mobile Toggle -->
      <div class="flex items-center gap-4">
        <button
          class="lg:hidden w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/20 transition-all active:scale-95"
          @click="emit('toggleSidebar')"
        >
          <i class="pi pi-bars text-xs" />
        </button>

        <!-- Dynamic Breadcrumb Node -->
        <nav class="hidden md:flex items-center gap-2">
          <div
            v-for="(crumb, idx) in breadcrumbs"
            :key="crumb.to"
            class="flex items-center gap-2"
          >
            <span v-if="idx > 0" class="text-surface-700 text-[8px]">/</span>
            <NuxtLink
              :to="crumb.to"
              class="text-[9px] font-black tracking-[0.2em] transition-colors"
              :class="[
                crumb.active
                  ? 'text-emerald-500'
                  : 'text-surface-600 hover:text-white',
              ]"
            >
              {{ crumb.label }}
            </NuxtLink>
          </div>
        </nav>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-3">
        <div
          class="flex items-center gap-1 border-r border-emerald-900/20 pr-3 mr-1"
        >
          <button
            class="w-8 h-8 rounded-full hover:bg-emerald-500/10 transition-all relative group/btn"
            @click="notificationDrawerVisible = true"
          >
            <i
              class="pi pi-bell text-xs text-surface-500 group-hover/btn:text-emerald-400"
            />
            <span
              v-if="unreadCount > 0"
              class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"
            />
          </button>
        </div>

        <!-- Identity Matrix -->
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
                class="text-[7px] font-bold text-emerald-500 uppercase tracking-[0.2em] opacity-80 mt-0.5"
                >Corporate Partner</span
              >
            </div>
            <Avatar
              :label="userInitials"
              shape="circle"
              class="bg-linear-to-br from-emerald-400 to-emerald-600 text-black font-black text-[8px]! w-8! h-8! border-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            />
          </button>

          <!-- Executive Menu -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="scale-95 opacity-0 -translate-y-2"
            enter-to-class="scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
          >
            <div
              v-if="userMenuVisible"
              class="absolute right-0 mt-3 w-56 bg-[#0a0f0d] border border-emerald-900/30 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-3xl overflow-hidden"
            >
              <div
                class="px-3 py-3 mb-1 border-b border-emerald-900/20 bg-emerald-500/5"
              >
                <div
                  class="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1"
                >
                  Authenticated Entity
                </div>
                <div
                  class="text-[10px] font-black text-white uppercase truncate"
                >
                  {{ fullName }}
                </div>
              </div>

              <NuxtLink
                to="/partner-portal/profile"
                class="flex items-center gap-2.5 px-3 py-2.5 text-[10px] font-bold text-surface-400 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all"
                @click="userMenuVisible = false"
              >
                <i class="pi pi-user text-xs" />
                <span>Account Profile</span>
              </NuxtLink>

              <div class="h-px bg-emerald-900/20 my-1" />

              <button
                class="w-full flex items-center gap-2.5 px-3 py-2.5 text-[10px] font-black text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all uppercase tracking-wider disabled:opacity-50"
                :disabled="isLoggingOut"
                @click="handleLogout"
              >
                <i
                  :class="
                    isLoggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-power-off'
                  "
                  class="text-xs"
                />
                {{ isLoggingOut ? "Securing..." : "Sign Out / Exit" }}
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>
  </div>

  <DashboardNotificationDrawer v-model:visible="notificationDrawerVisible" />
</template>
