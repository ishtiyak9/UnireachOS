<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["update:visible"]);

const {
  notifications,
  unreadCount,
  loading,
  nextCursor,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} = useNotifications();

const innerVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const loadMoreTrigger = ref<HTMLElement | null>(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && nextCursor.value && !loading.value) {
        fetchNotifications();
      }
    },
    { threshold: 0.5 }
  );

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }

  onUnmounted(() => observer.disconnect());
});

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day"
  );
};

// Simplified relative time helper
const timeAgo = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getSeverityClass = (type: string) => {
  switch (type?.toUpperCase()) {
    case "SUCCESS":
      return "text-emerald-500 bg-emerald-500/10";
    case "WARNING":
      return "text-amber-500 bg-amber-500/10";
    case "ERROR":
      return "text-rose-500 bg-rose-500/10";
    default:
      return "text-primary-500 bg-primary-500/10";
  }
};

const getIcon = (type: string) => {
  switch (type?.toUpperCase()) {
    case "SUCCESS":
      return "pi pi-check-circle";
    case "WARNING":
      return "pi pi-exclamation-triangle";
    case "ERROR":
      return "pi pi-times-circle";
    default:
      return "pi pi-info-circle";
  }
};
</script>

<template>
  <Drawer
    v-model:visible="innerVisible"
    position="right"
    header="Notifications"
    class="!w-full !max-w-[380px] !bg-surface-950/80 !backdrop-blur-2xl !border-l !border-white/5 !p-0"
    :pt="{
      header: {
        class:
          '!p-3 !border-b !border-white/5 !bg-surface-950/50 !backdrop-blur-xl',
      },
      content: { class: '!p-0' },
    }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full pr-8">
        <div class="flex items-center gap-2">
          <h2
            class="text-[13px] font-black text-white uppercase tracking-widest italic"
          >
            Notifications
          </h2>
          <Badge
            v-if="unreadCount > 0"
            :value="unreadCount"
            severity="danger"
            class="!text-[8px] !min-w-[16px] !h-4"
          />
        </div>
        <Button
          v-if="unreadCount > 0"
          label="Clear all"
          text
          size="small"
          class="!text-[9px] !font-black !uppercase !tracking-tighter !text-primary-500/70 hover:!text-primary-500"
          @click="markAllAsRead"
        />
      </div>
    </template>

    <div class="flex flex-col min-h-full">
      <div
        v-if="notifications.length === 0 && !loading"
        class="flex-1 flex flex-col items-center justify-center p-12 text-center"
      >
        <div
          class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3"
        >
          <i class="pi pi-bell-slash text-xl text-surface-600" />
        </div>
        <h3 class="text-xs text-white font-bold mb-1 uppercase tracking-wider">
          Empty Feed
        </h3>
        <p class="text-[10px] text-surface-500 max-w-[180px]">
          No new activities to report at this time.
        </p>
      </div>

      <div v-else class="flex flex-col">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="group relative px-4 py-3 transition-all duration-300 hover:bg-white/[0.03] cursor-pointer border-b border-white/[0.03]"
          :class="[!n.isRead ? 'bg-primary-500/[0.01]' : 'opacity-60']"
          @click="
            !n.isRead && markAsRead(n.id);
            if (n.metadata?.link) {
              navigateTo(n.metadata.link);
              innerVisible = false;
            }
          "
        >
          <!-- Unread Dot -->
          <div
            v-if="!n.isRead"
            class="absolute top-4 left-1.5 w-1 h-1 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(212,175,55,1)]"
          />

          <div class="flex gap-3 items-start">
            <div
              class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="getSeverityClass(n.type)"
            >
              <i :class="[getIcon(n.type), 'text-[11px]']" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <h4
                  class="text-[10px] font-black text-white hover:text-primary-400 transition-colors uppercase tracking-tight truncate pr-2"
                >
                  {{ n.title }}
                </h4>
                <span
                  class="text-[8px] font-bold text-surface-600 uppercase tracking-tighter whitespace-nowrap"
                >
                  {{ timeAgo(n.createdAt) }}
                </span>
              </div>
              <p class="text-[10px] text-surface-400 leading-snug line-clamp-2">
                {{ n.message }}
              </p>

              <div v-if="n.metadata?.link" class="mt-2">
                <button
                  class="text-[9px] font-black text-primary-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 group/link"
                  @click.stop="
                    navigateTo(n.metadata.link);
                    innerVisible = false;
                  "
                >
                  {{ n.metadata.action || "Execute" }}
                  <i
                    class="pi pi-arrow-right text-[7px] group-hover/link:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Infinite Scroll Trigger -->
        <div ref="loadMoreTrigger" class="p-6 flex justify-center">
          <i
            v-if="loading"
            class="pi pi-spin pi-spinner text-primary-500/50 text-xs"
          />
          <span
            v-else-if="!nextCursor && notifications.length > 0"
            class="text-[8px] font-black text-surface-700 uppercase tracking-[0.4em]"
          >
            End of stream
          </span>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
:deep(.p-drawer-content) {
  scrollbar-width: none; /* Hide scrollbar for slicker look */
}
:deep(.p-drawer-content)::-webkit-scrollbar {
  display: none;
}

:deep(.p-drawer-header) {
  padding: 0.75rem 1rem !important;
}

.notifications-enter-active,
.notifications-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notifications-enter-from,
.notifications-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
