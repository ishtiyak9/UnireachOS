<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const toast = useToast();
const confirm = useConfirm();
const { user: currentUser } = useUserSession();

// Data Fetching
// Data Fetching
const {
  data: teamsRes,
  refresh,
  pending: teamsLoading,
} = useFetch("/api/admin/teams", { lazy: true });
const teams = computed(() => (teamsRes.value as any)?.data || []);

const { data: staffRes, pending: staffLoading } = useFetch("/api/admin/users", {
  query: { categories: ["STAFF", "SYSTEM"] },
  lazy: true,
});
const allStaff = computed(() => (staffRes.value as any) || []);

const { data: countriesRes, pending: countriesLoading } = useFetch(
  "/api/admin/countries",
  { lazy: true }
);
const countries = computed(() => (countriesRes.value as any)?.data || []);

// Modal States
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);

const showAssignModal = ref(false);
const selectedTeam = ref<any>(null);
const selectedMembers = ref<string[]>([]);

const form = reactive({
  id: "",
  name: "",
  vertical: "EDUCATION",
  targetLocale: [] as string[],
  description: "",
});

const verticalGradients: any = {
  EDUCATION: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400",
  MIGRATION:
    "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400",
  SALES:
    "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  FINANCE:
    "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400",
  NETWORKING: "from-pink-500/20 to-pink-600/5 border-pink-500/20 text-pink-400",
  ADMINISTRATION:
    "from-surface-500/20 to-surface-600/5 border-white/10 text-surface-400",
  LEGAL: "from-red-500/20 to-red-600/5 border-red-500/20 text-red-400",
};

// Handlers
const openCreateModal = () => {
  isEditing.value = false;
  form.id = "";
  form.name = "";
  form.vertical = "EDUCATION";
  form.targetLocale = [];
  form.description = "";
  showModal.value = true;
};

const editTeam = (team: any) => {
  isEditing.value = true;
  form.id = team.id;
  form.name = team.name;
  form.vertical = team.vertical;
  form.targetLocale = team.targetLocale
    ? team.targetLocale.split(", ").filter(Boolean)
    : [];
  form.description = team.description || "";
  showModal.value = true;
};

const handleSave = async () => {
  isSubmitting.value = true;
  try {
    const endpoint = isEditing.value
      ? "/api/admin/teams/update"
      : "/api/admin/teams/create";
    const method = isEditing.value ? "PATCH" : "POST";

    await $fetch(endpoint, {
      method,
      body: {
        ...form,
        targetLocale: form.targetLocale,
      },
    });

    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Cell ${
        isEditing.value ? "reconfigured" : "provisioned"
      } successfully`,
      life: 3000,
    });
    showModal.value = false;
    refresh();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.data?.message || "Operation failed",
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteTeam = (team: any) => {
  confirm.require({
    message: `Confirm dismantling of cell: ${team.name}? This action is irreversible.`,
    header: "Dismantle Cell",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await $fetch("/api/admin/teams/delete", {
          method: "DELETE",
          query: { id: team.id },
        });
        toast.add({
          severity: "success",
          summary: "Dismantled",
          detail: "Cell successfully removed",
          life: 3000,
        });
        refresh();
      } catch (error: any) {
        toast.add({
          severity: "error",
          summary: "Neural Safety Lock",
          detail: error.data?.message || "Deletion failed",
          life: 5000,
        });
      }
    },
  });
};

const openAssignModal = (team: any) => {
  selectedTeam.value = team;
  selectedMembers.value = team.members.map((m: any) => m.userId);
  showAssignModal.value = true;
};

const handleAssignStaff = async () => {
  isSubmitting.value = true;
  try {
    await $fetch("/api/admin/teams/assign-members", {
      method: "POST",
      body: {
        teamId: selectedTeam.value.id,
        memberIds: selectedMembers.value,
      },
    });
    toast.add({
      severity: "success",
      summary: "Deployed",
      detail: "Personnel re-mapped successfully",
      life: 3000,
    });
    showAssignModal.value = false;
    refresh();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Personnel deployment failed",
      life: 5000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deployableStaff = computed(() => {
  const isSuperAdmin = (currentUser.value as any)?.roleCode === "super_admin";
  return allStaff.value.filter((s: any) => {
    // 1. Never show super_admin in deployment list
    if (s.roleCode === "super_admin") return false;

    // 2. Hide super_user if viewer is not super_admin
    if (s.roleCode === "super_user" && !isSuperAdmin) return false;

    // 3. Only show STAFF or SYSTEM category
    return s.roleCategory === "STAFF" || s.roleCategory === "SYSTEM";
  });
});
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-white uppercase tracking-tighter">
          Cell Organization
        </h1>
        <p
          class="text-[10px] font-bold text-surface-500 uppercase tracking-[0.4em] mt-1"
        >
          Specialized Business Units & Teams
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Unified Export Unit -->
        <DashboardIntelligenceExport
          :data="teams"
          :columns="[
            { field: 'name', header: 'Team Name' },
            { field: 'vertical', header: 'Vertical' },
            { field: 'targetLocale', header: 'Markets' },
            { field: 'description', header: 'Description' },
          ]"
          file-name="unireach-cell-organization"
          label="Export Teams"
          report-title="Cell Organization Intelligence"
        />

        <button
          @click="openCreateModal"
          class="flex items-center gap-2.5 px-6 py-3 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20"
        >
          <i class="pi pi-plus" />
          Provision New Cell
        </button>
      </div>
    </div>

    <!-- Teams Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loading Skeletons -->
      <template v-if="teamsLoading">
        <div
          v-for="i in 3"
          :key="'skeleton-' + i"
          class="p-6 rounded-3xl bg-surface-900/50 border border-white/5 backdrop-blur-xl space-y-6"
        >
          <div class="flex items-center gap-4">
            <Skeleton shape="circle" size="3rem" />
            <div class="space-y-2 flex-1">
              <Skeleton width="60%" height="1rem" />
              <Skeleton width="40%" height="0.6rem" />
            </div>
          </div>
          <div class="space-y-2">
            <Skeleton width="100%" height="0.6rem" />
            <Skeleton width="80%" height="0.6rem" />
          </div>
          <div class="flex gap-2">
            <Skeleton v-for="j in 3" :key="j" shape="circle" size="2rem" />
          </div>
          <div class="pt-6 border-t border-white/5 flex justify-between">
            <Skeleton width="30%" height="1rem" />
            <Skeleton width="20%" height="1rem" />
          </div>
        </div>
      </template>

      <!-- Active Teams -->
      <template v-else>
        <div
          v-for="team in teams"
          :key="team.id"
          class="group relative p-6 rounded-3xl bg-surface-900/50 border border-white/5 backdrop-blur-xl hover:border-white/10 transition-all"
        >
          <!-- Vertical Indicator -->
          <div
            class="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest border-l border-b"
            :class="
              verticalGradients[team.vertical] ||
              'bg-surface-800 text-surface-400 border-white/5'
            "
          >
            {{ team.vertical }}
          </div>

          <div class="flex flex-col h-full">
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform"
              >
                <i class="pi pi-users text-xl text-surface-400" />
              </div>
              <div>
                <h3
                  class="text-sm font-black text-white uppercase tracking-wider"
                >
                  {{ team.name }}
                </h3>
                <p
                  class="text-[9px] font-bold text-primary-500 uppercase tracking-[0.2em]"
                >
                  {{ team.targetLocale || "Global" }}
                </p>
              </div>
            </div>

            <p
              class="text-[11px] text-surface-400 leading-relaxed mb-6 line-clamp-2"
            >
              {{
                team.description ||
                "No operational description available for this business cell."
              }}
            </p>

            <div
              class="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar"
            >
              <div
                v-for="member in team.members"
                :key="member.id"
                class="flex-shrink-0 w-8 h-8 rounded-full bg-surface-800 border-2 border-surface-950 flex items-center justify-center text-[10px] font-black text-white uppercase overflow-hidden"
                :title="member.firstName + ' ' + member.lastName"
              >
                {{ member.firstName[0] }}
              </div>
              <div
                v-if="!team.members?.length"
                class="text-[8px] text-surface-600 uppercase font-black tracking-widest"
              >
                Unmanned Cell
              </div>
            </div>

            <div
              class="mt-auto pt-6 border-t border-white/5 flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <button
                  @click="openAssignModal(team)"
                  class="px-3 py-1.5 rounded-lg bg-white/5 text-[9px] font-black text-surface-400 uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Deploy
                </button>
                <button
                  @click="editTeam(team)"
                  class="p-2 text-surface-500 hover:text-white transition-colors"
                >
                  <i class="pi pi-pencil text-xs" />
                </button>
                <button
                  @click="deleteTeam(team)"
                  class="p-2 transition-colors"
                  :class="
                    team._count.members === 0
                      ? 'text-surface-500 hover:text-red-400'
                      : 'text-surface-800 cursor-not-allowed opacity-50'
                  "
                  :title="
                    team._count.members === 0
                      ? 'Dismantle Cell'
                      : 'Personnel Lock: Transfer members to delete'
                  "
                >
                  <i class="pi pi-trash text-xs" />
                </button>
              </div>
              <span
                class="text-[9px] font-bold text-surface-500 uppercase tracking-widest"
              >
                {{ team._count.members }} Active Members
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!teams.length"
          class="col-span-full py-20 bg-surface-900/30 rounded-3xl border border-dashed border-white/5 flex flex-col items-center justify-center text-center"
        >
          <i class="pi pi-sitemap text-4xl text-surface-700 mb-4" />
          <h4
            class="text-sm font-black text-surface-500 uppercase tracking-widest"
          >
            No Teams Provisioned
          </h4>
          <p class="text-xs text-surface-600 mt-2">
            Start by creating your first specialized business cell.
          </p>
        </div>
      </template>
    </div>

    <!-- Create/Edit Team Modal -->
    <Dialog
      v-model:visible="showModal"
      modal
      :header="isEditing ? 'Reconfigure Cell' : 'Provision New Cell'"
      :style="{ width: '500px' }"
      class="neural-dialog"
    >
      <div class="space-y-5 pt-4">
        <div class="flex flex-col gap-2">
          <label
            class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em]"
            >Team Name</label
          >
          <InputText
            v-model="form.name"
            required
            placeholder="e.g. Germany Admissions Team"
            class="neural-input"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label
              class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em]"
              >Vertical</label
            >
            <Select
              v-model="form.vertical"
              :options="[
                'EDUCATION',
                'MIGRATION',
                'SALES',
                'NETWORKING',
                'FINANCE',
                'ADMINISTRATION',
                'LEGAL',
              ]"
              class="neural-select"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label
              class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em]"
              >Target Locale</label
            >
            <MultiSelect
              v-model="form.targetLocale"
              :options="countries"
              optionLabel="name"
              optionValue="name"
              placeholder="Select Target Markets"
              :maxSelectedLabels="2"
              class="neural-multi-select"
              filter
            />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label
            class="text-[8px] font-black text-surface-500 uppercase tracking-[0.3em]"
            >Operational Logic</label
          >
          <Textarea
            v-model="form.description"
            rows="3"
            placeholder="Describe the mission of this cell..."
            class="neural-input h-24 resize-none"
          />
        </div>

        <div class="flex gap-3 pt-4">
          <button
            @click="showModal = false"
            class="flex-1 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
          >
            Cancel
          </button>
          <button
            @click="handleSave"
            :disabled="isSubmitting"
            class="flex-1 py-3 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all"
          >
            {{ isEditing ? "Update Cell" : "Confirm Provisioning" }}
          </button>
        </div>
      </div>
    </Dialog>

    <!-- Personnel Deployment Modal -->
    <Dialog
      v-model:visible="showAssignModal"
      modal
      :header="'Personnel Deployment: ' + selectedTeam?.name"
      :style="{ width: '500px' }"
      class="neural-dialog"
    >
      <div class="space-y-5 pt-4">
        <p
          class="text-[10px] text-surface-400 uppercase tracking-widest leading-loose"
        >
          Select operators to deploy to this business unit. Note: Personnel can
          belong to multiple cells depending on operational bandwidth.
        </p>

        <div class="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          <div
            v-for="staff in deployableStaff"
            :key="staff.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-2 hover:bg-white/10 transition-colors border border-transparent"
            :class="{
              'border-primary-500/30! bg-primary-500/5':
                selectedMembers.includes(staff.id),
            }"
          >
            <Checkbox v-model="selectedMembers" :value="staff.id" />
            <div class="flex flex-col">
              <span
                class="text-[11px] font-bold text-white uppercase tracking-wider"
                >{{ staff.firstName }} {{ staff.lastName }}</span
              >
              <span
                class="text-[8px] text-primary-400 font-black uppercase tracking-widest"
                >{{ staff.roleCode }}</span
              >
            </div>
          </div>
          <div v-if="!deployableStaff.length" class="py-10 text-center">
            <p
              class="text-[10px] text-surface-600 uppercase font-black tracking-widest"
            >
              No deployable personnel found.
            </p>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            @click="showAssignModal = false"
            class="flex-1 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
          >
            Abort
          </button>
          <button
            @click="handleAssignStaff"
            :disabled="isSubmitting"
            class="flex-1 py-3 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner" />
            {{ isSubmitting ? "Deploying..." : "Execute Deployment" }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:deep(.neural-dialog) {
  --p-dialog-background: #09090b;
  --p-dialog-border-color: rgba(255, 255, 255, 0.1);
  --p-dialog-color: white;
  --p-dialog-header-background: transparent;
  --p-dialog-title-font-size: 0.875rem;
  --p-dialog-title-font-weight: 900;
  --p-dialog-title-text-transform: uppercase;
  --p-dialog-title-letter-spacing: 0.1em;
}

:deep(.neural-input),
:deep(.neural-select),
:deep(.neural-multi-select) {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  border-radius: 12px !important;
}

:deep(.neural-input) {
  padding: 0.75rem 1rem !important;
}

:deep(.neural-multi-select .p-multiselect-label) {
  padding: 0.65rem 1rem !important;
}

:deep(.p-multiselect-panel) {
  background: #09090b !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.p-multiselect-item) {
  color: #94a3b8 !important;
  font-size: 11px !important;
  padding: 0.75rem 1rem !important;
}

:deep(.p-multiselect-item.p-highlight) {
  background: rgba(var(--p-primary-500-rgb), 0.1) !important;
  color: var(--p-primary-500) !important;
}

:deep(.p-multiselect-filter-container .p-inputtext) {
  background: rgba(255, 255, 255, 0.05) !important;
  font-size: 11px !important;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
