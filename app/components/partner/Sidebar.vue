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
const { user } = useUserSession();

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

// Navigation menu structure: Corporate Strategic (Partner/Agent Mode)
const menuItems: NavigationSection[] = [
  {
    label: "Business Hub",
    items: [
      {
        label: "Executive Briefing",
        icon: "pi pi-chart-bar",
        to: "/partner-portal",
      },
      {
        label: "Applicants",
        icon: "pi pi-users",
        to: "/partner-portal/applicants",
      },
      {
        label: "Courses Finder",
        icon: "pi pi-compass",
        to: "/partner-portal/courses-finder",
      },
    ],
  },
  {
    label: "Allied Services",
    items: [
      {
        label: "Accommodations",
        icon: "pi pi-home",
        to: "/partner-portal/services/accommodations",
      },
      {
        label: "Travel Support",
        icon: "pi pi-globe",
        to: "/partner-portal/services/travel",
      },
      {
        label: "Health Insurance",
        icon: "pi pi-heart-fill",
        to: "/partner-portal/services/health-insurance",
      },
      {
        label: "Bank Loans",
        icon: "pi pi-money-bill",
        to: "/partner-portal/services/bank-loans",
      },
    ],
  },
  {
    label: "Strategic Assets",
    items: [
      {
        label: "Application",
        icon: "pi pi-file-edit",
        to: "/partner-portal/application",
      },
      {
        label: "Enquiry",
        icon: "pi pi-question-circle",
        to: "/partner-portal/enquiry",
      },
      {
        label: "Marketing Toolkit",
        icon: "pi pi-megaphone",
        to: "/partner-portal/assets",
      },
    ],
  },
  {
    label: "Performance",
    items: [
      {
        label: "Financial Summary",
        icon: "pi pi-wallet",
        to: "/partner-portal/rewards",
      },
      {
        label: "Support Desk",
        icon: "pi pi-headset",
        to: "/partner-portal/support",
      },
    ],
  },
];

const expandedItems = ref<string[]>([]);

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
  if (index > -1) expandedItems.value.splice(index, 1);
  else expandedItems.value.push(label);
};

const isExpanded = (label: string) => expandedItems.value.includes(label);

const isActive = (path?: string) => {
  if (!path) return false;
  // Special case for dashboard root to prevent it being active on sub-routes
  if (path === "/partner-portal") {
    return route.path === "/partner-portal";
  }
  // Standard strict matching for other routes
  return route.path.startsWith(path);
};

const isSectionActive = (item: NavigationItem) => {
  if (item.to && isActive(item.to)) return true;
  if (item.children) return item.children.some((child) => isActive(child.to));
  return false;
};
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-full w-[280px] lg:w-64 bg-[#0a0f0d] border-r border-emerald-900/20 transition-all duration-500 ease-in-out z-50 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
    :class="[props.visible ? 'translate-x-0' : '-translate-x-full']"
  >
    <!-- Corporate Identity Hub -->
    <div
      class="h-16 flex items-center justify-between px-6 border-b border-emerald-900/20 relative group/logo"
    >
      <div
        class="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent"
      />
      <NuxtLink to="/partner-portal" class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-500"
        >
          <img
            src="/icon.png"
            alt="UniReach"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="flex flex-col">
          <span
            class="text-[12px] font-black text-white tracking-[0.2em] uppercase leading-none"
          >
            Uni<span class="text-emerald-500">Reach</span>
          </span>
          <span
            class="text-[7px] font-bold text-emerald-600/60 uppercase tracking-[0.4em] mt-1 italic"
            >Partner Network</span
          >
        </div>
      </NuxtLink>

      <!-- Mobile Close Trigger -->
      <button
        v-if="props.isMobile"
        @click="emit('toggle')"
        class="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-surface-500 hover:text-emerald-500 transition-colors"
      >
        <i class="pi pi-times text-xs" />
      </button>
    </div>

    <!-- Navigation Architecture -->
    <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
      <div v-for="section in menuItems" :key="section.label" class="space-y-3">
        <h3
          class="px-3 text-[9px] font-black text-emerald-800 uppercase tracking-[0.4em] flex items-center gap-2"
        >
          <span class="w-1 h-1 rounded-full bg-emerald-900"></span>
          {{ section.label }}
        </h3>
        <div class="space-y-1">
          <div v-for="item in section.items" :key="item.label">
            <NuxtLink
              v-if="!item.children"
              :to="item.to"
              class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 relative overflow-hidden"
              :class="[
                isActive(item.to)
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-surface-500 hover:text-white hover:bg-white/5',
              ]"
              @click="props.isMobile && emit('toggle')"
            >
              <div
                v-if="isActive(item.to)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              />
              <i
                :class="[
                  item.icon,
                  'text-[13px] transition-all group-hover:scale-110',
                  isActive(item.to) ? 'text-emerald-400' : 'text-surface-600',
                ]"
              />
              <span class="uppercase tracking-[0.15em]">{{ item.label }}</span>
            </NuxtLink>
            <!-- Composite Nodes (if any added later) -->
            <div v-else class="space-y-1">
              <!-- Similar logic to Sidebar.vue but with emerald accents -->
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
