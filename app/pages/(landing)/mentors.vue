<script setup lang="ts">
definePageMeta({
  layout: false,
});

const leadership = [
  {
    name: "ISHTIYAK RAHMAN",
    role: "Founder",
    university: "KTH Royal Institute",
    credential: "MSc Engineering",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    bio: "Unireach founder. Built the 'Velocity-First' application system to eliminate delays for Asian applicants. Focuses on strategic partnerships and global expansion.",
    socials: { linkedin: "#" },
  },
  {
    name: "LAILA ARZUMAN",
    role: "Co-Founder",
    university: "London School of Economics",
    credential: "MSc Management",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Ex-BCG consultant ensuring every application process is seamless. Expert in operational efficiency and client success frameworks.",
    socials: { linkedin: "#" },
  },
];

const europeSpecialists = [
  {
    name: "Dr. Elena Weber",
    role: "Head of DACH Region",
    university: "Technical University of Munich",
    credential: "PhD in Data Science",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    bio: "Former admissions committee member at TUM. Specialized in scholarship negotiation and PhD placements in Germany, Austria, and Switzerland.",
    socials: { linkedin: "#" },
  },
  {
    name: "Kwame Osei",
    role: "Lead Mentor (France)",
    university: "HEC Paris",
    credential: "MBA",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame",
    bio: "Successfully guided 500+ students to top French business schools. Expert in visa compliance and housing solutions in Paris.",
    socials: { linkedin: "#" },
  },
  {
    name: "Sofia Rossi",
    role: "Senior Consultant (Italy)",
    university: "Politecnico di Milano",
    credential: "MSc Architecture",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    bio: "Architect turned education consultant. Helps creative portfolios stand out to Italian design institutes and technical universities.",
    socials: { linkedin: "#" },
  },
];

const technicalAdvisors = [
  {
    name: "Yuki Tanaka",
    role: "Engineering Advisor",
    university: "RWTH Aachen",
    credential: "MSc Mechanical Eng.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    bio: "Specializes in placing students in highly competitive German technical programs. Expert in TU9 university requirements.",
    socials: { linkedin: "#" },
  },
  {
    name: "Dr. Ahmed Hassan",
    role: "Medical & BioTech Advisor",
    university: "Charité - Universitätsmedizin Berlin",
    credential: "MD/PhD",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    bio: "Guiding medical professionals and researchers to top European institutions. Expert in licensing and research positions.",
    socials: { linkedin: "#" },
  },
  {
    name: "Priya Sharma",
    role: "Computer Science Mentor",
    university: "ETH Zurich",
    credential: "MSc Computer Science",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    bio: "Helps CS students navigate the complex selection processes of elite Swiss and German tech universities.",
    socials: { linkedin: "#" },
  },
];
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Hero Section -->
    <section
      class="relative pt-32 pb-20 bg-surface-50 dark:bg-surface-950 overflow-hidden"
    >
      <!-- Abstract Background -->
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full"
        />
        <div
          class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full"
        />
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"
        />
      </div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 mb-6"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"
          />
          <span
            class="text-[10px] uppercase font-black tracking-widest text-surface-500"
            >World-Class Guidance</span
          >
        </div>
        <h1
          class="text-4xl md:text-6xl font-black text-surface-900 dark:text-surface-0 mb-6 tracking-tight"
        >
          Meet the
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600"
            >Architects</span
          >
          <br >
          of Your Future.
        </h1>
        <p
          class="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed"
        >
          We aren't just consultants. We are alumni from the world's top
          universities. We've walked the path you aspire to take, and we are
          here to guide your every step.
        </p>
      </div>
    </section>

    <!-- Leadership Section -->
    <section
      class="py-20 bg-white dark:bg-surface-900 border-t border-surface-100 dark:border-surface-800"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <span
              class="text-[10px] font-black text-primary-500 uppercase tracking-widest"
              >Leadership</span
            >
            <h2
              class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2"
            >
              The Visionaries
            </h2>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="leader in leadership"
            :key="leader.name"
            class="group relative flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-surface-50 dark:bg-surface-950 border border-surface-100 dark:border-surface-800 hover:border-primary-500/30 transition-all duration-300"
          >
            <div
              class="relative w-full md:w-48 aspect-square rounded-2xl overflow-hidden flex-shrink-0"
            >
              <img
                :src="leader.image"
                :alt="leader.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              >
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <div class="mb-4">
                <h3
                  class="text-2xl font-bold text-surface-900 dark:text-surface-0"
                >
                  {{ leader.name }}
                </h3>
                <p
                  class="text-primary-600 dark:text-primary-400 font-medium text-sm uppercase tracking-wide"
                >
                  {{ leader.role }}
                </p>
              </div>
              <div class="mb-4">
                <div
                  class="inline-block px-3 py-1 rounded-lg bg-surface-200 dark:bg-surface-800 text-xs font-bold text-surface-700 dark:text-surface-300"
                >
                  {{ leader.university }} • {{ leader.credential }}
                </div>
              </div>
              <p
                class="text-sm text-surface-600 dark:text-surface-400 leading-relaxed"
              >
                {{ leader.bio }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Regional Specialists -->
    <section
      class="py-20 bg-surface-50 dark:bg-surface-950 border-t border-surface-100 dark:border-surface-800"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="mb-12">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-widest"
            >Regional Excellence</span
          >
          <h2
            class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2"
          >
            Europe Specialists
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="mentor in europeSpecialists"
            :key="mentor.name"
            class="group relative bg-white dark:bg-surface-900 p-6 rounded-3xl border border-surface-100 dark:border-surface-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-100 dark:border-primary-900"
              >
                <img
                  :src="mentor.image"
                  :alt="mentor.name"
                  class="w-full h-full object-cover"
                >
              </div>
              <div>
                <h3
                  class="text-lg font-bold text-surface-900 dark:text-surface-0"
                >
                  {{ mentor.name }}
                </h3>
                <p
                  class="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wide"
                >
                  {{ mentor.role }}
                </p>
              </div>
            </div>
            <div class="mb-4 min-h-[40px]">
              <p
                class="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1"
              >
                Alma Mater
              </p>
              <p
                class="text-sm font-bold text-surface-800 dark:text-surface-200"
              >
                {{ mentor.university }}
              </p>
              <p class="text-xs text-surface-500">{{ mentor.credential }}</p>
            </div>
            <p
              class="text-sm text-surface-600 dark:text-surface-400 leading-relaxed"
            >
              {{ mentor.bio }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Advisors -->
    <section
      class="py-20 bg-white dark:bg-surface-900 border-t border-surface-100 dark:border-surface-800"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="mb-12">
          <span
            class="text-[10px] font-black text-primary-500 uppercase tracking-widest"
            >Specialized Guidance</span
          >
          <h2
            class="text-3xl font-bold text-surface-900 dark:text-surface-0 mt-2"
          >
            STEM & Technical Advisors
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="mentor in technicalAdvisors"
            :key="mentor.name"
            class="group relative bg-surface-50 dark:bg-surface-950 p-6 rounded-3xl border border-surface-100 dark:border-surface-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-100 dark:border-primary-900"
              >
                <img
                  :src="mentor.image"
                  :alt="mentor.name"
                  class="w-full h-full object-cover"
                >
              </div>
              <div>
                <h3
                  class="text-lg font-bold text-surface-900 dark:text-surface-0"
                >
                  {{ mentor.name }}
                </h3>
                <p
                  class="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wide"
                >
                  {{ mentor.role }}
                </p>
              </div>
            </div>
            <div class="mb-4 min-h-[40px]">
              <p
                class="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1"
              >
                Alma Mater
              </p>
              <p
                class="text-sm font-bold text-surface-800 dark:text-surface-200"
              >
                {{ mentor.university }}
              </p>
              <p class="text-xs text-surface-500">{{ mentor.credential }}</p>
            </div>
            <p
              class="text-sm text-surface-600 dark:text-surface-400 leading-relaxed"
            >
              {{ mentor.bio }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
  </NuxtLayout>
</template>
