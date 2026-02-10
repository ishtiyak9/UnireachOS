<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const services = ref([
  {
    id: "01",
    title: "Event Coordination",
    description:
      "We organize regular events by request, inviting university representatives to meet prospective students directly at our expos and fairs.",
    icon: "pi pi-calendar",
  },
  {
    id: "02",
    title: "Student Vetting",
    description:
      "We conduct thorough academic and background checks on student applicants, freeing institutional partners from early-stage vetting work.",
    icon: "pi pi-verified",
  },
  {
    id: "03",
    title: "Recruitment Support",
    description:
      "We support recruitment drives, outreach initiatives, and have structured workflows to maintain communication and feedback between institutions and students.",
    icon: "pi pi-users",
  },
]);

const benefits = ref([
  {
    title: "Transparency & Professionalism",
    description:
      "We've built a reputation for transparency, professionalism, and efficiency when working with educational institutions.",
    icon: "pi pi-shield",
  },
  {
    title: "Quality Over Quantity",
    description:
      "Our team prioritizes quality over quantity — selecting, preparing, and presenting motivated students to our university partners.",
    icon: "pi pi-star",
  },
  {
    title: "Clear Reporting",
    description:
      "We provide clear reporting and consistent follow-through, so partner universities always know the status of students and applications.",
    icon: "pi pi-chart-line",
  },
  {
    title: "Local Presence",
    description:
      "Partners benefit from our established local presence, logistical support for events, and student services that enhance institutional branding.",
    icon: "pi pi-map-marker",
  },
]);

const testimonials = ref([
  {
    quote:
      "UniReach has been instrumental in our recruitment efforts. Their counselors understand our academic requirements and present students who are well-prepared and aligned with our expectations.",
    author: "University Representative",
    institution: "Leading Australian University",
  },
  {
    quote:
      "Working with UniReach has streamlined our outreach in Bangladesh. Their event coordination and student liaison services are both professional and effective.",
    author: "Academic Affairs Office",
    institution: "Canadian Institution",
  },
]);

const stats = ref([
  { label: "Partner Universities", value: "350+" },
  { label: "Countries Covered", value: "22+" },
  { label: "Annual Events", value: "50+" },
  { label: "Success Rate", value: "83%" },
]);
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Compact Hero -->
    <section
      class="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-surface-950"
    >
      <!-- Animated Background -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30"
        />
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/10 blur-[120px] rounded-full animate-pulse"
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
              >Institutional Partnerships</span
            >
          </div>

          <!-- Hero Headline -->
          <h1
            class="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]"
          >
            <span class="block text-white">Expanding Your</span>
            <span
              class="block text-transparent bg-clip-text bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 italic"
              >Institutional Reach.</span
            >
          </h1>

          <!-- Description -->
          <p
            class="text-sm md:text-base text-surface-300 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            At UniReach, we specialize in creating strong collaborations with
            universities and colleges around the world. With years of
            experience, we've built relationships across primary study
            destinations — enabling us to facilitate student recruitment, event
            partnerships, and institutional promotion.
          </p>

          <!-- CTA -->
          <div class="pt-2">
            <NuxtLink
              to="/contact"
              class="group inline-flex items-center gap-3 px-8 py-4 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
            >
              Become a Partner
              <i
                class="pi pi-arrow-right text-xs transform group-hover:translate-x-1 transition-transform"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
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
            <div
              class="absolute -inset-1 bg-linear-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"
            />
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

    <!-- About Section -->
    <section class="py-16 md:py-20 bg-surface-950 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12 space-y-3">
            <span
              class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
              >Our Network</span
            >
            <h2
              class="text-3xl md:text-5xl font-black text-white italic tracking-tight"
            >
              About Our <br />
              <span
                class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600 not-italic font-light"
                >Partner Network.</span
              >
            </h2>
          </div>
          <div
            class="p-8 md:p-10 rounded-3xl bg-linear-to-br from-surface-900/40 to-surface-900/20 border border-white/10 backdrop-blur-3xl"
          >
            <p
              class="text-base md:text-lg text-surface-200 leading-relaxed text-center"
            >
              We ensure partners get reliable, high-quality support for student
              admissions and engagement. Our relationships span across
              Australia, Canada, the UK, the USA, Malaysia, and beyond —
              creating opportunities for institutions to connect with motivated,
              qualified students ready to excel in their academic journeys.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-16 md:py-20 bg-surface-950 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-12 space-y-3">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
            >Partner Services</span
          >
          <h2
            class="text-3xl md:text-5xl font-black text-white italic tracking-tight"
          >
            What We Do <br />
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600 not-italic font-light"
              >For Our Partners.</span
            >
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="service in services"
            :key="service.id"
            class="group relative"
          >
            <div
              class="absolute -inset-1 bg-linear-to-r from-primary-500/20 to-primary-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div
              class="relative h-full p-6 rounded-2xl bg-linear-to-br from-surface-900/40 to-surface-900/20 border border-white/10 backdrop-blur-3xl hover:border-primary-500/30 transition-all duration-500"
            >
              <div class="flex flex-col h-full">
                <div class="flex items-start justify-between mb-4">
                  <div class="relative">
                    <div
                      class="absolute inset-0 bg-primary-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"
                    />
                    <div
                      class="relative w-14 h-14 rounded-xl bg-linear-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                    >
                      <i :class="[service.icon, 'text-primary-500 text-xl']" />
                    </div>
                  </div>
                  <span class="text-3xl font-black text-surface-800 italic">{{
                    service.id
                  }}</span>
                </div>
                <h3
                  class="text-xl font-black text-white mb-3 group-hover:text-primary-500 transition-colors"
                >
                  {{ service.title }}
                </h3>
                <p class="text-sm text-surface-400 leading-relaxed flex-1">
                  {{ service.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 md:py-20 bg-surface-950 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-12 space-y-3">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
            >Partnership Benefits</span
          >
          <h2
            class="text-3xl md:text-5xl font-black text-white italic tracking-tight"
          >
            Why Partner <br />
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600 not-italic font-light"
              >With UniReach.</span
            >
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-5">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="group p-6 rounded-2xl bg-surface-900/20 border border-white/5 hover:border-primary-500/20 hover:bg-surface-900/30 transition-all duration-300"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors"
              >
                <i :class="[benefit.icon, 'text-primary-500 text-lg']" />
              </div>
              <div class="flex-1">
                <h3
                  class="text-lg font-black text-white mb-2 group-hover:text-primary-500 transition-colors"
                >
                  {{ benefit.title }}
                </h3>
                <p class="text-sm text-surface-400 leading-relaxed">
                  {{ benefit.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 md:py-20 bg-surface-950 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-12 space-y-3">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
            >Partner Voices</span
          >
          <h2
            class="text-3xl md:text-5xl font-black text-white italic tracking-tight"
          >
            Testimonials <br />
            <span
              class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600 not-italic font-light"
              >From Our Partners.</span
            >
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="(testimonial, idx) in testimonials"
            :key="idx"
            class="group relative"
          >
            <div
              class="absolute -inset-1 bg-linear-to-r from-primary-500/10 to-primary-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
            <div
              class="relative p-8 rounded-2xl bg-linear-to-br from-surface-900/40 to-surface-900/20 border border-white/10 backdrop-blur-3xl hover:border-primary-500/20 transition-all duration-500"
            >
              <div class="mb-6">
                <i class="pi pi-quote-right text-4xl text-primary-500/20" />
              </div>
              <p class="text-base text-surface-200 leading-relaxed mb-6 italic">
                "{{ testimonial.quote }}"
              </p>
              <div class="flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  class="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center"
                >
                  <i class="pi pi-user text-primary-500 text-sm" />
                </div>
                <div>
                  <div class="text-sm font-bold text-white">
                    {{ testimonial.author }}
                  </div>
                  <div class="text-xs text-surface-500">
                    {{ testimonial.institution }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 md:py-24 bg-surface-950 relative overflow-hidden">
      <div class="absolute inset-0">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-linear-to-r from-primary-500/10 via-primary-600/10 to-primary-500/10 blur-[150px] rounded-full animate-pulse"
        />
      </div>

      <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div class="text-center space-y-8">
          <div class="flex justify-center gap-3 mb-6">
            <div
              v-for="i in 3"
              :key="i"
              class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center backdrop-blur-xl"
            >
              <i
                :class="[
                  'pi',
                  i === 1
                    ? 'pi-building'
                    : i === 2
                    ? 'pi-globe'
                    : 'pi-handshake',
                  'text-primary-500',
                ]"
              />
            </div>
          </div>

          <div class="space-y-5">
            <h2
              class="text-4xl md:text-6xl font-black tracking-tight leading-tight"
            >
              <span class="block text-white">Ready to Form</span>
              <span
                class="block text-transparent bg-clip-text bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 italic"
                >A Partnership?</span
              >
            </h2>
            <p
              class="text-sm md:text-base text-surface-300 max-w-2xl mx-auto leading-relaxed"
            >
              If you are a university or educational institution interested in
              forming a partnership, let's talk. We would be delighted to
              explore how UniReach can support your objectives — whether it's
              student recruitment, hosting events, or institutional promotion.
            </p>
          </div>

          <div class="pt-4">
            <NuxtLink
              to="/contact"
              class="group inline-flex items-center gap-4 px-12 py-5 bg-linear-to-r from-primary-500 to-primary-600 text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105"
            >
              <span>Start the Conversation</span>
              <i
                class="pi pi-arrow-right transform group-hover:translate-x-2 transition-transform"
              />
            </NuxtLink>
          </div>

          <div
            class="pt-8 flex flex-wrap justify-center gap-6 text-xs text-surface-500"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-shield text-primary-500" />
              <span>Trusted Partner</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-primary-500" />
              <span>Proven Track Record</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-users text-primary-500" />
              <span>Global Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.bg-size-\[60px_60px\] {
  background-size: 60px 60px;
}

.delay-75 {
  animation-delay: 75ms;
}

.delay-150 {
  animation-delay: 150ms;
}
</style>
