<script setup lang="ts">
import { ref } from "vue";

const activeTab = ref("admission");

const admissionDocs = [
  {
    title: "Academic Transcripts",
    description:
      "SSC/O-Level, HSC/A-Level & Bachelor's marksheet & certificate",
    icon: "pi pi-book",
  },
  {
    title: "English Proficiency",
    description: "IELTS, TOELF, PTE, or Duolingo scorecard",
    icon: "pi pi-language",
  },
  {
    title: "Passport",
    description: "Valid passport with at least 6 months validity",
    icon: "pi pi-verified",
  },
  {
    title: "Letter of Recommendation",
    description: "2 academic or professional reference letters",
    icon: "pi pi-user-edit",
  },
  {
    title: "Statement of Purpose (SOP)",
    description: "Personal statement detailing study plans",
    icon: "pi pi-file-edit",
  },
  {
    title: "CV / Resume",
    description: "Updated CV with academic & work history",
    icon: "pi pi-id-card",
  },
];

const visaDocs = [
  {
    title: "Offer Letter & COE",
    description: "Unconditional Offer Letter & Confirmation of Enrollment",
    icon: "pi pi-envelope",
  },
  {
    title: "Financial Documents",
    description: "Bank Solvency Certificate & source of funds",
    icon: "pi pi-wallet",
  },
  {
    title: "Medical Examination",
    description: "Health check-up from authorized clinic",
    icon: "pi pi-heart-pulse",
  },
  {
    title: "Police Clearance",
    description: "Valid Police Clearance Certificate (PCC)",
    icon: "pi pi-shield",
  },
  {
    title: "Visa Application Form",
    description: "Completed & signed visa application form",
    icon: "pi pi-file",
  },
  {
    title: "Health Insurance",
    description: "Overseas Student Health Cover (OSHC)",
    icon: "pi pi-plus-circle",
  },
];
</script>

<template>
  <section class="py-12 md:py-16 bg-surface-950 relative overflow-hidden">
    <!-- Background Decor -->
    <div
      class="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    />

    <div class="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Section Header & Tabs Combined -->
      <div
        class="flex flex-col md:flex-row items-center justify-between gap-8 mb-10"
      >
        <div class="text-center md:text-left space-y-2">
          <span
            class="text-[9px] font-black text-primary-500 uppercase tracking-[0.3em]"
            >Checklist</span
          >
          <h2
            class="text-2xl md:text-3xl font-black text-white italic tracking-tight"
          >
            Essential
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"
              >Documents</span
            >
          </h2>
        </div>

        <!-- Compact Toggle -->
        <div
          class="p-1 rounded-xl bg-surface-900/80 border border-white/5 backdrop-blur-sm inline-flex relative"
        >
          <div
            class="absolute inset-y-1 w-[calc(50%-4px)] bg-primary-500 rounded-lg shadow-lg shadow-primary-500/20 transition-all duration-300 ease-out"
            :class="
              activeTab === 'admission'
                ? 'left-1'
                : 'left-[calc(50%+0px)] translate-x-0'
            "
          />
          <button
            @click="activeTab = 'admission'"
            class="relative px-6 py-2 text-[10px] font-black uppercase tracking-wider transition-colors z-10 w-32 flex items-center justify-center gap-2"
            :class="
              activeTab === 'admission'
                ? 'text-white'
                : 'text-surface-400 hover:text-white'
            "
          >
            <i class="pi pi-graduation-cap text-xs"></i>
            Admission
          </button>
          <button
            @click="activeTab = 'visa'"
            class="relative px-6 py-2 text-[10px] font-black uppercase tracking-wider transition-colors z-10 w-32 flex items-center justify-center gap-2"
            :class="
              activeTab === 'visa'
                ? 'text-white'
                : 'text-surface-400 hover:text-white'
            "
          >
            <i class="pi pi-id-card text-xs"></i>
            Visa
          </button>
        </div>
      </div>

      <!-- Compact Grid Content -->
      <div class="relative min-h-[300px]">
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in absolute inset-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div
            :key="activeTab"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="(doc, idx) in activeTab === 'admission'
                ? admissionDocs
                : visaDocs"
              :key="doc.title"
              class="group relative"
              :style="{ animationDelay: `${idx * 50}ms` }"
            >
              <div
                class="absolute -inset-0.5 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div
                class="relative h-full p-4 rounded-xl bg-surface-900/30 border border-white/5 backdrop-blur-sm hover:bg-surface-900/50 hover:border-primary-500/20 transition-all duration-300 flex items-start gap-3"
              >
                <div
                  class="w-8 h-8 rounded-lg bg-surface-800/50 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all"
                >
                  <i
                    :class="[
                      doc.icon,
                      'text-xs text-surface-400 group-hover:text-primary-400 transition-colors',
                    ]"
                  />
                </div>
                <div>
                  <h4
                    class="text-xs font-bold text-white mb-0.5 group-hover:text-primary-200 transition-colors"
                  >
                    {{ doc.title }}
                  </h4>
                  <p
                    class="text-[10px] text-surface-500 leading-relaxed font-medium"
                  >
                    {{ doc.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
