<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const successStats = ref([
  { label: "Success Rate", value: "98.4%" },
  { label: "Jurisdictions", value: "24+" },
  { label: "Processing", value: "72h Audit" },
  { label: "Total Assets Managed", value: "€42M+" },
]);

const pathways = ref([
  {
    title: "Skilled Entrepreneurship",
    capEx: "€0",
    desc: "Leverage innovate models and professional excellence to secure residency through D7, startup, and highly-skilled pathways.",
    icon: "pi pi-user-plus",
    features: [
      "Innovative Startup",
      "Digital Nomad",
      "Self-Employed",
      "D7 Route",
    ],
  },
  {
    title: "Sovereign Investment",
    capEx: "€500K+",
    desc: "Tier-1 capital paths for Golden Visas and Citizenship by Investment. Total asset security and institutional diplomatic clearing.",
    icon: "pi pi-briefcase",
    features: ["Golden Visa", "Real Estate", "Venture Fund", "Sovereign Bond"],
  },
]);

const auditSteps = ref([
  {
    title: "Solvency Deep-Scan",
    icon: "pi pi-shield",
    desc: "Technical audit of cross-border liquid assets and institutional standing.",
  },
  {
    title: "Legislative Mapping",
    icon: "pi pi-map",
    desc: "Real-time synchronization with Schengen migration law and local directives.",
  },
  {
    title: "Diplomatic Clearing",
    icon: "pi pi-check-circle",
    desc: "Direct pre-clearance logic with regional institutional partners.",
  },
  {
    title: "Asset Security",
    icon: "pi pi-lock",
    desc: "Ultra-secure handling of HNWI financial portfolios and sovereign bonds.",
  },
]);

const hubs = ref([
  {
    name: "Portugal",
    program: "D7 / Golden Visa",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=600",
  },
  {
    name: "Spain",
    program: "Entrepreneur / Digital",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=600",
  },
  {
    name: "Germany",
    program: "Blue Card / Startup",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600",
  },
  {
    name: "Bulgaria",
    program: "Trade Representative / TRO",
    image:
      "https://images.unsplash.com/photo-1563811771046-ba984ff30900?q=80&w=600",
  },
]);

const services = ref([
  "Tax Optimization",
  "Real Estate Acquisition",
  "Corporate Directorship",
  "Multi-Generational Planning",
  "Diplomatic Escort",
  "Asset Liquidity",
]);
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Sovereign Business Hero: Compact & Elite -->
    <section
      class="relative pt-24 pb-12 md:pt-36 md:pb-16 overflow-hidden bg-surface-950"
    >
      <div class="absolute inset-0 z-0">
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(var(--p-primary-500-rgb),0.07)_0%,transparent:70%)] opacity-40"
        />
        <div
          class="absolute inset-0 bg-size-[60px_60px] bg-[radial-gradient(circle_at_center,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px)]"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div
          class="flex flex-col lg:flex-row items-end justify-between gap-12 border-b border-white/5 pb-16"
        >
          <div class="max-w-3xl space-y-6">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 border border-primary-500/10"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
              />
              <span
                class="text-[8px] font-black uppercase tracking-[0.4em] text-primary-400"
                >Institutional Mobility</span
              >
            </div>
            <h1
              class="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none animate-slide-up"
            >
              The Sovereign <br >
              <span class="text-primary-500 not-italic font-light"
                >Arrival Protocol.</span
              >
            </h1>
            <p
              class="text-surface-400 text-sm md:text-lg font-medium max-w-xl leading-relaxed animate-fade-in delay-200"
            >
              Engineered for visionary entrepreneurs and ultra-high-net-worth
              individuals. We transform complex cross-border residency into a
              surgical, institutional-grade outcome.
            </p>
          </div>

          <div
            class="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300"
          >
            <a
              href="#consultation"
              class="px-8 py-4 bg-primary-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:shadow-[0_0_30px_rgba(var(--p-primary-500-rgb),0.3)] transition-all"
            >
              Private Briefing
            </a>
            <a
              href="#spectrum"
              class="px-8 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all"
            >
              The Spectrum
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- The Success Metrics: High Density -->
    <section class="py-12 bg-surface-950 border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in successStats" :key="stat.label" class="space-y-1">
            <span
              class="text-[8px] font-black text-primary-500 uppercase tracking-widest"
              >{{ stat.label }}</span
            >
            <div class="text-2xl font-black text-white italic tracking-tight">
              {{ stat.value }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Spectrum Grid: Premium & Compact -->
    <section id="spectrum" class="py-20 bg-surface-950 relative">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="mb-16">
          <h2
            class="text-[9px] font-black text-primary-500 uppercase tracking-[0.4em] mb-2"
          >
            The Global Spectrum
          </h2>
          <p class="text-3xl font-black text-white italic tracking-tighter">
            €0 to €500K+ Capital Architecture.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="path in pathways"
            :key="path.title"
            class="group relative p-8 rounded-3xl bg-surface-900/30 border border-white/5 hover:border-primary-500/20 transition-all duration-700 overflow-hidden"
          >
            <div
              class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"
            >
              <span class="text-6xl font-black text-white italic">{{
                path.capEx
              }}</span>
            </div>

            <div class="flex flex-col h-full space-y-6 relative z-10">
              <div
                class="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-700"
              >
                <i
                  :class="[
                    path.icon,
                    'text-primary-500 group-hover:text-black text-xl transition-colors',
                  ]"
                />
              </div>

              <div class="space-y-2">
                <h3
                  class="text-2xl font-black text-white italic tracking-tight"
                >
                  {{ path.title }}
                </h3>
                <p
                  class="text-surface-400 text-xs md:text-sm leading-relaxed font-medium"
                >
                  {{ path.desc }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-4">
                <div
                  v-for="feature in path.features"
                  :key="feature"
                  class="flex items-center gap-2"
                >
                  <div class="w-1 h-1 rounded-full bg-primary-500"/>
                  <span
                    class="text-[9px] font-bold text-surface-300 uppercase tracking-wider"
                    >{{ feature }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Evaluation Engine: High Density Context -->
    <section class="py-20 bg-surface-950 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div class="lg:col-span-4 sticky top-32 space-y-6">
            <h2
              class="text-[9px] font-black text-primary-500 uppercase tracking-[0.4em]"
            >
              Proprietary Engine
            </h2>
            <p
              class="text-4xl font-black text-white italic tracking-tighter leading-none"
            >
              The Precision <br >
              Evaluation.
            </p>
            <p class="text-surface-400 text-xs font-medium leading-relaxed">
              Every profile undergoes a multi-layer surgical audit before
              institutional submission. We mitigate risk with technical
              certainty.
            </p>
          </div>
          <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="engine in auditSteps"
              :key="engine.title"
              class="p-6 rounded-2xl bg-surface-900/20 border border-white/5 space-y-3 hover:border-primary-500/20 transition-all"
            >
              <div class="flex items-center gap-3">
                <i :class="[engine.icon, 'text-primary-500 text-sm']"/>
                <span
                  class="text-[10px] font-black text-white uppercase tracking-widest"
                  >{{ engine.title }}</span
                >
              </div>
              <p
                class="text-[11px] text-surface-500 leading-relaxed font-medium"
              >
                {{ engine.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Strategic Jurisdictions: Tier-1 Grid -->
    <section
      class="py-20 bg-surface-950 border-t border-white/5 overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div class="space-y-2">
            <h2
              class="text-[9px] font-black text-primary-500 uppercase tracking-[0.4em]"
            >
              Strategic Hubs
            </h2>
            <p class="text-3xl font-black text-white italic tracking-tighter">
              Tier-1 European Jurisdictions.
            </p>
          </div>
          <div
            class="text-[10px] font-bold text-surface-500 uppercase tracking-[0.2em] max-w-xs leading-relaxed"
          >
            Direct institutional partnerships for priority processing and
            diplomatic clearance.
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="hub in hubs"
            :key="hub.name"
            class="group relative aspect-video rounded-3xl overflow-hidden border border-white/5 hover:border-primary-500/20 transition-all duration-700"
          >
            <img
              :src="hub.image"
              alt="Jurisdiction"
              class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
            >
            <div
              class="absolute inset-0 bg-linear-to-t from-surface-950 via-surface-950/40 to-transparent"
            />
            <div class="absolute inset-0 p-6 flex flex-col justify-end">
              <span
                class="text-[8px] font-black text-primary-500 uppercase tracking-widest mb-1"
                >{{ hub.program }}</span
              >
              <h4 class="text-xl font-black text-white italic tracking-tight">
                {{ hub.name }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sovereign Support: High-Density Ticker -->
    <section class="py-8 bg-primary-500 overflow-hidden">
      <div class="flex whitespace-nowrap animate-ticker">
        <div v-for="i in 10" :key="i" class="flex items-center gap-12 px-6">
          <span
            v-for="service in services"
            :key="service"
            class="text-[9px] font-black text-black uppercase tracking-[0.3em] flex items-center gap-4"
          >
            {{ service }}
            <span class="w-1.5 h-1.5 bg-black rounded-full"/>
          </span>
        </div>
      </div>
    </section>

    <!-- Footer Consultation Protocol -->
    <section
      id="consultation"
      class="py-24 bg-surface-950 relative overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div
          class="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-surface-900/40 backdrop-blur-3xl border border-white/5 text-center space-y-12"
        >
          <div class="space-y-4">
            <h2
              class="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-tight"
            >
              Start Your <br >
              <span class="text-primary-500 not-italic font-light"
                >Institutional Arrival.</span
              >
            </h2>
            <p
              class="text-surface-400 text-sm md:text-base max-w-xl mx-auto font-medium"
            >
              Our executive consultants operate with clinical precision. Request
              a confidential brief for your mobility blueprint.
            </p>
          </div>

          <div class="pt-4">
            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-4 px-12 py-5 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-colors shadow-2xl"
            >
              Secure Clearance
              <i class="pi pi-shield"/>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-ticker {
  display: flex;
  width: max-content;
  animation: ticker 120s linear infinite;
}
.animate-ticker:hover {
  animation-play-state: paused;
}
@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  opacity: 0;
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.delay-200 {
  animation-delay: 0.1s;
}
.delay-300 {
  animation-delay: 0.2s;
}
.shadow-2xl {
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
}
</style>
