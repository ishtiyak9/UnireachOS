<script setup lang="ts">
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const groupId = route.params.id as string;

// Fetch Existing Group Data
const { data: existingGroup, pending: loadingGroup } = useFetch(
  `/api/admin/authority/groups`, // Reusing list API and filtering on client for now, or fetch specific by ID if implemented
  {
    transform: (groups: any[]) => groups.find((g) => g.id === groupId),
  }
);
// TODO: Ideally implement a GET /api/admin/authority/groups/[id] endpoint for efficiency.
// For now, assuming list is cached/fast enough or filtered client side.
// Actually, `useFetch` doesn't support complex filtering without query params.
// Let's just fetch all and find, or implement the single GET endpoint.
// Given previous context, only list GET exists. I'll rely on client-side find for simplicity unless performance is an issue.

useHead({
  title: "Modify Cluster | UniReach OS",
});

// Fetch Permissions
const { data: permissions, pending: loadingPermissions } = useFetch(
  "/api/admin/authority/permissions"
);

// State
const isLoading = ref(false);
const group = ref({
  id: "",
  name: "",
  code: "",
  description: "",
  permissions: [] as string[],
});

// Watch for data to populate form
watchEffect(() => {
  if (existingGroup.value) {
    group.value = {
      id: existingGroup.value.id,
      name: existingGroup.value.name,
      code: existingGroup.value.code,
      description: existingGroup.value.description || "",
      permissions: existingGroup.value.permissions.map(
        (p: any) => p.permission.id
      ),
    };
  }
});

// Computed: Group permissions by category for better UI
const groupedPermissions = computed(() => {
  if (!permissions.value) return {};
  return (permissions.value as any[]).reduce((acc: any, curr: any) => {
    const groupName = curr.group || "General";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(curr);
    return acc;
  }, {});
});

// Actions
const saveGroup = async () => {
  if (!group.value.name || !group.value.code) {
    toast.add({
      severity: "warn",
      summary: "Missing Fields",
      detail: "Please fill in the required fields.",
      life: 3000,
    });
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      id: group.value.id,
      name: group.value.name,
      code: group.value.code,
      description: group.value.description,
      permissionIds: group.value.permissions,
    };

    await $fetch("/api/admin/authority/groups", {
      method: "POST",
      body: payload,
    });

    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "Permission Cluster Updated",
      life: 3000,
    });
    router.push("/dashboard/authority/groups");
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.data?.message || error.message || "Update failed",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const cancel = () => {
  router.push("/dashboard/authority/groups");
};

const togglePermission = (id: string) => {
  const index = group.value.permissions.indexOf(id);
  if (index === -1) {
    group.value.permissions.push(id);
  } else {
    group.value.permissions.splice(index, 1);
  }
};
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1
          class="text-2xl font-black text-white tracking-tight uppercase italic"
        >
          Modify Cluster
        </h1>
        <p class="text-sm text-surface-500 font-medium">
          Update security parameters and authority nodes.
        </p>
      </div>
      <div class="flex gap-3">
        <Button
          label="Cancel"
          class="p-button-text text-surface-500 uppercase font-black text-xs hover:text-white"
          @click="cancel"
        />
        <Button
          label="Execute Update"
          :loading="isLoading"
          icon="pi pi-sync"
          class="bg-primary-500 border-none text-black font-black uppercase text-xs px-6 py-2.5 rounded-xl hover:bg-primary-400"
          @click="saveGroup"
        />
      </div>
    </div>

    <div v-if="loadingGroup" class="space-y-6">
      <Skeleton height="20rem" class="w-full rounded-2xl" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Core Details -->
      <div class="lg:col-span-1 space-y-6">
        <div
          class="p-6 rounded-2xl bg-surface-900/40 border border-white/5 backdrop-blur-xl"
        >
          <h3
            class="text-xs font-black text-surface-400 uppercase tracking-widest mb-6"
          >
            Core Configuration
          </h3>

          <div class="space-y-5">
            <div class="field">
              <label
                class="text-[10px] font-black uppercase text-surface-500 tracking-widest mb-2 block"
                >Cluster Label</label
              >
              <InputText
                v-model.trim="group.name"
                required
                class="w-full bg-surface-900 border-white/10 rounded-xl focus:border-primary-500/50 transition-colors text-sm py-2.5"
                placeholder="e.g. Admission Ops"
              />
            </div>

            <div class="field">
              <label
                class="text-[10px] font-black uppercase text-surface-500 tracking-widest mb-2 block"
                >System Anchor</label
              >
              <InputText
                v-model.trim="group.code"
                disabled
                class="w-full bg-surface-900 border-white/10 rounded-xl font-mono text-xs py-2.5 opacity-60 cursor-not-allowed"
                placeholder="e.g. admission_ops"
              />
              <small class="text-[9px] text-surface-600 mt-1.5 block"
                >Unique immutable identifier for system internals.</small
              >
            </div>

            <div class="field">
              <label
                class="text-[10px] font-black uppercase text-surface-500 tracking-widest mb-2 block"
                >Operational Scope</label
              >
              <Textarea
                v-model="group.description"
                rows="6"
                class="w-full bg-surface-900 border-white/10 rounded-xl resize-none text-sm"
                placeholder="Describe the cluster scope..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Permissions Matrix -->
      <div class="lg:col-span-2 space-y-6">
        <div
          class="p-6 rounded-2xl bg-surface-900/40 border border-white/5 backdrop-blur-xl"
        >
          <div class="flex items-center justify-between mb-6">
            <h3
              class="text-xs font-black text-surface-400 uppercase tracking-widest"
            >
              Authority Matrix
            </h3>
            <div class="flex gap-2">
              <span
                class="px-2 py-1 rounded-md bg-white/5 text-[9px] font-mono text-surface-400"
                >{{ group.permissions.length }} Selected</span
              >
            </div>
          </div>

          <div v-if="loadingPermissions" class="space-y-4">
            <Skeleton
              height="4rem"
              class="w-full rounded-xl"
              v-for="i in 3"
              :key="i"
            />
          </div>

          <div v-else class="space-y-8">
            <div
              v-for="(perms, groupName) in groupedPermissions"
              :key="groupName"
            >
              <div class="flex items-center gap-2 mb-4">
                <div class="h-px bg-white/10 flex-1"></div>
                <span
                  class="text-[10px] font-black text-primary-500 uppercase tracking-widest"
                  >{{ groupName }}</span
                >
                <div class="h-px bg-white/10 flex-1"></div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="perm in perms"
                  :key="perm.id"
                  @click="togglePermission(perm.id)"
                  class="cursor-pointer group relative p-3 rounded-xl border transition-all duration-300 flex items-start gap-3"
                  :class="[
                    group.permissions.includes(perm.id)
                      ? 'bg-primary-500/10 border-primary-500/30'
                      : 'bg-surface-950/30 border-white/5 hover:border-white/10 hover:bg-surface-950/50',
                  ]"
                >
                  <div
                    class="mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors"
                    :class="[
                      group.permissions.includes(perm.id)
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-white/20 group-hover:border-white/40',
                    ]"
                  >
                    <i
                      v-if="group.permissions.includes(perm.id)"
                      class="pi pi-check text-[10px] text-black font-bold"
                    />
                  </div>
                  <div>
                    <h4
                      class="text-xs font-bold text-white mb-0.5 group-hover:text-primary-200 transition-colors"
                    >
                      {{ perm.name }}
                    </h4>
                    <p class="text-[10px] text-surface-500 font-mono">
                      {{ perm.code }}
                    </p>
                    <p
                      v-if="perm.description"
                      class="text-[10px] text-surface-600 mt-1 line-clamp-1"
                    >
                      {{ perm.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
