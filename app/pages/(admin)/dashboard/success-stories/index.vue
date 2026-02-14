<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

useHead({
  title: "Victory Management | UniReach OS",
});

const toast = useToast();
const stories = ref([]);
const loading = ref(true);
const storyDialog = ref(false);
const deleteDialog = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const story = ref({
  id: null,
  name: "",
  type: "image",
  category: "student",
  destination: "",
  university: "",
  program: "",
  visaType: "",
  year: new Date().getFullYear().toString(),
  thumbnail: "",
  image: "",
  videoUrl: "",
  quote: "",
  isFeatured: false,
  isActive: true,
});

const categories = [
  { label: "Student", value: "student" },
  { label: "Business", value: "business" },
  { label: "Job", value: "job" },
];

const types = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

const fetchStories = async () => {
  loading.value = true;
  try {
    const data = await $fetch("/api/success-stories");
    stories.value = data;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to fetch stories",
      life: 3000,
    });
  } finally {
    // Artificial delay for slick skeleton demo
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
};

onMounted(fetchStories);

const openNew = () => {
  story.value = {
    id: null,
    name: "",
    type: "image",
    category: "student",
    destination: "",
    university: "",
    program: "",
    visaType: "",
    year: new Date().getFullYear().toString(),
    thumbnail: "",
    image: "",
    videoUrl: "",
    quote: "",
    isFeatured: false,
    isActive: true,
  };
  storyDialog.value = true;
};

const editStory = (s) => {
  story.value = { ...s };
  storyDialog.value = true;
};

const confirmDeleteStory = (s) => {
  story.value = s;
  deleteDialog.value = true;
};

const deleteStory = async () => {
  try {
    await $fetch(`/api/success-stories/${story.value.id}`, {
      method: "DELETE",
    });
    stories.value = stories.value.filter((val) => val.id !== story.value.id);
    deleteDialog.value = false;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Story Deleted",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Delete Failed",
      life: 3000,
    });
  }
};

const saveStory = async () => {
  try {
    if (story.value.id) {
      const updated = await $fetch(`/api/success-stories/${story.value.id}`, {
        method: "PUT",
        body: story.value,
      });
      const index = stories.value.findIndex((s) => s.id === updated.id);
      stories.value[index] = updated;
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Story Updated",
        life: 3000,
      });
    } else {
      const created = await $fetch("/api/success-stories", {
        method: "POST",
        body: story.value,
      });
      stories.value.unshift(created);
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Story Created",
        life: 3000,
      });
    }
    storyDialog.value = false;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Save Failed",
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="relative space-y-8 pb-10">
    <div
      class="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"
    />

    <!-- Tactical Header -->
    <DashboardPageHeader
      title="VICTORY"
      subtitle="Recalibrate Global Success Records & Victory Archives"
    >
      <template #title>
        VICTORY <span class="text-primary-500 italic">ARCHIVES.</span>
      </template>

      <template #actions>
        <!-- Unified Export Unit -->
        <DashboardIntelligenceExport
          :data="stories"
          :columns="[
            { field: 'name', header: 'Candidate' },
            { field: 'destination', header: 'Target' },
            { field: 'category', header: 'Sector' },
            { field: 'year', header: 'Year' },
            { field: 'university', header: 'University' },
            { field: 'visaType', header: 'Visa Type' },
          ]"
          file-name="unireach-victory-archives"
          label="Export Archives"
          report-title="Victory Archives Intelligence"
        />

        <Button
          icon="pi pi-plus"
          label="Provision Record"
          @click="openNew"
          class="p-button-primary! h-10! rounded-xl! font-black! text-[9px]! uppercase! tracking-widest! px-4!"
        />
      </template>
    </DashboardPageHeader>

    <div
      class="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl"
    >
      <DataTable
        :value="loading ? Array.from({ length: 5 }) : stories"
        v-model:filters="filters"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :globalFilterFields="[
          'name',
          'destination',
          'university',
          'visaType',
          'year',
        ]"
        class="p-datatable-sm"
        removableSort
        pt:header:class="bg-transparent border-b border-white/5 p-6"
      >
        <template #header>
          <div
            class="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div
              class="text-[10px] font-black uppercase tracking-[0.2em] text-surface-500"
            >
              Mission Log Registry
            </div>
            <div class="relative w-full md:w-80">
              <i
                class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 text-xs"
              />
              <InputText
                v-model="filters['global'].value"
                placeholder="Search Intelligence Base..."
                class="w-full! bg-surface-950/50! border-white/5! pl-12! h-10! text-xs font-bold rounded-xl focus:border-primary-500/50!"
              />
            </div>
          </div>
        </template>

        <Column
          field="name"
          header="Candidate"
          sortable
          class="font-bold text-white"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" width="60%" height="1rem" />
            <span v-else>{{ slotProps.data.name }}</span>
          </template>
        </Column>

        <Column
          field="destination"
          header="Target"
          sortable
          class="text-surface-400"
        >
          <template #body="slotProps">
            <Skeleton v-if="loading" width="40%" height="1rem" />
            <span v-else>{{ slotProps.data.destination }}</span>
          </template>
        </Column>

        <Column field="category" header="Sector" sortable>
          <template #body="slotProps">
            <Skeleton v-if="loading" width="50px" height="1.5rem" />
            <Tag
              v-else
              :value="slotProps.data.category.toUpperCase()"
              :severity="
                slotProps.data.category === 'student' ? 'info' : 'success'
              "
              class="text-[9px] font-black px-2 py-0.5"
            />
          </template>
        </Column>

        <Column field="year" header="Year" sortable>
          <template #body="slotProps">
            <Skeleton v-if="loading" width="30px" height="1rem" />
            <span v-else>{{ slotProps.data.year }}</span>
          </template>
        </Column>

        <Column field="isActive" header="Status" sortable>
          <template #body="slotProps">
            <Skeleton v-if="loading" shape="circle" size="1rem" />
            <i
              v-else
              class="pi"
              :class="
                slotProps.data.isActive
                  ? 'pi-check-circle text-emerald-500'
                  : 'pi-times-circle text-rose-500'
              "
            ></i>
          </template>
        </Column>

        <Column header="Actions" alignFrozen="right" frozen>
          <template #body="slotProps">
            <Skeleton v-if="loading" width="60px" height="2rem" />
            <div v-else class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                text
                rounded
                severity="secondary"
                @click="editStory(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                @click="confirmDeleteStory(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Edit/New Dialog -->
    <Dialog
      v-model:visible="storyDialog"
      :header="story.id ? 'Recalibrate Record' : 'Log New Victory'"
      :modal="true"
      class="w-full max-w-2xl bg-surface-900!"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >FullName</label
          >
          <InputText
            v-model="story.name"
            placeholder="Candidate Name"
            class="bg-surface-950!"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Sector</label
          >
          <Select
            v-model="story.category"
            :options="categories"
            optionLabel="label"
            optionValue="value"
            class="bg-surface-950!"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Destination</label
          >
          <InputText
            v-model="story.destination"
            placeholder="e.g. Canada"
            class="bg-surface-950!"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Year</label
          >
          <InputText v-model="story.year" class="bg-surface-950!" />
        </div>
        <div class="flex flex-col gap-2 md:col-span-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Personal Insight (Quote)</label
          >
          <Textarea v-model="story.quote" rows="3" class="bg-surface-950!" />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Media Type</label
          >
          <Select
            v-model="story.type"
            :options="types"
            optionLabel="label"
            optionValue="value"
            class="bg-surface-950!"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Featured Mission</label
          >
          <div class="flex items-center gap-2 h-full">
            <ToggleSwitch v-model="story.isFeatured" />
            <span class="text-xs text-surface-400">Pin to Spotlight</span>
          </div>
        </div>
        <div class="flex flex-col gap-2 md:col-span-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Thumbnail URL</label
          >
          <InputText
            v-model="story.thumbnail"
            placeholder="CDN/Unsplash Link"
            class="bg-surface-950!"
          />
        </div>
        <div
          v-if="story.type === 'image'"
          class="flex flex-col gap-2 md:col-span-2"
        >
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Full Image URL</label
          >
          <InputText v-model="story.image" class="bg-surface-950!" />
        </div>
        <div v-else class="flex flex-col gap-2 md:col-span-2">
          <label
            class="text-[10px] font-black uppercase tracking-widest text-surface-400"
            >Embed URL</label
          >
          <InputText
            v-model="story.videoUrl"
            placeholder="YouTube Embed URL"
            class="bg-surface-950!"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 pt-6">
          <Button
            label="Abort"
            text
            severity="secondary"
            @click="storyDialog = false"
            class="text-xs font-bold uppercase"
          />
          <Button
            label="Commit Changes"
            @click="saveStory"
            class="bg-primary-500! border-0! text-black! text-xs font-black uppercase px-6"
          />
        </div>
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog
      v-model:visible="deleteDialog"
      header="Confirm Deletion"
      :modal="true"
      class="w-80"
    >
      <p class="text-sm text-surface-400">
        Are you sure you want to purge this record from history?
      </p>
      <template #footer>
        <Button
          label="No"
          text
          severity="secondary"
          @click="deleteDialog = false"
        />
        <Button label="Yes, Purge" severity="danger" @click="deleteStory" />
      </template>
    </Dialog>
  </div>
</template>

<style>
.p-datatable {
  background: transparent !important;
}
.p-datatable .p-datatable-thead > tr > th {
  background: rgba(255, 255, 255, 0.02) !important;
  color: var(--p-surface-400) !important;
  font-size: 10px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.p-datatable .p-datatable-tbody > tr {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02) !important;
}
.p-datatable .p-datatable-tbody > tr:hover {
  background: rgba(255, 255, 255, 0.02) !important;
}
</style>
