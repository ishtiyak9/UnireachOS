<template>
  <div
    class="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-surface-50 to-surface-100 dark:from-surface-950 dark:via-surface-950 dark:to-surface-900 py-12 px-4 transition-colors duration-500"
  >
    <div class="max-w-7xl mx-auto space-y-12">
      <!-- 1. Header Section -->
      <div
        class="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000"
      >
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-primary"
            ></span>
          </span>
          Enterprise Core UI
        </div>
        <h1
          class="text-5xl font-black text-surface-900 dark:text-surface-0 tracking-tight leading-tight"
        >
          UniReach
          <span
            class="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-700"
            >Design System</span
          >
        </h1>
        <p
          class="text-surface-600 dark:text-surface-400 text-lg max-w-xl mx-auto"
        >
          Scale your recruitment operations with our
          <span
            class="font-semibold text-surface-900 dark:text-surface-100 italic underline decoration-primary decoration-2 underline-offset-4"
            >Atomic UI Kit</span
          >.
        </p>
      </div>

      <!-- 3. Dashboard Sections -->
      <div class="space-y-16 pb-24">
        <!-- Section: Form Components -->
        <section
          id="registration"
          class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div class="lg:col-span-8 space-y-10">
            <div
              class="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-surface-200/50 dark:border-surface-800/50 space-y-8"
            >
              <h2
                class="text-3xl font-black text-surface-900 dark:text-surface-0 flex items-center gap-3"
              >
                <div class="p-2.5 rounded-2xl bg-primary/10 text-primary">
                  <Icon name="lucide:user-plus" class="w-8 h-8" />
                </div>
                Student Registration
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <BaseInput
                  v-model="formData.name"
                  label="Student Full Name"
                  placeholder="e.g. Alex Johnson"
                  required
                />
                <BaseInputMask
                  v-model="formData.phone"
                  label="Contact Number"
                  mask="(999) 999-9999"
                  placeholder="(000) 000-0000"
                />
                <BaseDatePicker
                  v-model="formData.dob"
                  label="Date of Birth"
                  placeholder="Select date"
                />
                <BaseSelect
                  v-model="formData.country"
                  label="Primary Destination"
                  :options="countries"
                  option-label="name"
                  placeholder="Select Country"
                />

                <div class="md:col-span-2">
                  <BaseRating
                    v-model="formData.leadQuality"
                    label="Lead Quality Score"
                  />
                </div>

                <div class="md:col-span-2 space-y-4">
                  <BaseMessage
                    severity="success"
                    title="Academic Credentials Verified"
                    closable
                  >
                    This student's previous academic results have been
                    successfully validated through our global partnership
                    database.
                  </BaseMessage>

                  <BaseEditor
                    v-model="formData.bio"
                    label="Statement of Purpose"
                    placeholder="Write something..."
                  />
                </div>

                <div
                  class="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-surface-100 dark:border-surface-800"
                >
                  <BaseButton
                    label="Reset Fields"
                    severity="secondary"
                    variant="outlined"
                    rounded
                    class="px-8"
                    @click="resetForm"
                  />
                  <BaseButton
                    label="Submit Application"
                    icon="pi pi-bolt"
                    rounded
                    class="px-10 shadow-xl shadow-primary/20"
                    @click="handleApply"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 space-y-8">
            <div
              class="bg-surface-900 dark:bg-primary rounded-[2.5rem] p-8 shadow-2xl text-white space-y-6"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold flex items-center gap-2">
                  <Icon name="lucide:database" />
                  Live Sync
                </h3>
                <span
                  class="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono uppercase tracking-widest"
                  >Active</span
                >
              </div>
              <div
                class="space-y-3 font-mono text-[11px] bg-black/20 p-6 rounded-3xl overflow-hidden backdrop-blur-md border border-white/5"
              >
                <pre class="whitespace-pre-wrap text-emerald-400">{{
                  JSON.stringify(formData, null, 2)
                }}</pre>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-surface-200 dark:border-surface-800 opacity-50" />

        <!-- Section: Data Management -->
        <section id="leads" class="space-y-8">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <Icon name="lucide:users" class="w-7 h-7" />
            </div>
            <div>
              <h2
                class="text-3xl font-black text-surface-900 dark:text-surface-0 tracking-tight"
              >
                Lead Pipeline
              </h2>
              <p class="text-surface-500 text-sm">
                Monitor and manage student enrollment workflow
              </p>
            </div>
          </div>

          <div
            class="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-2xl border border-surface-200/50 dark:border-surface-800/50"
          >
            <BaseDataTable
              title="Global Application Queue"
              :value="leads"
              :global-filter-fields="['name', 'email', 'country', 'status']"
              :rows="5"
            >
              <!-- Avatar Column -->
              <Column field="name" header="Student Name" sortable filter>
                <template #body="{ data }">
                  <div class="flex items-center gap-3">
                    <Avatar
                      :image="data.avatar"
                      shape="circle"
                      class="w-10! h-10!"
                    />
                    <div class="flex flex-col">
                      <span
                        class="font-bold text-surface-900 dark:text-surface-100"
                        >{{ data.name }}</span
                      >
                      <span
                        class="text-[10px] font-mono text-surface-400 uppercase tracking-tighter"
                        >{{ data.id }}</span
                      >
                    </div>
                  </div>
                </template>
              </Column>

              <Column field="email" header="Contact info" sortable filter />

              <Column field="country" header="Preference" sortable filter>
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ data.flag }}</span>
                    <span class="font-medium">{{ data.country }}</span>
                  </div>
                </template>
              </Column>

              <Column field="status" header="Stage" sortable filter>
                <template #body="{ data }">
                  <Tag
                    :value="data.status"
                    :severity="getStatusSeverity(data.status)"
                    rounded
                    class="px-3! py-1! font-black! text-[10px]!"
                  />
                </template>
              </Column>

              <Column header="Tools" class="text-right w-32">
                <template #body>
                  <div class="flex justify-end gap-2">
                    <BaseButton
                      icon="pi pi-pencil"
                      severity="secondary"
                      rounded
                      variant="text"
                      size="small"
                    />
                    <BaseButton
                      icon="pi pi-phone"
                      severity="success"
                      rounded
                      variant="text"
                      size="small"
                    />
                  </div>
                </template>
              </Column>
            </BaseDataTable>
          </div>
        </section>

        <hr class="border-surface-200 dark:border-surface-800 opacity-50" />

        <!-- Section: Analytics -->
        <section id="analytics" class="space-y-10">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Icon name="lucide:layout-dashboard" class="w-7 h-7" />
            </div>
            <div>
              <h2
                class="text-3xl font-black text-surface-900 dark:text-surface-0 tracking-tight"
              >
                Acheivement Metrics
              </h2>
              <p class="text-surface-500 text-sm">
                Visualizing recruitment performance and trends
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BaseChart
              title="Registration Velocity"
              subtitle="Daily student application flow analysis"
              icon="lucide:trending-up"
              :data="lineData"
              type="line"
            />
            <BaseChart
              title="Geography Overview"
              subtitle="Regional distribution of student interests"
              icon="lucide:pie-chart"
              :data="pieData"
              type="doughnut"
              :options="{ cutout: '65%' }"
            />
          </div>

          <div
            class="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-[3rem] p-10 border border-surface-200/50 dark:border-surface-800/50 shadow-2xl"
          >
            <div class="flex items-center gap-5 mb-10">
              <div
                class="p-4 rounded-[1.25rem] bg-indigo-500/10 text-indigo-500"
              >
                <Icon name="lucide:bar-chart-big" class="w-8 h-8" />
              </div>
              <div>
                <h3
                  class="text-2xl font-black text-surface-900 dark:text-surface-0 tracking-tight"
                >
                  Conversion Funnel
                </h3>
                <p class="text-sm text-surface-500">
                  Performance tracking from prospect to enrollment
                </p>
              </div>
            </div>
            <BaseChart :data="barData" type="bar" height="350px" />
          </div>
        </section>
      </div>
      <!-- End Content View Wrapper -->

      <!-- 4. Global Notification Overlay -->
      <Transition
        enter-active-class="transform transition duration-500 ease-out"
        enter-from-class="translate-y-12 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transform transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="submitted"
          class="fixed bottom-12 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            class="bg-surface-900 p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <Icon name="lucide:check" class="text-primary w-6 h-6" />
            <p class="text-white font-bold">
              Base Library Synchronized Successfully
            </p>
          </div>
        </div>
      </Transition>
    </div>
    <!-- End Max-width Container -->
  </div>
  <!-- End Main Screen Div -->
</template>

<script setup>
import { reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const formData = reactive({
  name: "",
  phone: "",
  dob: null,
  country: null,
  leadQuality: 3,
  bio: "<h2>Student Objective</h2><p>I am looking to study...</p>",
});

const countries = [
  { name: "United Kingdom", code: "UK" },
  { name: "Australia", code: "AU" },
  { name: "USA", code: "US" },
];

// Mock Data for Table
const leads = [
  {
    id: "UR-1001",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    country: "United Kingdom",
    flag: "🇬🇧",
    status: "In Review",
    avatar: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
  },
  {
    id: "UR-1002",
    name: "Sofia Rodriguez",
    email: "sofia.r@testmail.com",
    country: "Canada",
    flag: "🇨🇦",
    status: "Accepted",
    avatar:
      "https://primefaces.org/cdn/primevue/images/avatar/asiwajumartins.png",
  },
  {
    id: "UR-1003",
    name: "Li Wei",
    email: "wei.li@global.com",
    country: "Australia",
    flag: "🇦🇺",
    status: "New",
    avatar:
      "https://primefaces.org/cdn/primevue/images/avatar/onyekachukwu.png",
  },
  {
    id: "UR-1004",
    name: "Omar Al-Sayed",
    email: "omar.s@reach.org",
    country: "Germany",
    flag: "🇩🇪",
    status: "Rejected",
    avatar: "https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png",
  },
  {
    id: "UR-1005",
    name: "Emma Wilson",
    email: "emma.w@study.com",
    country: "USA",
    flag: "🇺🇸",
    status: "In Review",
    avatar: "https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png",
  },
  {
    id: "UR-1006",
    name: "Hiroshi Tanaka",
    email: "htanaka@web.jp",
    country: "United Kingdom",
    flag: "🇬🇧",
    status: "Accepted",
    avatar: "https://primefaces.org/cdn/primevue/images/avatar/stephenshaw.png",
  },
];

const getStatusSeverity = (status) => {
  switch (status) {
    case "Accepted":
      return "success";
    case "In Review":
      return "warn";
    case "Rejected":
      return "danger";
    case "New":
      return "info";
    default:
      return "secondary";
  }
};

const resetForm = () => {
  formData.name = "";
  formData.phone = "";
  formData.dob = null;
  formData.country = null;
  formData.leadQuality = 3;
  formData.bio = "<h2>Student Objective</h2><p>I am looking to study...</p>";

  toast.add({
    severity: "info",
    summary: "Form Reset",
    detail: "All application fields have been cleared.",
    life: 3000,
  });
};

const handleApply = () => {
  if (!formData.name) {
    toast.add({
      severity: "error",
      summary: "Missing Information",
      detail: "Please provide the student name before proceeding.",
      life: 5000,
    });
    return;
  }

  submitted.value = true;
  toast.add({
    severity: "success",
    summary: "Application Success",
    detail: `Enrollment for ${formData.name} is now processing.`,
    life: 5000,
  });

  setTimeout(() => {
    submitted.value = false;
  }, 4000);
};

const submitted = ref(false);

// Analytics Data
const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "New Leads",
      data: [65, 59, 80, 81, 56, 95],
      fill: true,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
    },
    {
      label: "Conversions",
      data: [28, 48, 40, 19, 86, 27],
      fill: false,
      borderColor: "#10b981",
      tension: 0.4,
    },
  ],
};

const pieData = {
  labels: ["UK", "Canada", "Australia", "USA", "Germany"],
  datasets: [
    {
      data: [300, 50, 100, 80, 120],
      backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"],
      hoverOffset: 20,
    },
  ],
};

const barData = {
  labels: ["Prospect", "Lead", "Application", "Offer", "Visa"],
  datasets: [
    {
      label: "Student Volume",
      data: [540, 320, 210, 150, 95],
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderRadius: 12,
    },
  ],
};
</script>
