import { contactInfo } from "@/config/contact";

definePageMeta({
  layout: false,
});

const openWhatsApp = (serviceName: string) => {
  const phone = contactInfo.whatsapp.number.replace('+', '');
  const text = encodeURIComponent(
    `Greetings Unireach, I would like to discuss the '${serviceName}' strategic module.`
  );
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
};

const categories = [
  {
    title: "Admissions Architecture",
    modules: [
      {
        name: "University Selection Protocol",
        desc: "AI-driven matching aligned with your career trajectory.",
        icon: "pi pi-sitemap",
      },
      {
        name: "Narrative Engineering (SOP)",
        desc: "Native editors craft a compelling outcome-focused story.",
        icon: "pi pi-pencil",
      },
      {
        name: "Profile Optimization (CV)",
        desc: "Restructuring history to meet EuroPass gold standards.",
        icon: "pi pi-id-card",
      },
      {
        name: "Recommendation Strategy",
        desc: "Drafting referee endorsements to reinforce core themes.",
        icon: "pi pi-users",
      },
      {
        name: "Research Proposal Leasing",
        desc: "Structuring PhD/Research Master's proposals for funding.",
        icon: "pi pi-book",
      },
      {
        name: "Publication Assistance",
        desc: "Guidance on getting academic papers published pre-arrival.",
        icon: "pi pi-bookmark",
      },
    ],
  },
  {
    title: "Linguistic Strategy",
    modules: [
      {
        name: "IELTS/TOEFL Architecture",
        desc: "Structure & strategy coaching for 8.0+ / 110+ target scores.",
        icon: "pi pi-globe",
      },
      {
        name: "Duolingo Fast-Track",
        desc: "Rapid deployment protocols for universities accepting DET.",
        icon: "pi pi-bolt",
      },
      {
        name: "Verbal Confidence (Interview)",
        desc: "Specialized phonetics & fluency coaching for admission interviews.",
        icon: "pi pi-microphone",
      },
      {
        name: "EU Language Foundation",
        desc: "A1/A2 crash courses (German/French) for social integration.",
        icon: "pi pi-comments",
      },
    ],
  },
  {
    title: "Financial Engineering",
    modules: [
      {
        name: "Scholarship Negotiation",
        desc: "Drafting appeal letters to maximize tuition waivers.",
        icon: "pi pi-percentage",
      },
      {
        name: "Blocked Account Setup",
        desc: "Instant confirmation protocols with banking partners.",
        icon: "pi pi-lock",
      },
      {
        name: "Education Loan Support",
        desc: "Coordination with partner banks for seamless sanction.",
        icon: "pi pi-wallet",
      },
      {
        name: "Financial Proof Audit",
        desc: "Ensuring all bank statements meet strict embassy formats.",
        icon: "pi pi-search",
      },
    ],
  },
  {
    title: "Sovereign Compliance (Visa)",
    modules: [
      {
        name: "Visa Audit & Filing",
        desc: "Forensic document analysis to eliminate rejection risks.",
        icon: "pi pi-file-check",
      },
      {
        name: "Interview Simulation",
        desc: "Mock sessions with former officers to perfect responses.",
        icon: "pi pi-video",
      },
      {
        name: "Insurance Selection",
        desc: "Optimal coverage ensuring full embassy compliance.",
        icon: "pi pi-shield",
      },
      {
        name: "Appeal Representation",
        desc: "Legal drafting for re-applying after a prior rejection.",
        icon: "pi pi-replay",
      },
    ],
  },
  {
    title: "Arrival & Career Integration",
    modules: [
      {
        name: "Housing Acquisition",
        desc: "Guaranteed accommodation offers before flight departure.",
        icon: "pi pi-home",
      },
      {
        name: "City Registration (Anmeldung)",
        desc: "Pre-booked appointments for residence permits.",
        icon: "pi pi-building",
      },
      {
        name: "Part-Time Strategy",
        desc: "CV tailoring for local student jobs & Werkstudent roles.",
        icon: "pi pi-briefcase",
      },
      {
        name: "Airport Executive Transfer",
        desc: "Private chauffeured transport to your residence.",
        icon: "pi pi-car",
      },
      {
        name: "Alumni Network Access",
        desc: "Entry to our exclusive professional mentorship circles.",
        icon: "pi pi-share-alt",
      },
    ],
  },
];
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Compact Dark Hero -->
    <section
      class="relative pt-24 pb-12 bg-surface-950 overflow-hidden border-b border-surface-800/50"
    >
      <!-- Subtle Background -->
      <div class="absolute inset-0 pointer-events-none opacity-40">
        <div
          class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/20 blur-[100px] rounded-full"
        ></div>
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"
        ></div>
      </div>

      <div
        class="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-end justify-between gap-6"
      >
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 mb-4">
            <span
              class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
            ></span>
            <span
              class="text-[10px] uppercase font-bold tracking-[0.2em] text-primary-400"
              >Capability Ecosystem</span
            >
          </div>
          <h1
            class="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-2"
          >
            Strategic <span class="text-primary-500">Modules.</span>
          </h1>
          <p class="text-sm text-surface-400 max-w-lg leading-relaxed">
            Select specific capabilities to accelerate your journey. Executed
            with surgical precision.
          </p>
        </div>

        <!-- Quick CTA -->
        <div class="flex-shrink-0">
          <button
            @click="openWhatsApp('General Inquiry')"
            class="group flex items-center gap-3 px-5 py-2.5 rounded-lg bg-surface-800/50 hover:bg-primary-600 text-surface-300 hover:text-white border border-surface-700 hover:border-primary-500 transition-all duration-300"
          >
            <i class="pi pi-whatsapp"></i>
            <span class="text-xs font-bold uppercase tracking-wider"
              >Fast-Track Discussion</span
            >
          </button>
        </div>
      </div>
    </section>

    <!-- Dense Grid Layout -->
    <section class="bg-surface-950 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12">
        <div
          v-for="(category, idx) in categories"
          :key="category.title"
          class="group/cat"
        >
          <!-- Compact Category Header -->
          <div
            class="flex items-center gap-4 mb-6 border-b border-surface-800/50 pb-2"
          >
            <span
              class="text-primary-500 font-mono text-xs font-bold px-2 py-1 rounded bg-primary-500/10"
              >0{{ idx + 1 }}</span
            >
            <h2 class="text-lg font-bold text-white tracking-wide">
              {{ category.title }}
            </h2>
            <div class="h-px flex-1 bg-surface-800/50"></div>
          </div>

          <!-- Ultra-Compact Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="mod in category.modules"
              :key="mod.name"
              class="relative group cursor-pointer"
              @click="openWhatsApp(mod.name)"
            >
              <div
                class="absolute -inset-px bg-gradient-to-br from-primary-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
              <div
                class="relative h-full p-4 rounded-xl bg-surface-900 border border-surface-800 hover:border-primary-500/30 hover:bg-surface-800/50 transition-all duration-300 flex flex-col"
              >
                <div class="flex justify-between items-start mb-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-surface-800 border border-surface-700 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300"
                  >
                    <i
                      :class="[
                        mod.icon,
                        'text-sm text-surface-400 group-hover:text-white',
                      ]"
                    ></i>
                  </div>
                  <i
                    class="pi pi-arrow-up-right text-[10px] text-surface-600 group-hover:text-primary-400 transition-colors"
                  ></i>
                </div>

                <h3
                  class="text-sm font-bold text-surface-100 mb-1 leading-tight group-hover:text-primary-400 transition-colors"
                >
                  {{ mod.name }}
                </h3>
                <p
                  class="text-[11px] text-surface-500 leading-relaxed line-clamp-2 md:line-clamp-none group-hover:text-surface-400 transition-colors"
                >
                  {{ mod.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Minimal Footnote CTA -->
    <section
      class="py-12 bg-surface-900 border-t border-surface-800 text-center"
    >
      <p class="text-surface-400 text-xs mb-4">
        "We do not offer standard packages. We offer precision."
      </p>
      <button
        @click="openWhatsApp('Custom Strategy')"
        class="text-xs font-bold text-primary-400 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        <span>Request Bespoke Solution</span>
        <i class="pi pi-arrow-right text-[10px]"></i>
      </button>
    </section>
  </NuxtLayout>
</template>
