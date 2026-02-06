<template>
  <div
    class="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-surface-50 to-surface-100 dark:from-surface-950 dark:via-surface-950 dark:to-surface-900 py-12 px-4 transition-colors duration-500"
  >
    <div class="max-w-4xl mx-auto space-y-12">
      <!-- Header Section -->
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
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-700"
            >Design System</span
          >
        </h1>
        <p
          class="text-surface-600 dark:text-surface-400 text-lg max-w-xl mx-auto"
        >
          A high-performance component library built with
          <span class="font-semibold text-surface-900 dark:text-surface-100"
            >Nuxt 4</span
          >,
          <span class="font-semibold text-surface-900 dark:text-surface-100"
            >PrimeVue</span
          >, and
          <span class="font-semibold text-surface-900 dark:text-surface-100"
            >Tailwind 4</span
          >.
        </p>
      </div>

      <!-- Main Demo Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Form Section -->
        <div class="lg:col-span-12">
          <div
            class="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-surface-200/50 dark:border-surface-800/50 space-y-10"
          >
            <div
              class="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 pb-6"
            >
              <div class="space-y-1">
                <h2
                  class="text-2xl font-bold text-surface-900 dark:text-surface-0 flex items-center gap-3"
                >
                  <div class="p-2 rounded-lg bg-primary/10">
                    <Icon
                      name="lucide:layout-template"
                      class="text-primary w-6 h-6"
                    />
                  </div>
                  Reusable Base Library
                </h2>
                <p class="text-sm text-surface-500 ml-12">
                  Atomic components following the single source of truth
                  pattern.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <BaseInput
                id="full-name"
                v-model="formData.name"
                label="Full Name"
                placeholder="Enter your full name"
                required
                :error="v$.name.$error ? 'Name is required' : ''"
                @blur="v$.name.$touch"
              />

              <BaseInput
                id="email"
                v-model="formData.email"
                label="Email Address"
                placeholder="you@unireach.com"
                type="email"
                :error="v$.email.$error ? 'Invalid email format' : ''"
                @blur="v$.email.$touch"
              />

              <BasePassword
                id="password"
                v-model="formData.password"
                label="Security Password"
                placeholder="Choose a strong password"
                description="Must be at least 8 characters"
                required
              />

              <BaseSelect
                id="role"
                v-model="formData.role"
                label="Member Role"
                :options="roles"
                option-label="name"
                placeholder="Select organizational role"
              />

              <div class="md:col-span-2 pt-2">
                <BaseCheckbox
                  id="terms"
                  v-model="formData.terms"
                  label="I agree to the UniReach Terms of Service and Data Privacy Policy."
                  help-text="Your data is encrypted and ISO/IEC 27001 compliant."
                />
              </div>
            </div>

            <!-- Actions -->
            <div
              class="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-surface-100 dark:border-surface-800"
            >
              <BaseButton
                label="Initialize System"
                icon="pi pi-bolt"
                class="w-full sm:w-auto h-12 px-8 !rounded-xl"
                @click="handleSubmit"
              />
              <BaseButton
                label="Preview Documentation"
                severity="secondary"
                variant="outlined"
                icon="pi pi-external-link"
                class="w-full sm:w-auto h-12 px-8 !rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Success Notification Pop-over -->
      <Transition
        enter-active-class="transform transition duration-500 ease-out"
        enter-from-class="translate-y-12 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="submitted"
          class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            class="bg-surface-900 dark:bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <div class="bg-white/20 p-1.5 rounded-full">
              <Icon name="lucide:check" class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="font-bold text-sm">System Ready</p>
              <p class="text-white/80 text-xs">
                Design system components are fully operational.
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const formData = reactive({
  name: "",
  email: "",
  password: "",
  role: null,
  terms: false,
});

const rules = {
  name: { required },
  email: { required, email },
};

const v$ = useVuelidate(rules, formData);

const roles = [
  { name: "Organization Admin", value: "admin" },
  { name: "Lead Consultant", value: "consultant" },
  { name: "Regional Manager", value: "manager" },
];

const submitted = ref(false);

const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    submitted.value = true;
    setTimeout(() => (submitted.value = false), 4000);
  }
};
</script>
