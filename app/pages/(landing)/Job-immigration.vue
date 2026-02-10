<script setup lang="ts">
import { ref } from "vue";
definePageMeta({
  layout: false,
});

const professionalStats = ref([
  { label: "Visa Approval", value: "99.2%" },
  { label: "Elite Employers", value: "850+" },
  { label: "Contract Value", value: "€58M+" },
  { label: "Relocation Time", value: "42 Days" },
]);

const archetypes = ref([
  {
    order: "01",
    type: "Tech Visionary",
    roles: ["AI Architect", "CTO", "Lead Engineer"],
    icon: "pi pi-code",
  },
  {
    order: "02",
    type: "Industrial Vanguard",
    roles: ["Automation Lead", "Logistics Architect", "Precision Mfg."],
    icon: "pi pi-box",
  },
  {
    order: "03",
    type: "Engineering Leader",
    roles: ["Systems Architect", "Renewable Lead", "Project Director"],
    icon: "pi pi-cog",
  },
  {
    order: "04",
    type: "Medical Elite",
    roles: ["Specialist Physician", "Clinical Researcher", "Surgeon"],
    icon: "pi pi-plus-circle",
  },
]);

const protocols = ref([
  {
    title: "Dossier Hardening",
    desc: "Surgical refinement of CVs and portfolios to elite corporate standards.",
  },
  {
    title: "Institutional Matching",
    desc: "Direct injection into unpublished talent nodes within the Schengen zone.",
  },
  {
    title: "Diplomatic Bridging",
    desc: "Clinical management of Blue Card and specialist visa sequences.",
  },
  {
    title: "Post-Landing Support",
    desc: "Integration protocols including tax setup and executive logistics.",
  },
]);

const careerHubs = ref([
  { name: "Norway", focus: "Energy / Marine", icon: "pi pi-bolt" },
  { name: "Spain", focus: "Tech / Digital Nomad", icon: "pi pi-palette" },
  { name: "Netherland", focus: "Fintech / Logistics", icon: "pi pi-wallet" },
  { name: "Estonia", focus: "Cyber/ e-Governance", icon: "pi pi-shield" },
  { name: "Bulgaria", focus: "IT / Fintech", icon: "pi pi-server" },
  { name: "Poland", focus: "Software / manufacturing", icon: "pi pi-box" },
  { name: "Germany", focus: "Engineered / Automotive", icon: "pi pi-cog" },
]);
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Professional Hero: Reverting to Theme Gold -->
    <section class="relative pt-32 pb-24 overflow-hidden bg-surface-950">
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.05)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent:100%)] opacity-20"
        />
        <div
          class="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full animate-pulse"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-500/5 border border-primary-500/10"
            >
              <span
                class="text-[9px] font-black uppercase tracking-[0.3em] text-primary-400"
                >Elite Talent Mobility</span
              >
            </div>
            <h1
              class="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-slide-up"
            >
              Career <br />
              <span
                class="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600 italic"
                >Redefined.</span
              >
              >
            </h1>
            <p
              class="text-surface-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed animate-fade-in delay-200"
            >
              Direct access to Europe’s most prestigious corporate nodes. We
              transform your professional profile into an institutional outcome.
            </p>
            <div class="flex gap-4 pt-4 animate-fade-in delay-300">
              <NuxtLink
                to="/contact"
                class="px-8 py-4 bg-primary-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary-400 transition-all shadow-[0_0_30px_rgba(var(--p-primary-500-rgb),0.2)]"
              >
                Initialize Search
              </NuxtLink>
              <a
                href="#trajectory"
                class="px-8 py-4 border border-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white/5 transition-all"
              >
                The Protocols
              </a>
            </div>
          </div>

          <!-- Professional Dashboard Visual -->
          <div class="relative hidden lg:block">
            <div
              class="absolute -inset-1 bg-linear-to-r from-primary-500 to-surface-500 rounded-3xl blur opacity-10"
            />
            <div
              class="relative bg-surface-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 space-y-6"
            >
              <div class="flex justify-between items-center">
                <div class="flex gap-1">
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="w-2 h-2 rounded-full bg-primary-500/30"
                  />
                </div>
                <span
                  class="text-[8px] font-black text-surface-500 uppercase tracking-widest"
                  >Protocol Engine v4.0</span
                >
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="stat in professionalStats"
                  :key="stat.label"
                  class="p-4 rounded-xl bg-surface-950/50 border border-white/5"
                >
                  <span
                    class="text-[8px] font-bold text-surface-600 uppercase tracking-widest block mb-1"
                    >{{ stat.label }}</span
                  >
                  <span
                    class="text-xl font-black text-white italic tracking-tight"
                    >{{ stat.value }}</span
                  >
                </div>
              </div>
              <div
                class="h-1.5 w-full bg-surface-800 rounded-full overflow-hidden"
              >
                <div
                  class="h-full w-2/3 bg-primary-500 animate-[loading_2s_ease-in-out_infinite]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Talent Archetypes -->
    <section
      id="trajectory"
      class="py-24 bg-surface-950 relative border-t border-white/5"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="grid lg:grid-cols-12 gap-16">
          <div class="lg:col-span-4 space-y-4">
            <h2
              class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]"
            >
              Target Archetypes
            </h2>
            <p class="text-4xl font-black text-white italic tracking-tighter">
              Europe’s Talent Blueprint.
            </p>
            <p class="text-surface-400 text-sm leading-relaxed font-medium">
              Calibrated for leadership and innovation roles in high-impact
              economic sectors.
            </p>
          </div>
          <div class="lg:col-span-8 flex flex-col gap-4">
            <div
              v-for="arc in archetypes"
              :key="arc.type"
              class="group relative p-8 rounded-2xl bg-surface-900/20 border border-white/5 hover:border-primary-500/20 transition-all duration-700"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                  <div class="text-3xl font-black text-surface-800 italic">
                    {{ arc.order }}
                  </div>
                  <div class="space-y-1">
                    <h3
                      class="text-2xl font-black text-white tracking-tight uppercase"
                    >
                      {{ arc.type }}
                    </h3>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="role in arc.roles"
                        :key="role"
                        class="text-[9px] font-bold text-primary-500 opacity-60 uppercase tracking-wider"
                        >{{ role }}</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  class="w-10 h-10 rounded-xl bg-primary-500/5 border border-primary-500/10 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-500"
                >
                  <i
                    :class="[
                      arc.icon,
                      'text-primary-500 text-sm group-hover:text-black',
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Operational Protocols -->
    <section
      class="py-24 bg-surface-950 relative overflow-hidden border-t border-white/5"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-20 space-y-4">
          <h2
            class="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em]"
          >
            System Architecture
          </h2>
          <p class="text-5xl font-black text-white tracking-tighter italic">
            The Placement Engine.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div v-for="p in protocols" :key="p.title" class="space-y-6 group">
            <div
              class="w-12 h-12 rounded-full border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors"
            >
              <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            </div>
            <div class="space-y-2">
              <h4
                class="text-xs font-black text-white uppercase tracking-widest"
              >
                {{ p.title }}
              </h4>
              <p
                class="text-[11px] text-surface-500 leading-relaxed font-medium capitalize"
              >
                {{ p.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Regional Nodes -->
    <section class="py-24 bg-surface-950 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div
          class="flex flex-col md:flex-row justify-between items-end gap-12 mb-20"
        >
          <div class="space-y-4">
            <h2
              class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]"
            >
              Regional Nodes
            </h2>
            <p class="text-4xl font-black text-white italic tracking-tighter">
              Employment Powerhouses.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="hub in careerHubs" :key="hub.name" class="group relative">
            <!-- Compact Surgical Card -->
            <div
              class="relative h-full p-5 rounded-2xl bg-surface-900/10 border border-white/3 hover:border-primary-500/20 transition-all duration-500 overflow-hidden backdrop-blur-3xl"
            >
              <!-- Animated Glow -->
              <div
                class="absolute -top-16 -right-16 w-32 h-32 bg-primary-500/5 blur-[60px] group-hover:bg-primary-500/10 transition-colors duration-500"
              />

              <div class="flex flex-col gap-4 relative z-10">
                <!-- Header -->
                <div class="flex justify-between items-start">
                  <div
                    class="w-10 h-10 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center group-hover:scale-105 group-hover:border-primary-500/20 transition-all duration-500"
                  >
                    <i
                      :class="[
                        hub.icon,
                        'text-lg text-primary-500/40 group-hover:text-primary-500 transition-colors duration-500',
                      ]"
                    />
                  </div>
                  <div
                    class="w-1 h-1 rounded-full bg-primary-500 animate-pulse"
                  />
                </div>

                <!-- Content -->
                <div class="space-y-2">
                  <h4
                    class="text-xl font-black text-white italic tracking-tighter leading-tight group-hover:text-primary-500 transition-colors duration-500"
                  >
                    {{ hub.name }}
                  </h4>
                  <span
                    class="text-[9px] font-bold text-surface-500 uppercase tracking-widest block"
                    >{{ hub.focus }}</span
                  >
                </div>

                <!-- Action -->
                <div class="pt-3 border-t border-white/3">
                  <NuxtLink
                    to="/contact"
                    class="flex items-center justify-between text-[8px] font-black text-surface-400 uppercase tracking-[0.2em] group-hover:text-primary-500 transition-colors duration-500"
                  >
                    Details
                    <i
                      class="pi pi-arrow-right text-[8px] transform group-hover:translate-x-0.5 transition-transform duration-500"
                    />
                  </NuxtLink>
                </div>
              </div>

              <!-- Index -->
              <div
                class="absolute bottom-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"
              >
                <span class="text-2xl font-black text-surface-500 italic"
                  >0{{ careerHubs.indexOf(hub) + 1 }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-32 bg-surface-950 relative border-t border-white/5">
      <div
        class="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center space-y-12"
      >
        <h2
          class="text-5xl md:text-7xl font-black text-white tracking-tighter italic leading-none"
        >
          Inject Your Talent <br />
          <span class="text-primary-500 not-italic font-light"
            >Into the Future.</span
          >
        </h2>
        <NuxtLink
          to="/contact"
          class="inline-flex px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-500 transition-all shadow-2xl"
        >
          Submit Executive Dossier
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
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
</style>
