<script setup lang="ts">
import { ref, reactive, computed } from "vue";

// Form state
const formSubmitted = ref(false);
const isSubmitting = ref(false);

// Dynamic Countries
const { data: countriesRes } = await useFetch("/api/countries");
const countries = computed(() => (countriesRes.value as any)?.data || []);

// Options
const studyLevels = [
  { label: "Undergraduate (Bachelor's)", value: "Undergraduate" },
  { label: "Postgraduate (Master's)", value: "Postgraduate" },
  { label: "PhD / Doctorate", value: "PhD" },
  { label: "Diploma / Certificate", value: "Diploma" },
];

const passingYears = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "Before 2018",
].map((y) => ({ label: y, value: y }));

const englishTests = [
  { label: "IELTS (with score)", value: "IELTS" },
  { label: "TOEFL (with score)", value: "TOEFL" },
  { label: "PTE (with score)", value: "PTE" },
  { label: "Duolingo English Test", value: "Duolingo" },
  { label: "Planning to take test", value: "Planning" },
  { label: "No test yet", value: "None" },
];

// Form data
const formData = reactive({
  fullName: "",
  email: "",
  whatsapp: "",
  destination: "",
  studyLevel: "",
  fieldOfStudy: "",
  academicResults: "",
  passingYear: "",
  englishProficiency: "",
  message: "",
});

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    const response: any = await $fetch("/api/leads/apply", {
      method: "POST",
      body: formData,
    });

    if (response.success) {
      formSubmitted.value = true;
    }
  } catch (error: any) {
    console.error("Form submission error:", error);
    if (error.statusCode === 409) {
      alert(error.message);
    } else {
      alert(
        "There was an error submitting your application. Please check your data and try again."
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    (formData as any)[key] = "";
  });
  formSubmitted.value = false;
};
</script>

<template>
  <section class="relative py-24 overflow-hidden bg-surface-950 font-outfit">
    <!-- Intelligence OS Background -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-40"
      />
      <!-- Dynamic Orbs -->
      <div
        class="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full animate-pulse-slow"
      />
      <div
        class="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full"
      />
    </div>

    <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Form Header: Tactical Aesthetic -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-3xl mb-8 shadow-[0_0_20px_rgba(var(--p-primary-500-rgb),0.1)]"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          <span
            class="text-[9px] font-black uppercase tracking-[0.6em] text-primary-400"
            >Inquiry Protocol v1.0</span
          >
        </div>

        <h2
          class="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6"
        >
          <span class="block text-white uppercase italic">Strategic</span>
          <span
            class="block text-transparent bg-clip-text bg-linear-to-r from-primary-400 via-primary-500 to-primary-600"
            >Admissions Enquery</span
          >
        </h2>

        <div class="flex items-center justify-center gap-12 mt-8">
          <div class="flex flex-col items-center">
            <span class="text-white font-black text-xl leading-none"
              >98.5%</span
            >
            <span
              class="text-[8px] text-surface-500 uppercase tracking-widest mt-1"
              >Success Rate</span
            >
          </div>
          <div class="w-px h-8 bg-white/10" />
          <div class="flex flex-col items-center">
            <span class="text-white font-black text-xl leading-none">350+</span>
            <span
              class="text-[8px] text-surface-500 uppercase tracking-widest mt-1"
              >Global Partners</span
            >
          </div>
        </div>
      </div>

      <!-- Lead Collection Container: Neural Glass -->
      <div
        class="relative bg-surface-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-14 shadow-2xl overflow-hidden group/form"
      >
        <!-- Decorative Corners -->
        <div
          class="absolute top-0 left-0 w-24 h-24 bg-linear-to-br from-primary-500/10 to-transparent opacity-50"
        />
        <div
          class="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-primary-500/10 to-transparent opacity-50"
        />

        <!-- Success Message -->
        <Transition
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="formSubmitted" class="text-center py-20 relative z-10">
            <div
              class="w-24 h-24 bg-primary-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary-500/30 shadow-[0_0_40px_rgba(var(--p-primary-500-rgb),0.2)]"
            >
              <i class="pi pi-check text-primary-400 text-4xl" />
            </div>
            <h3
              class="text-3xl font-black text-white uppercase tracking-tighter mb-4"
            >
              Transmission Complete
            </h3>
            <p
              class="text-surface-400 text-sm max-w-sm mx-auto mb-10 leading-relaxed font-medium"
            >
              Your inquiry has been logged into our Intelligence OS. A senior
              advisor will initiate contact via WhatsApp within 24 operational
              hours.
            </p>
            <Button
              label="Submit New Inquiry"
              class="bg-linear-to-r! from-primary-500! to-primary-600! border-0! text-black! text-xs font-black uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl shadow-primary-500/20 hover:scale-105 transition-all"
              @click="resetForm"
            />
          </div>

          <!-- Tactical Form Interface -->
          <form
            v-else
            class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8"
            @submit.prevent="handleSubmit"
          >
            <!-- Full Name -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Full Identity
              </label>
              <InputText
                v-model="formData.fullName"
                required
                placeholder="Full Name"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner"
              />
            </div>

            <!-- Email -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Secure Email
              </label>
              <InputText
                v-model="formData.email"
                type="email"
                required
                placeholder="name@provider.com"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner"
              />
            </div>

            <!-- WhatsApp Number -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                WhatsApp Number
              </label>
              <InputText
                v-model="formData.whatsapp"
                required
                placeholder="880 1XXX XXXXXX"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner"
              />
            </div>

            <!-- Preferred Destination -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Target Destination
              </label>
              <Select
                v-model="formData.destination"
                :options="countries"
                optionLabel="name"
                optionValue="name"
                placeholder="Select Destination"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner flex items-center"
              />
            </div>

            <!-- Study Level -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Academic Level
              </label>
              <Select
                v-model="formData.studyLevel"
                :options="studyLevels"
                optionLabel="label"
                optionValue="value"
                placeholder="Study Level"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner flex items-center"
              />
            </div>

            <!-- Field of Study -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Focus Area
              </label>
              <InputText
                v-model="formData.fieldOfStudy"
                placeholder="e.g. Data Science"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner"
              />
            </div>

            <!-- Academic Results -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Performance Score
              </label>
              <InputText
                v-model="formData.academicResults"
                required
                placeholder="GPA / Percentage"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner"
              />
            </div>

            <!-- Passing Year -->
            <div class="space-y-3">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Graduation Year
              </label>
              <Select
                v-model="formData.passingYear"
                :options="passingYears"
                optionLabel="label"
                optionValue="value"
                placeholder="Graduation Year"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner flex items-center"
              />
            </div>

            <!-- English Proficiency -->
            <div class="space-y-3 md:col-span-2">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Lingual Assessment
              </label>
              <Select
                v-model="formData.englishProficiency"
                :options="englishTests"
                optionLabel="label"
                optionValue="value"
                placeholder="Select English Test Status"
                class="w-full! bg-surface-950/50! h-14! px-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner flex items-center"
              />
            </div>

            <!-- Message -->
            <div class="space-y-3 md:col-span-2">
              <label
                class="block text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] ml-1"
              >
                Objective Insights
              </label>
              <Textarea
                v-model="formData.message"
                rows="4"
                placeholder="Provide additional details regarding your academic goals..."
                class="w-full! bg-surface-950/50! p-6! rounded-2xl! border-white/5! text-sm font-bold shadow-inner resize-none transition-all focus:h-40!"
              />
            </div>

            <!-- Submit Button -->
            <div class="md:col-span-2 pt-10">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full relative h-16 bg-linear-to-r from-primary-500 to-primary-600 rounded-2xl overflow-hidden group/btn shadow-[0_0_50px_rgba(var(--p-primary-500-rgb),0.2)] hover:shadow-[0_0_80px_rgba(var(--p-primary-500-rgb),0.3)] transition-all duration-500 transform hover:scale-[1.01] active:scale-100 disabled:opacity-50"
              >
                <!-- Shine Effect -->
                <div
                  class="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-shine"
                />

                <div
                  class="relative flex items-center justify-center gap-4 text-black font-black uppercase tracking-[0.25em] text-[11px]"
                >
                  <span v-if="!isSubmitting">Initiate Admission Enquiry</span>
                  <span v-else>Processing Data...</span>
                  <i
                    v-if="!isSubmitting"
                    class="pi pi-bolt text-xs group-hover/btn:animate-bounce"
                  />
                </div>
              </button>
            </div>

            <!-- Privacy/Security -->
            <div
              class="md:col-span-2 flex items-center justify-center gap-6 pt-4"
            >
              <div class="flex items-center gap-2">
                <i class="pi pi-shield text-[10px] text-primary-500" />
                <span
                  class="text-[9px] font-bold text-surface-500 uppercase tracking-widest"
                  >AES-256 Encrypted</span
                >
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-lock text-[10px] text-primary-500" />
                <NuxtLink
                  to="/privacy"
                  class="text-[9px] font-bold text-surface-400 hover:text-white transition-colors uppercase tracking-widest underline underline-offset-4 decoration-primary-500/30"
                  >Privacy Matrix</NuxtLink
                >
              </div>
            </div>
          </form>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style>
/* PrimeVue Select Component Overrides to ensure consistency in Landing Page context */
.p-select {
  font-family: "Outfit", sans-serif !important;
}

.p-select-overlay {
  background: rgba(14, 14, 16, 0.95) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1.25rem !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  padding: 0.5rem !important;
}

.p-select-option {
  padding: 0.75rem 1rem !important;
  margin: 0.25rem 0 !important;
  border-radius: 0.75rem !important;
  color: var(--p-surface-300) !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  transition: all 0.2s !important;
}

.p-select-option:hover,
.p-select-option.p-focus {
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}

.p-select-option.p-highlight {
  background: rgba(var(--p-primary-500-rgb), 0.1) !important;
  color: var(--p-primary-400) !important;
}
</style>

<style scoped>
.font-outfit {
  font-family: "Outfit", sans-serif;
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes shine {
  to {
    transform: translateX(100%);
  }
}

.animate-shine {
  animation: shine 1.5s infinite;
}

/* Scrollbar Hide */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
