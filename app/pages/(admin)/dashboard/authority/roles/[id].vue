<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const route = useRoute();
const roleId = route.params.id as string;

const { data: roles, refresh: refreshRoles } = await useFetch(
  "/api/admin/authority/roles"
);
const { data: clusters } = await useFetch("/api/admin/authority/groups");
const { data: permissionsGrouped } = await useFetch(
  "/api/admin/authority/permissions"
);

const role = computed(() => roles.value?.find((r) => r.id === roleId));

const activePermissions = ref<string[]>([]);
const activeClusters = ref<string[]>([]);
const isSaving = ref(false);

// Initialize selections
watchEffect(() => {
  if (role.value) {
    activePermissions.value = role.value.permissions.map(
      (p: any) => p.permission.id
    );
    activeClusters.value = role.value.groups.map((g: any) => g.group.id);
  }
});

const togglePermission = (id: string) => {
  const idx = activePermissions.value.indexOf(id);
  if (idx === -1) activePermissions.value.push(id);
  else activePermissions.value.splice(idx, 1);
};

const toggleCluster = (id: string) => {
  const idx = activeClusters.value.indexOf(id);
  if (idx === -1) activeClusters.value.push(id);
  else activeClusters.value.splice(idx, 1);
};

const save = async () => {
  isSaving.value = true;
  try {
    await $fetch("/api/admin/authority/role-permissions", {
      method: "POST",
      body: { roleId, permissionIds: activePermissions.value },
    });
    await $fetch("/api/admin/authority/role-groups", {
      method: "POST",
      body: { roleId, groupIds: activeClusters.value },
    });
    await refreshRoles();
    navigateTo("/dashboard/authority/roles");
  } catch (err) {
    alert("Sync Failed");
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div v-if="role" class="max-w-7xl mx-auto space-y-6 pb-20">
    <!-- Header -->
    <div class="flex items-center justify-between px-4">
      <div class="flex items-center gap-6">
        <NuxtLink
          to="/dashboard/authority/roles"
          class="w-12 h-12 rounded-2xl bg-surface-950 border border-white/5 flex items-center justify-center text-surface-500 hover:text-white transition-all"
        >
          <i class="pi pi-arrow-left" />
        </NuxtLink>
        <div>
          <h1
            class="text-3xl font-black text-white uppercase tracking-tighter italic"
          >
            Manage Role Authority
          </h1>
          <div class="flex items-center gap-3 mt-1">
            <span
              class="text-[10px] font-black text-primary-500 uppercase tracking-widest"
              >{{ role.name }}</span
            >
            <div class="w-1 h-1 rounded-full bg-surface-700" />
            <span
              class="text-[10px] font-bold text-surface-500 uppercase tracking-widest"
              >{{ role.code }}</span
            >
          </div>
        </div>
      </div>

      <button
        @click="save"
        :disabled="isSaving"
        class="px-8 py-4 rounded-2xl bg-primary-500 text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 flex items-center gap-3"
      >
        <i :class="isSaving ? 'pi pi-spin pi-spinner' : 'pi pi-check-circle'" />
        Synchronize Authority Node
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Cluster Inheritance Section -->
      <div class="lg:col-span-4 space-y-6">
        <div
          class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden p-6 space-y-4"
        >
          <h3
            class="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6"
          >
            Neural Cluster Inheritance
          </h3>
          <div class="space-y-3">
            <div
              v-for="cluster in clusters"
              :key="cluster.id"
              @click="toggleCluster(cluster.id)"
              class="group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300"
              :class="[
                activeClusters.includes(cluster.id)
                  ? 'bg-primary-500/10 border-primary-500/40'
                  : 'bg-surface-950/40 border-white/[0.03] hover:border-white/10',
              ]"
            >
              <div>
                <div class="text-[10px] font-black uppercase text-white">
                  {{ cluster.name }}
                </div>
                <div class="text-[8px] font-bold text-surface-600 uppercase">
                  {{ cluster._count.permissions }} Inherited Nodes
                </div>
              </div>
              <div
                class="w-5 h-5 rounded-lg border flex items-center justify-center text-[10px]"
                :class="
                  activeClusters.includes(cluster.id)
                    ? 'bg-primary-500 border-primary-500 text-black'
                    : 'border-white/10'
                "
              >
                <i
                  v-if="activeClusters.includes(cluster.id)"
                  class="pi pi-check"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Granular Permission Matrix -->
      <div class="lg:col-span-8 space-y-6">
        <div
          class="bg-surface-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden p-8"
        >
          <h3
            class="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8"
          >
            Granular Capability Overrides
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              v-for="(perms, group) in permissionsGrouped"
              :key="group"
              class="space-y-5"
            >
              <h4
                class="text-[9px] font-black text-white/40 uppercase tracking-[0.5em] pl-2 border-l-2 border-primary-500/30"
              >
                {{ group }} Network
              </h4>
              <div class="space-y-2">
                <div
                  v-for="perm in perms"
                  :key="perm.id"
                  @click="togglePermission(perm.id)"
                  class="group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-300"
                  :class="[
                    activePermissions.includes(perm.id)
                      ? 'bg-primary-500/5 border-primary-500/20'
                      : 'bg-surface-950/20 border-white/[0.03] hover:border-white/5',
                  ]"
                >
                  <div class="flex flex-col">
                    <span
                      class="text-[9px] font-black uppercase"
                      :class="
                        activePermissions.includes(perm.id)
                          ? 'text-primary-400'
                          : 'text-surface-300'
                      "
                      >{{ perm.name }}</span
                    >
                    <span
                      class="text-[7px] font-bold text-surface-600 uppercase"
                      >{{ perm.code }}</span
                    >
                  </div>
                  <div
                    class="w-4 h-4 rounded-md border flex items-center justify-center text-[8px]"
                    :class="
                      activePermissions.includes(perm.id)
                        ? 'bg-primary-500 border-primary-500 text-black'
                        : 'border-white/10'
                    "
                  >
                    <i
                      v-if="activePermissions.includes(perm.id)"
                      class="pi pi-check"
                    />
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
