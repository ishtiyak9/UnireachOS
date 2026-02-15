<script setup lang="ts">
const { user, clear } = useUserSession();
const { unreadCount } = useNotifications();
const route = useRoute();

const mobileMenuOpen = ref(false);
const notificationDrawerVisible = ref(false);

const menuItems = [
  { label: "Home", to: "/applicant-portal", icon: "pi pi-home" },
  { label: "Profile", to: "/applicant-portal/profile", icon: "pi pi-user" },
  {
    label: "Documents",
    to: "/applicant-portal/documents",
    icon: "pi pi-cloud-upload",
  },
  {
    label: "Applications",
    to: "/applicant-portal/applications",
    icon: "pi pi-briefcase",
  },
  {
    label: "Services",
    icon: "pi pi-th-large",
    children: [
      {
        label: "Accommodations",
        to: "/applicant-portal/services/accommodations",
        icon: "pi pi-home",
      },
      {
        label: "Travel Support",
        to: "/applicant-portal/services/travel",
        icon: "pi pi-globe",
      },
      {
        label: "Health Insurance",
        to: "/applicant-portal/services/health-insurance",
        icon: "pi pi-heart-fill",
      },
      {
        label: "Bank Loans",
        to: "/applicant-portal/services/bank-loans",
        icon: "pi pi-money-bill",
      },
    ],
  },
];

const isActive = (path?: string) => {
  if (!path) return false;
  if (path === "/applicant-portal") return route.path === path;
  return route.path.startsWith(path);
};

const toast = useToast();
const isLoggingOut = ref(false);
const handleLogout = async () => {
  isLoggingOut.value = true;
  toast.add({
    severity: "info",
    summary: "Initiating Exit",
    detail: "De-synchronizing from the academic registry...",
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
</script>

<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/[0.03] transition-all duration-700 h-16 md:h-20 flex items-center"
  >
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
      <div class="flex items-center justify-between">
        <!-- Left: Brand (Luxury spacing) -->
        <div class="flex items-center gap-4 shrink-0">
          <NuxtLink
            to="/applicant-portal"
            class="flex items-center gap-3 group transition-all duration-500"
          >
            <div
              class="relative flex items-center justify-center w-9 h-9 md:w-11 md:h-11"
            >
              <div
                class="absolute inset-0 bg-primary-500/10 rounded-full blur-xl group-hover:bg-primary-500/20 transition-all"
              />
              <img
                src="/icon.png"
                alt="Unireach Logo"
                class="relative z-10 w-full h-full object-contain filter group-hover:brightness-110 transition-all"
              />
            </div>
            <div class="flex flex-col">
              <span
                class="text-[12px] md:text-[15px] font-black text-white tracking-[0.2em] leading-none uppercase italic"
              >
                UNIREACH
              </span>
              <span
                class="text-[5px] md:text-[6px] font-bold text-primary-500 uppercase tracking-[0.5em] mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
              >
                INTELLIGENCE HUB
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Zen Navigation -->
        <div class="hidden md:flex items-center gap-2">
          <template v-for="item in menuItems" :key="item.label">
            <!-- Dropdown Menu -->
            <div v-if="item.children" class="relative group">
              <button
                class="px-6 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 text-surface-500 hover:text-white flex items-center gap-2"
                :class="{
                  'text-primary-500': isActive('/applicant-portal/services'),
                }"
              >
                <i :class="item.icon" class="text-[10px] opacity-60" />
                {{ item.label }}
                <i
                  class="pi pi-chevron-down text-[8px] opacity-40 group-hover:opacity-100 transition-opacity"
                />
              </button>

              <!-- Dropdown Panel -->
              <div
                class="absolute top-full right-0 w-64 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50"
              >
                <div
                  class="bg-black/95 backdrop-blur-2xl border border-white/10 rounded-xl p-2 shadow-2xl flex flex-col gap-1"
                >
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group/item"
                  >
                    <div
                      class="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center group-hover/item:bg-primary-500/20 transition-colors"
                    >
                      <i :class="[child.icon, 'text-primary-500 text-xs']" />
                    </div>
                    <div class="flex flex-col">
                      <span
                        class="text-[10px] font-bold text-white uppercase tracking-wider"
                        >{{ child.label }}</span
                      >
                      <span class="text-[9px] text-surface-500"
                        >View details</span
                      >
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Standard Link -->
            <NuxtLink
              v-else
              :to="item.to!"
              class="relative px-6 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 group"
              :class="[
                isActive(item.to!)
                  ? 'text-primary-500'
                  : 'text-surface-500 hover:text-white',
              ]"
            >
              <span class="relative z-10 flex items-center gap-2">
                <i
                  :class="[
                    item.icon,
                    'text-[10px] opacity-40 group-hover:opacity-100 transition-opacity',
                  ]"
                  v-if="isActive(item.to!)"
                />
                {{ item.label }}
              </span>
              <!-- Active Indicator (Slick Line) -->
              <div
                v-if="isActive(item.to!)"
                class="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary-500 shadow-[0_0_10px_rgba(212,175,55,0.5)] rounded-full animate-in fade-in zoom-in duration-500"
              />
            </NuxtLink>
          </template>
        </div>

        <!-- Right: Action Matrix -->
        <div class="flex items-center gap-4 md:gap-8">
          <!-- Real-time Notifications -->
          <button
            class="group relative w-10 h-10 rounded-full flex items-center justify-center text-surface-500 hover:text-white transition-all overflow-hidden"
            @click="notificationDrawerVisible = true"
          >
            <div
              class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <i class="pi pi-bell text-[13px] relative z-10" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-3 right-3 w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(212,175,55,1)] animate-pulse"
            />
          </button>

          <!-- Divider (Slick) -->
          <div class="h-6 w-[1px] bg-white/5 hidden md:block" />

          <!-- Logout Action -->
          <button
            class="group h-10 px-4 md:px-6 rounded-full border border-white/5 hover:border-rose-500/30 bg-white/5 hover:bg-rose-500/5 transition-all duration-500 flex items-center gap-3 disabled:opacity-50"
            :disabled="isLoggingOut"
            @click="handleLogout"
          >
            <span
              class="hidden md:block text-[9px] font-black text-surface-500 group-hover:text-rose-400 uppercase tracking-widest transition-colors"
              >{{ isLoggingOut ? "Exiting..." : "Terminate" }}</span
            >
            <i
              :class="
                isLoggingOut ? 'pi pi-spin pi-spinner' : 'pi pi-power-off'
              "
              class="text-[11px] text-rose-500 group-hover:scale-110 transition-transform"
            />
          </button>

          <!-- Mobile Toggle -->
          <button
            class="md:hidden w-10 h-10 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-white"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <i
              :class="[
                mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars',
                'text-[11px]',
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Zen Overlay -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-[-20px]"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-400 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-[-20px]"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-x-0 top-16 md:top-20 bg-black/95 backdrop-blur-3xl border-b border-white/5 p-8 flex flex-col gap-4 md:hidden z-40"
      >
        <template v-for="item in menuItems" :key="item.label">
          <!-- Item with Children -->
          <div v-if="item.children" class="flex flex-col gap-2">
            <div
              class="px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-surface-500"
            >
              {{ item.label }}
            </div>
            <NuxtLink
              v-for="child in item.children"
              :key="child.to"
              :to="child.to"
              class="flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent ml-4"
              :class="[
                isActive(child.to)
                  ? 'bg-primary-500/5 border-primary-500/20 text-primary-500'
                  : 'text-surface-500',
              ]"
              @click="mobileMenuOpen = false"
            >
              <span class="text-[10px] font-bold uppercase tracking-[0.2em]">{{
                child.label
              }}</span>
              <i :class="[child.icon, 'text-xs opacity-50']" />
            </NuxtLink>
          </div>

          <!-- Staandard Item -->
          <NuxtLink
            v-else
            :to="item.to!"
            class="flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent"
            :class="[
              isActive(item.to!)
                ? 'bg-primary-500/5 border-primary-500/20 text-primary-500'
                : 'text-surface-500',
            ]"
            @click="mobileMenuOpen = false"
          >
            <span class="text-[11px] font-black uppercase tracking-[0.3em]">{{
              item.label
            }}</span>
            <i :class="[item.icon, 'text-xs opacity-50']" />
          </NuxtLink>
        </template>
      </div>
    </Transition>

    <!-- Unified Notification Drawer -->
    <DashboardNotificationDrawer v-model:visible="notificationDrawerVisible" />
  </nav>
</template>

<style scoped>
/* Ultra-Luxury Polish */
.italic {
  font-style: italic;
}
</style>
