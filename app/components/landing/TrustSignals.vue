<template>
  <section class="relative py-12 md:py-20 overflow-hidden bg-surface-950">
    <!-- Background Effects -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div
        class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--p-primary-500-rgb),0.05)_0%,transparent_70%)]"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <!-- 2. Global University Network (Marquee) -->
      <div class="mb-20 pt-10">
        <div class="text-center mb-8">
          <p
            class="text-xs font-bold text-surface-400 uppercase tracking-widest mb-2"
          >
            Global Entrace
          </p>
          <h3 class="text-2xl md:text-3xl font-black text-white">
            Access to
            <span class="text-primary-400">World-Class</span> Institutions
          </h3>
        </div>

        <!-- Marquee Container -->
        <div
          class="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <div
            class="flex gap-8 md:gap-16 py-4 animate-scroll whitespace-nowrap w-max"
          >
            <!-- Doubled purely for seamless loop -->
            <div
              v-for="i in 2"
              :key="i"
              class="flex gap-8 md:gap-16 items-center"
            >
              <div
                v-for="uni in universities"
                :key="uni.name"
                class="flex flex-col items-center justify-center gap-3 opacity-70 hover:opacity-100 transition-all duration-300 group cursor-default"
              >
                <!-- Logo Image -->
                <div
                  class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary-500/30 group-hover:shadow-[0_0_20px_rgba(var(--p-primary-500-rgb),0.2)] transition-all overflow-hidden p-2 relative"
                >
                  <img
                    v-show="!uni.failed"
                    :src="uni.logo"
                    :alt="uni.name"
                    class="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    @error="uni.failed = true"
                  />

                  <!-- Fallback Styling -->
                  <div
                    v-if="uni.failed"
                    class="absolute inset-0 flex items-center justify-center bg-surface-900"
                  >
                    <span
                      class="text-xs md:text-sm font-black text-primary-500 tracking-tighter"
                      >{{ uni.initials }}</span
                    >
                  </div>
                </div>
                <!-- Name -->
                <span
                  class="text-[10px] md:text-xs font-bold text-surface-400 group-hover:text-white uppercase tracking-wider"
                  >{{ uni.name }}</span
                >
                <span
                  class="text-[9px] text-primary-500 font-bold -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >{{ uni.country }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Accreditations & Standards -->
      <div
        class="grid md:grid-cols-2 gap-8 items-center bg-surface-900/30 rounded-3xl p-8 border border-white/5"
      >
        <div>
          <h4 class="text-xl font-black text-white mb-4">
            Committed to
            <span
              class="bg-linear-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
              >Excellence</span
            >
          </h4>
          <p class="text-sm text-surface-300 leading-relaxed max-w-md mb-6">
            We adhere to the highest international standards of education
            counseling. Our team is trained and certified to provide you with
            ethical, accurate, and professional guidance.
          </p>

          <div class="flex flex-wrap gap-4">
            <div
              v-for="badge in certifications"
              :key="badge.name"
              class="flex items-center gap-3 px-4 py-2 rounded-lg bg-surface-950/50 border border-white/10 hover:border-primary-500/30 transition-colors"
            >
              <i :class="[badge.icon, 'text-primary-500']"></i>
              <div>
                <div
                  class="text-[10px] text-surface-500 uppercase tracking-wider font-bold"
                >
                  Compliant With
                </div>
                <div class="text-xs font-bold text-white">{{ badge.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Representation of Trust -->
        <div class="relative">
          <div class="grid grid-cols-2 gap-4">
            <div
              class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <i class="pi pi-shield-check text-3xl text-primary-400 mb-3"></i>
              <h5 class="text-sm font-black text-white mb-1">
                100% Transparency
              </h5>
              <p class="text-xs text-surface-400">
                No hidden fees or misleading information. Your trust is our
                priority.
              </p>
            </div>
            <div
              class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors mt-8"
            >
              <i class="pi pi-users text-3xl text-primary-400 mb-3"></i>
              <h5 class="text-sm font-black text-white mb-1">Expert Team</h5>
              <p class="text-xs text-surface-400">
                Guided by certified professionals with years of industry
                experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// 1. Stats - Removed as they are redundant with Hero section

// 2. Verified University Network
// Logos stored in public/images/partners/
const universities = ref([
  // Austria
  {
    name: "Modul University",
    logo: "/images/partners/modul.png",
    country: "Austria",
    initials: "MU",
    failed: false,
  },
  // Belgium
  {
    name: "University of Antwerp",
    logo: "/images/partners/antwerp.png",
    country: "Belgium",
    initials: "UA",
    failed: false,
  },
  // Denmark
  {
    name: "University of Southern Denmark",
    logo: "/images/partners/sdu.png",
    country: "Denmark",
    initials: "SDU",
    failed: false,
  },
  // Finland
  {
    name: "Tampere University",
    logo: "/images/partners/tampere.png",
    country: "Finland",
    initials: "TAU",
    failed: false,
  },
  {
    name: "University of Eastern Finland",
    logo: "/images/partners/uef.png",
    country: "Finland",
    initials: "UEF",
    failed: false,
  },
  // France
  {
    name: "NEOMA Business School",
    logo: "/images/partners/neoma.png",
    country: "France",
    initials: "NEOMA",
    failed: false,
  },
  {
    name: "SKEMA Business School",
    logo: "/images/partners/skema.png",
    country: "France",
    initials: "SKEMA",
    failed: false,
  },
  {
    name: "INSEEC Business School",
    logo: "/images/partners/inseec.png",
    country: "France",
    initials: "INSEEC",
    failed: false,
  },
  {
    name: "Montpellier Business School",
    logo: "/images/partners/montpellier.png",
    country: "France",
    initials: "MBS",
    failed: false,
  },
  // Germany
  {
    name: "Constructor University",
    logo: "/images/partners/constructor.png",
    country: "Germany",
    initials: "CU",
    failed: false,
  },
  {
    name: "Hamburg University of Technology",
    logo: "/images/partners/tuhh.png",
    country: "Germany",
    initials: "TUHH",
    failed: false,
  },
  {
    name: "SRH University",
    logo: "/images/partners/srh.png",
    country: "Germany",
    initials: "SRH",
    failed: false,
  },
  {
    name: "GISMA",
    logo: "/images/partners/gisma.png",
    country: "Germany",
    initials: "GISMA",
    failed: false,
  },
  // Hungary
  {
    name: "University of Debrecen",
    logo: "/images/partners/debrecen.png",
    country: "Hungary",
    initials: "UD",
    failed: false,
  },
  {
    name: "University of Pécs",
    logo: "/images/partners/pecs.png",
    country: "Hungary",
    initials: "UP",
    failed: false,
  },
  // Italy
  {
    name: "LUISS Guido Carli",
    logo: "/images/partners/luiss.png",
    country: "Italy",
    initials: "LUISS",
    failed: false,
  },
  {
    name: "Polimi Graduate School",
    logo: "/images/partners/polimi.png",
    country: "Italy",
    initials: "POLIMI",
    failed: false,
  },
  // Lithuania
  {
    name: "Vilnius University",
    logo: "/images/partners/vilnius.png",
    country: "Lithuania",
    initials: "VU",
    failed: false,
  },
  // Netherlands
  {
    name: "Erasmus University",
    logo: "/images/partners/erasmus.png",
    country: "Netherlands",
    initials: "EUR",
    failed: false,
  },
  {
    name: "University of Twente",
    logo: "/images/partners/twente.png",
    country: "Netherlands",
    initials: "UT",
    failed: false,
  },
  // Australia
  {
    name: "UNSW Sydney",
    logo: "/images/partners/unsw.png",
    country: "Australia",
    initials: "UNSW",
    failed: false,
  },
  {
    name: "University of Newcastle",
    logo: "/images/partners/newcastle.png",
    country: "Australia",
    initials: "UON",
    failed: false,
  },
  {
    name: "University of Wollongong",
    logo: "/images/partners/wollongong.png",
    country: "Australia",
    initials: "UOW",
    failed: false,
  },
]);

// 3. Certifications / Compliance (Generic but professional)
const certifications = [
  { name: "ICEF Standards", icon: "pi pi-check-circle" },
  { name: "British Council", icon: "pi pi-verified" },
  { name: "PIER Certified", icon: "pi pi-shield" },
];
</script>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}

/* Pause on hover for easier viewing */
.animate-scroll:hover {
  animation-play-state: paused;
}
</style>
