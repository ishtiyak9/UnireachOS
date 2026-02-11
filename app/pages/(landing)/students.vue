<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const services = ref([
  {
    id: "01",
    title: "Student Counseling",
    subtitle: "Your study abroad journey begins with the right guidance",
    description:
      "At UniReach, our experienced counselors provide personalized consultations to help you make informed decisions about your education and future. We are proudly partnered with over 200 leading universities and colleges across Australia, Canada, Malaysia, the UK, and the USA.",
    icon: "pi pi-users",
    features: [
      {
        label: "Academic Assessment",
        desc: "We evaluate your academic background and career interests to identify the best study options",
      },
      {
        label: "Choosing the Right University",
        desc: "Based on your goals, preferences, and budget, we help you select the most suitable institution",
      },
      {
        label: "Scholarship Guidance",
        desc: "Our counselors assist you in exploring and applying for scholarships to maximize financial support",
      },
      {
        label: "Financial Planning",
        desc: "We provide honest advice to help you understand the cost of studying abroad and plan your financial investment wisely",
      },
    ],
  },
  {
    id: "02",
    title: "University Admissions",
    subtitle: "Expert guidance through every step of the application process",
    description:
      "Once you've selected your desired university, our dedicated admissions team will guide you through every step. Since requirements vary across institutions, we ensure your application meets all academic and documentation standards.",
    icon: "pi pi-building",
    steps: [
      "Submit the required documents",
      "Choose your preferred university",
      "Our counselor processes your application",
      "Accept your offer letter and pay tuition fees",
      "Receive your Confirmation of Enrollment (CoE)",
    ],
  },
  {
    id: "03",
    title: "Visa Consultancy",
    subtitle: "Comprehensive visa assistance with expert coordination",
    description:
      "Obtaining a student visa can be challenging—but not when you have experts by your side. Our visa consultancy team provides a comprehensive checklist and step-by-step assistance to help you complete your visa application successfully.",
    icon: "pi pi-id-card",
    steps: [
      "Provide all required documents",
      "Prepare your visa application with our assistance",
      "Submit your application",
      "Complete biometric & medical check-up",
      "Wait for your visa decision",
    ],
  },
  {
    id: "04",
    title: "Accommodation Assistance",
    subtitle: "Finding the right place to live abroad",
    description:
      "Our team helps you explore on-campus and off-campus accommodation options that suit your preferences and budget. If you're under 18, we also assist with Home-Stay arrangements and guardianship services.",
    icon: "pi pi-home",
    features: [
      {
        label: "Suitable places to live",
        desc: "Explore accommodation options that match your lifestyle",
      },
      {
        label: "Cost of living analysis",
        desc: "Understand expenses in your destination country",
      },
      {
        label: "Budgeting advice",
        desc: "Get expert guidance on managing finances abroad",
      },
    ],
  },
  {
    id: "05",
    title: "Pre-Departure Briefing",
    subtitle: "Prepare for your exciting new journey",
    description:
      "Before you begin your journey, UniReach organizes a Pre-Departure Orientation Session. This event helps you connect with other students and university representatives while preparing you for life abroad.",
    icon: "pi pi-send",
    features: [
      {
        label: "University rules & campus life",
        desc: "Understand academic expectations and campus culture",
      },
      {
        label: "Visa regulations",
        desc: "Learn about international student visa compliance",
      },
      {
        label: "Travel guidelines",
        desc: "Airport procedures and travel planning assistance",
      },
      {
        label: "Cultural adjustment",
        desc: "Living essentials and adapting to your new environment",
      },
    ],
  },
]);

const stats = ref([
  { label: "Partner Universities", value: "350+" },
  { label: "Success Rate", value: "83%" },
  { label: "Countries", value: "22+" },
  { label: "Years Experience", value: "3+" },
]);
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Ultra-Premium Hero -->
    <section
      class="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-surface-950"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30"
        />
        <div
          class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full animate-pulse"
        />
        <div
          class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="max-w-4xl mx-auto text-center space-y-5">
          <!-- Premium Badge -->
          <div
            class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-linear-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 backdrop-blur-xl"
          >
            <div class="flex gap-1">
              <div
                class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
              />
              <div
                class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse delay-75"
              />
              <div
                class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse delay-150"
              />
            </div>
            <span
              class="text-[9px] font-black uppercase tracking-[0.5em] text-primary-400"
              >Elite Student Services</span
            >
          </div>

          <!-- Hero Headline -->
          <h1
            class="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]"
          >
            <span class="block text-white animate-slide-up">Your Academic</span>
            <span
              class="block text-transparent bg-clip-text bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 italic animate-slide-up delay-100"
              >Journey Begins.</span
            >
          </h1>

          <!-- Description -->
          <p
            class="text-sm md:text-base text-surface-300 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in delay-200"
          >
            At UniReach, we believe every student's dream and journey are
            unique. That's why we take a personalized approach—offering
            guidance, support, and solutions tailored to your individual
            academic and career goals.
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in delay-300"
          >
            <NuxtLink
              to="/contact"
              class="group px-8 py-4 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 flex items-center gap-3"
            >
              Start Your Journey
              <i
                class="pi pi-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"
              />
            </NuxtLink>
            <a
              href="#services"
              class="px-8 py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all backdrop-blur-xl"
            >
              Explore Services
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Premium Stats Bar -->
    <section
      class="py-12 bg-surface-950 border-y border-white/5 relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-linear-to-r from-primary-500/5 via-transparent to-primary-500/5"
      />
      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(stat, idx) in stats"
            :key="stat.label"
            class="group relative"
          >
            <!-- Glow Effect -->
            <div
              class="absolute -inset-1 bg-linear-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"
            />

            <!-- Card -->
            <div
              class="relative p-6 rounded-2xl bg-surface-900/30 border border-white/5 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-500 text-center"
            >
              <div
                class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-br from-primary-400 to-primary-600 italic mb-2"
              >
                {{ stat.value }}
              </div>
              <div
                class="text-[8px] font-bold text-surface-500 uppercase tracking-[0.3em]"
              >
                {{ stat.label }}
              </div>

              <!-- Index -->
              <div
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
              >
                <span class="text-[8px] font-black text-primary-500"
                  >0{{ idx + 1 }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Document Checklist -->
    <LandingDocumentChecklist />

    <!-- Services Grid with Asymmetric Layout -->
    <section
      id="services"
      class="py-20 md:py-28 bg-surface-950 relative overflow-hidden"
    >
      <!-- Background Accent -->
      <div
        class="absolute top-1/4 right-0 w-[800px] h-[800px] bg-primary-500/5 blur-[200px] rounded-full"
      />

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16 space-y-4">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
            >Comprehensive Support</span
          >
          <h2
            class="text-4xl md:text-6xl font-black text-white italic tracking-tight"
          >
            Services Designed <br />
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600 not-italic font-light"
              >For Your Success.</span
            >
          </h2>
        </div>

        <!-- Services -->
        <div class="space-y-8">
          <div
            v-for="(service, index) in services"
            :key="service.id"
            class="group"
          >
            <!-- Premium Service Card -->
            <div class="relative">
              <!-- Animated Glow -->
              <div
                class="absolute -inset-2 bg-linear-to-r from-primary-500/20 via-primary-600/20 to-primary-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />

              <!-- Main Card -->
              <div
                class="relative p-8 md:p-10 rounded-3xl bg-linear-to-br from-surface-900/40 to-surface-900/20 border border-white/10 backdrop-blur-3xl hover:border-primary-500/30 transition-all duration-700 overflow-hidden"
              >
                <!-- Floating Background Pattern -->
                <div
                  class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] transform group-hover:scale-150 transition-transform duration-1000"
                />

                <div class="relative z-10 flex flex-col lg:flex-row gap-8">
                  <!-- Left: Icon & Number -->
                  <div
                    class="flex lg:flex-col items-center lg:items-start gap-6"
                  >
                    <!-- Icon Container -->
                    <div class="relative">
                      <div
                        class="absolute inset-0 bg-primary-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
                      />
                      <div
                        class="relative w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                      >
                        <i
                          :class="[service.icon, 'text-primary-500 text-2xl']"
                        />
                      </div>
                    </div>

                    <!-- Number -->
                    <span
                      class="text-5xl font-black text-surface-800 italic group-hover:text-surface-700 transition-colors"
                      >{{ service.id }}</span
                    >
                  </div>

                  <!-- Right: Content -->
                  <div class="flex-1 space-y-6">
                    <!-- Header -->
                    <div class="space-y-3">
                      <h3
                        class="text-3xl md:text-4xl font-black text-white italic tracking-tight group-hover:text-primary-500 transition-colors duration-500"
                      >
                        {{ service.title }}
                      </h3>
                      <p
                        class="text-xs text-primary-400 font-bold uppercase tracking-[0.3em] flex items-center gap-2"
                      >
                        <span class="w-8 h-px bg-primary-500" />
                        {{ service.subtitle }}
                      </p>
                      <p
                        class="text-sm md:text-base text-surface-300 leading-relaxed font-medium"
                      >
                        {{ service.description }}
                      </p>
                    </div>

                    <!-- Features Grid -->
                    <div
                      v-if="service.features"
                      class="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div
                        v-for="(feature, idx) in service.features"
                        :key="feature.label"
                        class="group/feature p-4 rounded-xl bg-white/2 border border-white/5 hover:border-primary-500/20 hover:bg-white/4 transition-all duration-300"
                      >
                        <div class="flex items-start gap-3">
                          <div
                            class="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover/feature:bg-primary-500/20 transition-colors"
                          >
                            <i class="pi pi-check text-primary-500 text-xs" />
                          </div>
                          <div class="flex-1">
                            <h4
                              class="text-xs font-black text-white uppercase tracking-wide mb-1.5"
                            >
                              {{ feature.label }}
                            </h4>
                            <p
                              class="text-[10px] text-surface-500 leading-relaxed"
                            >
                              {{ feature.desc }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Steps List -->
                    <div v-if="service.steps" class="space-y-3">
                      <div
                        v-for="(step, idx) in service.steps"
                        :key="idx"
                        class="group/step flex items-center gap-4 p-4 rounded-xl bg-white/2 border border-white/5 hover:border-primary-500/20 hover:bg-white/4 transition-all duration-300"
                      >
                        <div class="relative flex-shrink-0">
                          <div
                            class="absolute inset-0 bg-primary-500 rounded-full blur opacity-0 group-hover/step:opacity-30 transition-opacity"
                          />
                          <div
                            class="relative w-10 h-10 rounded-full bg-linear-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center"
                          >
                            <span class="text-xs font-black text-primary-500">{{
                              idx + 1
                            }}</span>
                          </div>
                        </div>
                        <span
                          class="text-sm text-surface-200 font-medium group-hover/step:text-white transition-colors"
                          >{{ step }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Decorative Corner -->
                <div class="absolute bottom-0 right-0 w-32 h-32 opacity-5">
                  <div
                    class="absolute inset-0 bg-linear-to-tl from-primary-500 to-transparent rounded-tl-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Premium CTA Section -->
    <section
      class="py-24 md:py-32 bg-surface-950 border-t border-white/5 relative overflow-hidden"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-linear-to-r from-primary-500/10 via-primary-600/10 to-primary-500/10 blur-[150px] rounded-full animate-pulse"
        />
      </div>

      <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div class="text-center space-y-8">
          <!-- Icon Grid -->
          <div class="flex justify-center gap-3 mb-6">
            <div
              v-for="i in 3"
              :key="i"
              class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center backdrop-blur-xl animate-float"
              :style="`animation-delay: ${i * 0.2}s`"
            >
              <i
                :class="[
                  'pi',
                  i === 1
                    ? 'pi-graduation-cap'
                    : i === 2
                    ? 'pi-globe'
                    : 'pi-star',
                  'text-primary-500',
                ]"
              />
            </div>
          </div>

          <div class="space-y-5">
            <h2
              class="text-4xl md:text-6xl font-black tracking-tight leading-tight"
            >
              <span class="block text-white">Ready to Start Your</span>
              <span
                class="block text-transparent bg-clip-text bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 italic"
                >Academic Journey?</span
              >
            </h2>
            <p
              class="text-sm md:text-base text-surface-300 max-w-2xl mx-auto leading-relaxed"
            >
              At UniReach, we are committed to turning your study abroad dreams
              into reality through expert guidance, care, and professionalism.
              Let us be your trusted partner in building a brighter future.
            </p>
          </div>

          <!-- CTA Button -->
          <div class="pt-4">
            <NuxtLink
              to="/contact"
              class="group inline-flex items-center gap-4 px-12 py-5 bg-linear-to-r from-primary-500 to-primary-600 text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105"
            >
              <span>Begin Your Journey</span>
              <i
                class="pi pi-arrow-right transform group-hover:translate-x-2 transition-transform"
              />
            </NuxtLink>
          </div>

          <!-- Trust Indicators -->
          <div
            class="pt-8 flex flex-wrap justify-center gap-6 text-xs text-surface-500"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-shield text-primary-500" />
              <span>Secure Process</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-primary-500" />
              <span>98.5% Success Rate</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-users text-primary-500" />
              <span>17+ Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Study Abroad Lead Form -->
  </NuxtLayout>
</template>

<style scoped>
.bg-size-\[40px_40px\] {
  background-size: 40px 40px;
}

.bg-size-\[60px_60px\] {
  background-size: 60px 60px;
}

/* Premium Animations */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.delay-75 {
  animation-delay: 75ms;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-150 {
  animation-delay: 150ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}
</style>
