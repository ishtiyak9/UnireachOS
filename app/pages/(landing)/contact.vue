<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const formData = ref({
  fullName: "",
  email: "",
  phone: "",
  service: "",
  investmentRange: "",
  message: "",
});

const services = [
  "Business Immigration",
  "Job Immigration",
  "Student Visa",
  "Family Reunification",
  "Consultation Only",
];

const investmentRanges = [
  "€0 - €50K",
  "€50K - €250K",
  "€250K - €500K",
  "€500K+",
  "Not Applicable",
];

import { contactInfo } from "@/config/contact";

// ... (existing imports)

// ... (existing formData)

// ... (existing services and investmentRanges)

const contactMethods = ref([
  {
    icon: "pi pi-envelope",
    label: "Email",
    value: contactInfo.email.address,
    type: "email",
  },
  {
    icon: "pi pi-whatsapp",
    label: "Direct Line",
    value: contactInfo.whatsapp.display,
    type: "phone",
  },
  {
    icon: "pi pi-map-marker",
    label: "Headquarters",
    value: contactInfo.location.full,
    type: "location",
  },
]);

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));
  isSubmitting.value = false;
  // Reset form or show success message
};
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Premium Contact Hero -->
    <section
      class="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-surface-950"
    >
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20"
        ></div>
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/5 blur-[100px] rounded-full"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="max-w-3xl mx-auto text-center space-y-4">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 border border-primary-500/10"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
            ></span>
            <span
              class="text-[8px] font-black uppercase tracking-[0.4em] text-primary-400"
              >Secure Channel</span
            >
          </div>
          <h1
            class="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none"
          >
            Initiate <br />
            <span class="text-primary-500 not-italic font-light"
              >Contact Protocol.</span
            >
          </h1>
          <p
            class="text-surface-400 text-xs md:text-sm font-medium max-w-xl mx-auto leading-relaxed"
          >
            Submit your inquiry through our encrypted channel. Our executive
            team responds within 24 hours with a tailored mobility blueprint.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Contact Grid -->
    <section class="py-16 md:py-20 bg-surface-950 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <!-- Contact Form -->
          <div class="lg:col-span-7">
            <div
              class="h-full p-8 md:p-10 rounded-3xl bg-surface-900/20 border border-white/5 backdrop-blur-3xl flex flex-col"
            >
              <div class="mb-8">
                <h2
                  class="text-2xl font-black text-white italic tracking-tight mb-2"
                >
                  Dossier Submission
                </h2>
                <p class="text-xs text-surface-500 font-medium">
                  All fields are encrypted end-to-end
                </p>
              </div>

              <form
                @submit.prevent="handleSubmit"
                class="space-y-5 flex-1 flex flex-col"
              >
                <!-- Full Name -->
                <div class="space-y-2">
                  <label
                    class="text-[9px] font-black text-surface-400 uppercase tracking-widest block"
                    >Full Name</label
                  >
                  <input
                    v-model="formData.fullName"
                    type="text"
                    required
                    class="w-full px-4 py-3 bg-surface-950/50 border border-white/5 rounded-xl text-sm text-white placeholder:text-surface-600 focus:border-primary-500/30 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <!-- Email & Phone -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="space-y-2">
                    <label
                      class="text-[9px] font-black text-surface-400 uppercase tracking-widest block"
                      >Email Address</label
                    >
                    <input
                      v-model="formData.email"
                      type="email"
                      required
                      class="w-full px-4 py-3 bg-surface-950/50 border border-white/5 rounded-xl text-sm text-white placeholder:text-surface-600 focus:border-primary-500/30 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-[9px] font-black text-surface-400 uppercase tracking-widest block"
                      >Phone Number</label
                    >
                    <input
                      v-model="formData.phone"
                      type="tel"
                      class="w-full px-4 py-3 bg-surface-950/50 border border-white/5 rounded-xl text-sm text-white placeholder:text-surface-600 focus:border-primary-500/30 focus:outline-none transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <!-- Service & Investment -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div class="space-y-2">
                    <label
                      class="text-[9px] font-black text-surface-400 uppercase tracking-widest block"
                      >Service Type</label
                    >
                    <select
                      v-model="formData.service"
                      required
                      class="w-full px-4 py-3 bg-surface-950/50 border border-white/5 rounded-xl text-sm text-white focus:border-primary-500/30 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select service</option>
                      <option
                        v-for="service in services"
                        :key="service"
                        :value="service"
                      >
                        {{ service }}
                      </option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-[9px] font-black text-surface-400 uppercase tracking-widest block"
                      >Investment Range</label
                    >
                    <select
                      v-model="formData.investmentRange"
                      class="w-full px-4 py-3 bg-surface-950/50 border border-white/5 rounded-xl text-sm text-white focus:border-primary-500/30 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select range</option>
                      <option
                        v-for="range in investmentRanges"
                        :key="range"
                        :value="range"
                      >
                        {{ range }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Message -->
                <div class="space-y-2 flex-1 flex flex-col">
                  <label
                    class="text-[9px] font-black text-surface-400 uppercase tracking-widest block"
                    >Brief Overview</label
                  >
                  <textarea
                    v-model="formData.message"
                    rows="5"
                    required
                    class="flex-1 w-full px-4 py-3 bg-surface-950/50 border border-white/5 rounded-xl text-sm text-white placeholder:text-surface-600 focus:border-primary-500/30 focus:outline-none transition-colors resize-none"
                    placeholder="Describe your mobility objectives, timeline, and any specific requirements..."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-4 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <span v-if="!isSubmitting">Submit Secure Inquiry</span>
                  <span v-else>Processing...</span>
                  <i v-if="!isSubmitting" class="pi pi-arrow-right"></i>
                  <i v-else class="pi pi-spin pi-spinner"></i>
                </button>

                <!-- Privacy Notice -->
                <p
                  class="text-[9px] text-surface-600 text-center leading-relaxed"
                >
                  By submitting, you agree to our confidentiality protocols. All
                  data is encrypted and handled per GDPR standards.
                </p>
              </form>
            </div>
          </div>

          <!-- Contact Info Sidebar -->
          <div class="lg:col-span-5 flex flex-col gap-5">
            <!-- Direct Contact Methods -->
            <div
              class="p-5 rounded-2xl bg-surface-900/10 border border-white/5 backdrop-blur-3xl"
            >
              <h3
                class="text-sm font-black text-white uppercase tracking-widest mb-5"
              >
                Direct Channels
              </h3>
              <div class="space-y-3">
                <div
                  v-for="method in contactMethods"
                  :key="method.label"
                  class="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:border-primary-500/20 transition-colors group"
                >
                  <div
                    class="w-9 h-9 rounded-lg bg-primary-500/5 border border-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors flex-shrink-0"
                  >
                    <i :class="[method.icon, 'text-primary-500 text-xs']"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <span
                      class="text-[8px] font-black text-surface-500 uppercase tracking-widest block mb-1"
                      >{{ method.label }}</span
                    >
                    <a
                      :href="
                        method.type === 'email'
                          ? `mailto:${method.value}`
                          : method.type === 'phone'
                          ? `tel:${method.value}`
                          : '#'
                      "
                      class="text-xs font-bold text-white hover:text-primary-500 transition-colors break-all"
                    >
                      {{ method.value }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Operating Hours -->
            <div
              class="p-5 rounded-2xl bg-surface-900/10 border border-white/5 backdrop-blur-3xl"
            >
              <h3
                class="text-sm font-black text-white uppercase tracking-widest mb-5"
              >
                Operating Hours
              </h3>
              <div class="space-y-2.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-surface-400 font-medium"
                    >Monday - Friday</span
                  >
                  <span class="text-white font-bold">09:00 - 18:00 CET</span>
                </div>
                <div class="flex justify-between items-center text-xs">
                  <span class="text-surface-400 font-medium">Saturday</span>
                  <span class="text-white font-bold">10:00 - 14:00 CET</span>
                </div>
                <div class="flex justify-between items-center text-xs">
                  <span class="text-surface-400 font-medium">Sunday</span>
                  <span class="text-surface-500 font-bold italic">Closed</span>
                </div>
              </div>
              <div class="mt-5 pt-5 border-t border-white/5">
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                  ></div>
                  <span
                    class="text-[9px] font-black text-green-500 uppercase tracking-widest"
                    >Response Time: 24h</span
                  >
                </div>
              </div>
            </div>

            <!-- Google Map -->
            <div
              class="rounded-2xl overflow-hidden border border-white/5 backdrop-blur-3xl"
            >
              <div class="relative w-full h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.7982861234567!2d13.404954!3d52.520008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c655f20989%3A0x26bbfb4e84674c63!2sBrandenburg%20Gate!5e0!3m2!1sen!2sde!4v1234567890&style=feature:all|element:geometry|color:0x242f3e&style=feature:all|element:labels.text.stroke|color:0x242f3e&style=feature:all|element:labels.text.fill|color:0x746855&style=feature:water|element:geometry|color:0x17263c"
                  width="100%"
                  height="100%"
                  style="border: 0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                ></iframe>
              </div>
            </div>

            <!-- Trust Indicators -->
            <div
              class="p-5 rounded-2xl bg-primary-500/5 border border-primary-500/10 backdrop-blur-3xl"
            >
              <div class="flex items-start gap-3">
                <i
                  class="pi pi-shield text-primary-500 text-lg mt-0.5 flex-shrink-0"
                ></i>
                <div>
                  <h4 class="text-sm font-black text-white mb-2">
                    Secure & Confidential
                  </h4>
                  <p class="text-[10px] text-surface-400 leading-relaxed">
                    All communications are encrypted end-to-end. Your data is
                    never shared with third parties and is handled in strict
                    compliance with international privacy regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Quick Links -->
    <section class="py-16 bg-surface-950 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-12">
          <h2
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] mb-3"
          >
            Quick Answers
          </h2>
          <p class="text-2xl font-black text-white italic tracking-tight">
            Common Inquiries
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="p-6 rounded-2xl bg-surface-900/10 border border-white/5 hover:border-primary-500/20 transition-all group"
          >
            <h4
              class="text-sm font-black text-white mb-2 group-hover:text-primary-500 transition-colors"
            >
              What's the typical processing time?
            </h4>
            <p class="text-xs text-surface-500 leading-relaxed">
              Initial assessment: 48-72 hours. Full processing varies by
              jurisdiction (30-180 days).
            </p>
          </div>
          <div
            class="p-6 rounded-2xl bg-surface-900/10 border border-white/5 hover:border-primary-500/20 transition-all group"
          >
            <h4
              class="text-sm font-black text-white mb-2 group-hover:text-primary-500 transition-colors"
            >
              Do you offer consultation calls?
            </h4>
            <p class="text-xs text-surface-500 leading-relaxed">
              Yes. Initial 30-minute consultations are complimentary for
              qualified candidates.
            </p>
          </div>
          <div
            class="p-6 rounded-2xl bg-surface-900/10 border border-white/5 hover:border-primary-500/20 transition-all group"
          >
            <h4
              class="text-sm font-black text-white mb-2 group-hover:text-primary-500 transition-colors"
            >
              What documents do I need?
            </h4>
            <p class="text-xs text-surface-500 leading-relaxed">
              Passport, proof of funds, CV/resume, and relevant certificates.
              Full checklist provided after initial contact.
            </p>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}
</style>
