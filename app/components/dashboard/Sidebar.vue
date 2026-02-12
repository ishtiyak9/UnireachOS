<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

interface Props {
  visible: boolean;
  isMobile: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["toggle"]);

const route = useRoute();

interface NavigationItem {
  label: string;
  icon: string;
  to?: string;
  children?: { label: string; to: string; icon: string }[];
}

interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

// Navigation menu structure: Intelligence Clusters
const menuItems: NavigationSection[] = [
  {
    label: "Tactical Hub",
    items: [
      {
        label: "Operational Overview",
        icon: "pi pi-bolt",
        to: "/dashboard",
      },
      {
        label: "Lead Intelligence",
        icon: "pi pi-database",
        to: "/dashboard/leads",
      },
      {
        label: "Cell Organization",
        icon: "pi pi-sitemap",
        to: "/dashboard/teams",
      },
    ],
  },
  {
    label: "Stewardship Registry",
    items: [
      {
        label: "Personnel",
        icon: "pi pi-users",
        children: [
          {
            label: "Employee Ops",
            to: "/dashboard/user/employees",
            icon: "pi pi-user",
          },
          {
            label: "Partner Network",
            to: "/dashboard/user/partners",
            icon: "pi pi-briefcase",
          },
        ],
      },
      {
        label: "Applicant Portfolio",
        icon: "pi pi-id-card",
        to: "/dashboard/user/applicants",
      },
    ],
  },
  {
    label: "Control Matrix",
    items: [
      {
        label: "Unified Authority",
        icon: "pi pi-shield",
        children: [
          {
            label: "Role Directory",
            to: "/dashboard/authority/roles",
            icon: "pi pi-list",
          },
          {
            label: "Authority Mapping",
            to: "/dashboard/authority/assignments",
            icon: "pi pi-user-plus",
          },
          {
            label: "Permission Clusters",
            to: "/dashboard/authority/groups",
            icon: "pi pi-clone",
          },
        ],
      },
      {
        label: "System Settings",
        icon: "pi pi-cog",
        children: [
          {
            label: "Core Config",
            to: "/dashboard/settings",
            icon: "pi pi-sliders-h",
          },
          {
            label: "Geospatial Data",
            to: "/dashboard/settings/countries",
            icon: "pi pi-map",
          },
        ],
      },
    ],
  },
];

// Track expanded items
const expandedItems = ref<string[]>([]);

// Initialize expanded items based on current route
onMounted(() => {
  menuItems.forEach((section) => {
    section.items.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) =>
          route.path.startsWith(child.to)
        );
        if (hasActiveChild) {
          expandedItems.value.push(item.label);
        }
      }
    });
  });
});

const toggleExpand = (label: string) => {
  const index = expandedItems.value.indexOf(label);
  if (index > -1) {
    expandedItems.value.splice(index, 1);
  } else {
    expandedItems.value.push(label);
  }
};

const isExpanded = (label: string) => expandedItems.value.includes(label);

const isActive = (path?: string) => {
  if (!path) return false;
  if (route.path === path) return true;
  if (path !== "/dashboard" && route.path.startsWith(path)) return true;
  return false;
};

const isSectionActive = (item: NavigationItem) => {
  if (item.to && isActive(item.to)) return true;
  if (item.children) {
    return item.children.some((child) => isActive(child.to));
  }
  return false;
};

const { user } = useUserSession();

const userInitials = computed(() => {
  if (!user.value?.profile?.firstName || !user.value?.profile?.lastName) {
    return user.value?.email?.charAt(0).toUpperCase() || "U";
  }
  return (
    user.value.profile.firstName.charAt(0) +
    user.value.profile.lastName.charAt(0)
  ).toUpperCase();
});
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-full w-64 bg-surface-950 border-r border-white/5 transition-all duration-500 ease-in-out z-50 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
    :class="[props.visible ? 'translate-x-0' : '-translate-x-full']"
  >
    <!-- Neural Brand Hub -->
    <div
      class="h-16 flex items-center px-6 border-b border-white/5 relative group/logo"
    >
      <div
        class="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary-500/20 to-transparent"
      />

      <NuxtLink to="/dashboard" class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-500"
        >
          <i class="pi pi-shield text-black font-black" />
        </div>
        <div class="flex flex-col">
          <span
            class="text-[12px] font-black text-white tracking-[0.2em] uppercase leading-none"
          >
            Uni<span class="text-primary-500">Reach</span>
          </span>
          <span
            class="text-[8px] font-bold text-surface-600 uppercase tracking-[0.4em] mt-1 italic"
            >Intelligence OS</span
          >
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation Architecture -->
    <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
      <div v-for="section in menuItems" :key="section.label" class="space-y-3">
        <h3
          class="px-3 text-[9px] font-black text-surface-600 uppercase tracking-[0.4em] flex items-center gap-2"
        >
          <span class="w-1 h-1 rounded-full bg-surface-800"></span>
          {{ section.label }}
        </h3>

        <div class="space-y-1">
          <div v-for="item in section.items" :key="item.label">
            <!-- Terminal Node -->
            <NuxtLink
              v-if="!item.children"
              :to="item.to"
              class="group flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-black transition-all duration-300 relative overflow-hidden"
              :class="[
                isActive(item.to)
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-surface-400 hover:text-white hover:bg-white/5',
              ]"
              @click="props.isMobile && emit('toggle')"
            >
              <div
                v-if="isActive(item.to)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary-500 rounded-r-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              />
              <i
                :class="[
                  item.icon,
                  'text-[13px] transition-all group-hover:scale-110',
                  isActive(item.to) ? 'text-primary-400' : 'text-surface-500',
                ]"
              />
              <span class="uppercase tracking-[0.15em]">{{ item.label }}</span>
            </NuxtLink>

            <!-- Composite Cluster -->
            <div v-else class="space-y-1">
              <button
                @click="toggleExpand(item.label)"
                class="w-full group flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-black transition-all duration-300"
                :class="[
                  isSectionActive(item)
                    ? 'text-primary-400'
                    : 'text-surface-400 hover:text-white hover:bg-white/5',
                ]"
              >
                <div class="flex items-center gap-3">
                  <i
                    :class="[
                      item.icon,
                      'text-[13px] transition-all group-hover:scale-110',
                      isSectionActive(item)
                        ? 'text-primary-400'
                        : 'text-surface-500',
                    ]"
                  />
                  <span class="uppercase tracking-[0.15em]">{{
                    item.label
                  }}</span>
                </div>
                <i
                  class="pi pi-chevron-right text-[8px] transition-transform duration-500"
                  :class="{
                    'rotate-90 text-primary-500': isExpanded(item.label),
                  }"
                />
              </button>

              <!-- Node Branches -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 -translate-y-2 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 -translate-y-2 scale-95"
              >
                <div
                  v-if="isExpanded(item.label)"
                  class="ml-4 pl-4 border-l border-white/5 space-y-1 mt-1"
                >
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    class="flex items-center gap-3 px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-300"
                    :class="[
                      isActive(child.to)
                        ? 'text-primary-400 bg-primary-500/5'
                        : 'text-surface-500 hover:text-white hover:bg-white/5',
                    ]"
                    @click="props.isMobile && emit('toggle')"
                  >
                    <i :class="[child.icon, 'text-[10px]']" />
                    <span class="uppercase tracking-[0.2em]">{{
                      child.label
                    }}</span>
                  </NuxtLink>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
