<script setup lang="ts">
interface Props {
  visible: boolean;
  isMobile: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["toggle"]);

const route = useRoute();

// Navigation menu structure
const menuItems = [
  {
    label: "Main",
    items: [
      {
        label: "Overview",
        icon: "pi pi-th-large",
        to: "/dashboard",
      },
    ],
  },
  {
    label: "Security",
    items: [
      {
        label: "Unified Authority",
        icon: "pi pi-shield",
        children: [
          {
            label: "Role Directory",
            to: "/dashboard/authority/roles",
            icon: "pi pi-users",
          },
          {
            label: "Role Assignments",
            to: "/dashboard/authority/assignments",
            icon: "pi pi-user-plus",
          },
          {
            label: "Permission Groups",
            to: "/dashboard/authority/groups",
            icon: "pi pi-clone",
          },
        ],
      },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        label: "Employees",
        icon: "pi pi-shield",
        to: "/dashboard/user/employees",
      },
      {
        label: "Partners",
        icon: "pi pi-briefcase",
        to: "/dashboard/user/partners",
      },
      {
        label: "Applicants",
        icon: "pi pi-id-card",
        to: "/dashboard/user/applicants",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        icon: "pi pi-cog",
        to: "/dashboard/settings",
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
  // Check if current route is a child of the path
  if (path !== "/dashboard" && route.path.startsWith(path)) return true;
  return false;
};

const isSectionActive = (item: any) => {
  if (item.to && isActive(item.to)) return true;
  if (item.children) {
    return item.children.some((child: any) => isActive(child.to));
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

const fullName = computed(() => {
  if (!user.value?.profile?.firstName || !user.value?.profile?.lastName) {
    return user.value?.email?.split("@")[0] || "User";
  }
  return `${user.value.profile.firstName} ${user.value.profile.lastName}`;
});
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-full w-64 bg-surface-950 border-r border-white/5 transition-transform duration-300 z-50 flex flex-col"
    :class="[
      visible ? 'translate-x-0' : '-translate-x-full',
      isMobile ? 'lg:-translate-x-full' : 'lg:translate-x-0',
    ]"
  >
    <!-- Dynamic Logo Hub -->
    <div
      class="h-12 flex items-center px-6 border-b border-white/5 relative group/logo transition-colors hover:bg-white/[0.02]"
    >
      <div
        class="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary-500/10 to-transparent"
      />

      <NuxtLink to="/dashboard" class="flex items-center gap-3 group">
        <div
          class="w-8 h-8 rounded-xl bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:rotate-[360deg] transition-all duration-700"
        >
          <i class="pi pi-shield text-xs text-black font-black" />
        </div>
        <div class="flex flex-col">
          <span
            class="text-[11px] font-black text-white tracking-[0.15em] uppercase leading-none"
          >
            Uni<span class="text-primary-500">Reach</span>
          </span>
          <span
            class="text-[7px] font-bold text-surface-600 uppercase tracking-[0.3em] mt-1"
            >Intelligence</span
          >
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-8 px-4 space-y-8 scrollbar-hide">
      <div v-for="section in menuItems" :key="section.label" class="space-y-4">
        <h3
          class="px-4 text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]"
        >
          {{ section.label }}
        </h3>

        <div class="space-y-1">
          <div v-for="item in section.items" :key="item.label">
            <!-- Normal Link Item -->
            <NuxtLink
              v-if="!item.children"
              :to="item.to"
              class="group flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 relative overflow-hidden"
              :class="[
                isActive(item.to)
                  ? 'bg-linear-to-r from-primary-500/10 to-transparent text-primary-400'
                  : 'text-surface-400 hover:text-white hover:bg-white/5',
              ]"
              @click="isMobile && emit('toggle')"
            >
              <div
                v-if="isActive(item.to)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-500 rounded-r-full"
              />
              <i
                :class="[
                  item.icon,
                  'text-sm transition-transform group-hover:scale-110',
                ]"
              />
              <span class="uppercase tracking-widest">{{ item.label }}</span>
            </NuxtLink>

            <!-- Parent Item with Dropdown -->
            <div v-else class="space-y-1">
              <button
                @click="toggleExpand(item.label)"
                class="w-full group flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 relative overflow-hidden"
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
                      'text-sm transition-transform group-hover:scale-110',
                    ]"
                  />
                  <span class="uppercase tracking-widest">{{
                    item.label
                  }}</span>
                </div>
                <i
                  class="pi pi-chevron-down text-[10px] transition-transform duration-300"
                  :class="{ 'rotate-180': isExpanded(item.label) }"
                />
              </button>

              <!-- Dropdown Children -->
              <div
                v-show="isExpanded(item.label)"
                class="ml-4 pl-4 border-l border-white/5 space-y-1 mt-1 overflow-hidden transition-all"
              >
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all duration-300"
                  :class="[
                    isActive(child.to)
                      ? 'text-primary-400'
                      : 'text-surface-500 hover:text-white hover:bg-white/5',
                  ]"
                  @click="isMobile && emit('toggle')"
                >
                  <i :class="[child.icon, 'text-[10px]']" />
                  <span class="uppercase tracking-widest">{{
                    child.label
                  }}</span>
                </NuxtLink>
              </div>
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
