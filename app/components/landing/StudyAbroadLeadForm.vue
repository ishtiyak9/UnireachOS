<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

// Form state
const formSubmitted = ref(false);
const isSubmitting = ref(false);

// Dynamic Countries
const { data: countriesRes } = await useFetch("/api/countries");
const countries = computed(() => (countriesRes.value as any)?.data || []);

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
    const response = await $fetch("/api/leads/apply", {
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
  formData.fullName = "";
  formData.email = "";
  formData.whatsapp = "";
  formData.destination = "";
  formData.studyLevel = "";
  formData.fieldOfStudy = "";
  formData.academicResults = "";
  formData.passingYear = "";
  formData.englishProficiency = "";
  formData.message = "";
  formSubmitted.value = false;
};
</script>

<template>
  <section class="relative py-20 overflow-hidden bg-surface-950">
    <!-- Background Effects -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30"
      />
      <div
        class="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full animate-pulse-slow"
      />
    </div>

    <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Form Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-xl mb-6"
        >
          <i class="pi pi-graduation-cap text-primary-400 text-xs" />
          <span
            class="text-[9px] font-black uppercase tracking-[0.5em] text-primary-400"
            >Start Your Journey</span
          >
        </div>

        <h2
          class="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4"
        >
          <span class="block text-white">Study Abroad</span>
          <span
            class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic"
            >Enquiry Form</span
          >
        </h2>

        <p class="text-sm text-surface-300 max-w-2xl mx-auto">
          Take the first step towards your international education. Fill out the
          form below and our expert counselors will contact you within 24 hours.
        </p>
      </div>

      <!-- Lead Collection Form -->
      <div
        class="relative bg-surface-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl"
      >
        <!-- Success Message -->
        <div v-if="formSubmitted" class="text-center py-12">
          <div
            class="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <i class="pi pi-check text-primary-400 text-2xl" />
          </div>
          <h3 class="text-2xl font-black text-white mb-3">
            Application Received!
          </h3>
          <p class="text-surface-300 mb-6">
            Thank you for your interest. Our counselor will contact you on
            WhatsApp within 24 hours.
          </p>
          <button
            class="px-6 py-3 bg-primary-500 text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-primary-400 transition-all"
            @click="resetForm"
          >
            Submit Another Application
          </button>
        </div>

        <!-- Form Fields -->
        <form v-else class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Full Name -->
          <div>
            <label
              for="fullName"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              Full Name <span class="text-red-400">*</span>
            </label>
            <input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              required
              placeholder="Enter your full name"
              class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              Email Address <span class="text-red-400">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="your.email@example.com"
              class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <!-- WhatsApp Number -->
          <div>
            <label
              for="whatsapp"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              WhatsApp Number <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-surface-400"
              >
                <i class="pi pi-whatsapp text-green-400" />
                <span class="text-sm">+</span>
              </div>
              <input
                id="whatsapp"
                v-model="formData.whatsapp"
                type="tel"
                required
                placeholder="880 1XXX-XXXXXX"
                class="w-full pl-16 pr-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
            <p class="text-xs text-surface-500 mt-1">
              Include country code (e.g., 880 for Bangladesh)
            </p>
          </div>

          <!-- Preferred Destination -->
          <div>
            <label
              for="destination"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              Preferred Study Destination <span class="text-red-400">*</span>
            </label>
            <select
              id="destination"
              v-model="formData.destination"
              required
              class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
              style="
                background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(148, 163, 184)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e');
                background-repeat: no-repeat;
                background-position: right 1rem center;
                background-size: 1em;
              "
            >
              <option value="" disabled selected>Select a country</option>

              <!-- Dynamic Countries from DB -->
              <optgroup v-if="countries.length > 0" label="Active Destinations">
                <option v-for="c in countries" :key="c.code" :value="c.name">
                  {{ c.name }}
                </option>
              </optgroup>

              <!-- Popular Destinations Fallback -->
              <optgroup v-else label="Popular Destinations">
                <option value="Australia">Australia</option>
                <option value="Hungary">Hungary</option>
                <option value="Italy">Italy</option>
                <option value="Denmark">Denmark</option>
              </optgroup>

              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Study Level -->
          <div>
            <label
              for="studyLevel"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              Study Level <span class="text-red-400">*</span>
            </label>
            <select
              id="studyLevel"
              v-model="formData.studyLevel"
              required
              class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
              style="
                background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(148, 163, 184)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e');
                background-repeat: no-repeat;
                background-position: right 1rem center;
                background-size: 1em;
              "
            >
              <option value="" disabled selected>Select study level</option>
              <option value="Undergraduate">Undergraduate (Bachelor's)</option>
              <option value="Postgraduate">Postgraduate (Master's)</option>
              <option value="PhD">PhD / Doctorate</option>
              <option value="Diploma">Diploma / Certificate</option>
            </select>
          </div>

          <!-- Field of Study -->
          <div>
            <label
              for="fieldOfStudy"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              Field of Study
            </label>
            <input
              id="fieldOfStudy"
              v-model="formData.fieldOfStudy"
              type="text"
              placeholder="e.g., Computer Science, Business, Medicine"
              class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <!-- Academic Results & Passing Year (Side by Side) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Academic Results -->
            <div>
              <label
                for="academicResults"
                class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
              >
                Academic Results <span class="text-red-400">*</span>
              </label>
              <input
                id="academicResults"
                v-model="formData.academicResults"
                type="text"
                required
                placeholder="e.g., 3.5 GPA or 85%"
                class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <p class="text-xs text-surface-500 mt-1">
                Enter your GPA (out of 4.0) or percentage
              </p>
            </div>

            <!-- Passing Year -->
            <div>
              <label
                for="passingYear"
                class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
              >
                Passing Year <span class="text-red-400">*</span>
              </label>
              <select
                id="passingYear"
                v-model="formData.passingYear"
                required
                class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
                style="
                  background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(148, 163, 184)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e');
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  background-size: 1em;
                "
              >
                <option value="" disabled selected>Select year</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="Before 2018">Before 2018</option>
              </select>
            </div>
          </div>

          <!-- English Proficiency -->
          <div>
            <label
              for="englishProficiency"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              English Proficiency Test <span class="text-red-400">*</span>
            </label>
            <select
              id="englishProficiency"
              v-model="formData.englishProficiency"
              required
              class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
              style="
                background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(148, 163, 184)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e');
                background-repeat: no-repeat;
                background-position: right 1rem center;
                background-size: 1em;
              "
            >
              <option value="" disabled selected>Select test</option>
              <option value="IELTS">IELTS (with score)</option>
              <option value="TOEFL">TOEFL (with score)</option>
              <option value="PTE">PTE (with score)</option>
              <option value="Duolingo">Duolingo English Test</option>
              <option value="Planning">Planning to take test</option>
              <option value="None">No test yet</option>
            </select>
            <p class="text-xs text-surface-500 mt-1">
              If you have a score, please mention it in the additional
              information below
            </p>
          </div>

          <!-- Additional Message -->
          <div>
            <label
              for="message"
              class="block text-xs font-bold text-surface-200 uppercase tracking-wider mb-2"
            >
              Additional Information
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="4"
              placeholder="Tell us about your academic background, goals, or any questions you have..."
              class="w-full px-4 py-3 bg-surface-800/50 border border-white/10 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            />
          </div>

          <!-- Submit Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full group px-8 py-4 bg-primary-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <span v-if="!isSubmitting">Submit Application</span>
              <span v-else>Submitting...</span>
              <i
                v-if="!isSubmitting"
                class="pi pi-arrow-right transform group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <!-- Privacy Notice -->
          <p class="text-xs text-surface-500 text-center pt-4">
            By submitting this form, you agree to our
            <NuxtLink
              to="/privacy"
              class="text-primary-400 hover:text-primary-300 underline"
              >Privacy Policy</NuxtLink
            >. We'll contact you via WhatsApp within 24 hours.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Custom select arrow */
select option {
  background-color: rgb(var(--p-surface-800));
  color: white;
}
</style>
<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Custom select arrow */
select option {
  background-color: rgb(var(--p-surface-800));
  color: white;
}
</style>
