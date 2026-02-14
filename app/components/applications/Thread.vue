<script setup lang="ts">
const props = defineProps<{
  applicationId: string;
}>();

const { user } = useUserSession();
const roleCategory = computed(() => (user.value as any)?.roleCategory);

const { data: notesData, refresh } = await useFetch<any>(
  `/api/applications/${props.applicationId}/notes`
);
const notes = computed(() => notesData.value?.notes || []);

const newNote = ref("");
const visibility = ref("PUBLIC");
const loading = ref(false);

// Initialize default visibility based on role
onMounted(() => {
  if (roleCategory.value === "STAFF" || roleCategory.value === "SYSTEM") {
    visibility.value = "INTERNAL";
  } else if (roleCategory.value === "AGENT") {
    visibility.value = "PARTNER";
  } else {
    visibility.value = "PUBLIC";
  }
});

interface VisibilityOption {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const visibilityOptions = computed<VisibilityOption[]>(() => {
  const options: VisibilityOption[] = [
    {
      label: "Public (Global)",
      value: "PUBLIC",
      icon: "pi pi-globe",
      color: "text-emerald-400",
    },
  ];

  if (
    roleCategory.value === "AGENT" ||
    roleCategory.value === "STAFF" ||
    roleCategory.value === "SYSTEM"
  ) {
    options.push({
      label: "Partner Only",
      value: "PARTNER",
      icon: "pi pi-briefcase",
      color: "text-amber-400",
    });
  }

  if (roleCategory.value === "STAFF" || roleCategory.value === "SYSTEM") {
    options.push({
      label: "Internal Staff",
      value: "INTERNAL",
      icon: "pi pi-shield",
      color: "text-blue-400",
    });
  }

  return options;
});

const sendNote = async () => {
  if (!newNote.value.trim()) return;

  loading.value = true;
  try {
    await $fetch(`/api/applications/${props.applicationId}/notes`, {
      method: "POST",
      body: {
        content: newNote.value,
        visibility: visibility.value,
      },
    });
    newNote.value = "";
    await refresh();
  } catch (e) {
    console.error("Failed to dispatch note", e);
  } finally {
    loading.value = false;
  }
};

const getVisibilityBadge = (v: string): VisibilityOption => {
  const fallback: VisibilityOption = {
    label: "Unknown",
    value: "UNKNOWN",
    icon: "pi pi-circle",
    color: "text-surface-500",
  };
  return (
    visibilityOptions.value.find((o) => o.value === v) ||
    visibilityOptions.value[0] ||
    fallback
  );
};

const isMe = (note: any) => {
  return note.createdBy === user.value?.id;
};
</script>

<template>
  <div
    class="flex flex-col h-full bg-surface-900 border border-white/5 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-3xl"
  >
    <!-- Header -->
    <div
      class="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/2"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center border border-primary-500/20"
        >
          <i
            class="pi pi-comments text-primary-500 text-xs shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          ></i>
        </div>
        <div class="flex flex-col">
          <h3
            class="text-[11px] font-black uppercase tracking-[0.2em] text-white"
          >
            Mission Log
          </h3>
          <span
            class="text-[8px] font-bold text-surface-500 uppercase tracking-widest mt-0.5"
            >Tactical Communication Portal</span
          >
        </div>
      </div>
      <div
        class="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-950/50 border border-white/5"
      >
        <div
          class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"
        ></div>
        <span
          class="text-[9px] text-surface-400 font-black tracking-widest uppercase"
          >Secured</span
        >
      </div>
    </div>

    <!-- Message Area -->
    <div
      class="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar min-h-[400px] bg-linear-to-b from-transparent to-black/20"
    >
      <div
        v-for="note in notes"
        :key="note.id"
        class="flex flex-col gap-2 max-w-[90%]"
        :class="[isMe(note) ? 'ml-auto items-end' : 'mr-auto items-start']"
      >
        <div
          class="flex items-center gap-2"
          :class="[isMe(note) ? 'flex-row-reverse' : 'flex-row']"
        >
          <div
            class="flex items-center gap-2 px-2 py-0.75 rounded-lg bg-white/5 border border-white/5"
          >
            <i
              :class="[
                getVisibilityBadge(note.visibility).icon,
                getVisibilityBadge(note.visibility).color,
              ]"
              class="text-[8px]"
            ></i>
            <span
              class="text-[8px] font-black text-surface-400 uppercase tracking-widest"
              >{{ note.visibility }}</span
            >
          </div>
          <span class="text-[9px] font-bold text-surface-600 tabular-nums">{{
            new Date(note.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}</span>
        </div>

        <div
          class="p-4 rounded-2xl text-xs leading-relaxed"
          :class="[
            isMe(note)
              ? 'bg-primary-500 text-black font-bold rounded-tr-none shadow-[0_4px_15px_rgba(212,175,55,0.2)]'
              : 'bg-white/5 text-surface-200 border border-white/10 rounded-tl-none',
          ]"
        >
          {{ note.content }}
        </div>
      </div>

      <div
        v-if="notes.length === 0"
        class="h-full flex flex-col items-center justify-center opacity-30 gap-3 grayscale"
      >
        <i class="pi pi-inbox text-4xl"></i>
        <span class="text-[10px] font-black uppercase tracking-[0.3em]"
          >No log entries found</span
        >
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-6 bg-surface-950 border-t border-white/5 space-y-5">
      <!-- Visibility Selector (Staff/Agent only) -->
      <div
        v-if="visibilityOptions.length > 1"
        class="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5"
      >
        <button
          v-for="opt in visibilityOptions"
          :key="opt.value"
          @click="visibility = opt.value"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-500 text-[9px] font-black uppercase tracking-widest"
          :class="[
            visibility === opt.value
              ? 'bg-surface-800 text-white shadow-xl'
              : 'text-surface-500 hover:text-surface-300',
          ]"
        >
          <i
            :class="[opt.icon, visibility === opt.value ? opt.color : '']"
            class="text-[10px]"
          ></i>
          <span class="hidden sm:inline">{{ opt.label.split(" ")[0] }}</span>
        </button>
      </div>

      <div class="relative group">
        <Textarea
          v-model="newNote"
          placeholder="Transmit priority message..."
          class="w-full bg-white/5! border-white/5! text-[11px]! pr-14 focus:border-primary-500/50! focus:bg-white/10! transition-all rounded-2xl placeholder-surface-600! font-medium! leading-relaxed!"
          rows="2"
          @keydown.enter.prevent="sendNote"
        />
        <Button
          icon="pi pi-send"
          class="absolute! right-2 bottom-2 w-10! h-10! bg-primary-500! border-none! rounded-xl! transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-primary-500/50"
          @click="sendNote"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--p-surface-700);
  border-radius: 9999px;
}
</style>
