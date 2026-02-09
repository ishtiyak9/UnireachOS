<script setup lang="ts">
const features = [
  {
    title: "Instant Verification",
    desc: "AI-driven document checking for global academic compliance.",
    icon: "lucide:scan-face",
  },
  {
    title: "Secure Data",
    desc: "ISO 27001 compliant cloud infrastructure for student privacy.",
    icon: "lucide:lock",
  },
  {
    title: "Batch Processing",
    desc: "Handle 1000s of applications concurrently with zero lag.",
    icon: "lucide:layers",
  },
  {
    title: "Real-time Sync",
    desc: "Live updates between students, counselors, and institutions.",
    icon: "lucide:refresh-cw",
  },
];
</script>

<template>
  <section
    class="py-12 md:py-16 lg:py-24 bg-surface-50 dark:bg-surface-900/50 overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 md:px-6">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center"
      >
        <div class="space-y-6 md:space-y-8 animate-fade-in">
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/5 border border-primary-500/20 text-primary-400 text-[9px] font-black uppercase tracking-[0.2em]"
          >
            Surgical Automation
          </div>
          <h2
            class="text-3xl md:text-5xl font-black text-surface-900 dark:text-surface-0 tracking-tighter italic leading-none"
          >
            Advanced automation <br />
            <span
              class="italic font-light text-primary-600 dark:text-primary-500"
              >for your recruitment flow.</span
            >
          </h2>
          <p
            class="text-sm md:text-lg text-surface-600 dark:text-surface-400 leading-relaxed max-w-xl font-medium"
          >
            Streamline your student applications from initial enquiry to final
            enrollment with our state-of-the-art CRM technology.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="space-y-4 group"
            >
              <div
                class="p-4 w-fit rounded-2xl bg-white dark:bg-surface-900 shadow-sm border border-surface-200 dark:border-surface-800 transition-all group-hover:border-primary-500 group-hover:shadow-[0_0_20px_rgba(var(--p-primary-500-rgb),0.2)]"
              >
                <Icon
                  :name="feature.icon"
                  class="w-6 h-6 text-primary-600 dark:text-primary-500"
                />
              </div>
              <div class="space-y-1">
                <h3
                  class="font-black text-surface-900 dark:text-surface-0 italic tracking-tight"
                >
                  {{ feature.title }}
                </h3>
                <p
                  class="text-[11px] text-surface-500 dark:text-surface-400 font-bold uppercase tracking-widest leading-relaxed"
                >
                  {{ feature.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative group">
          <!-- Visual Representation (Premium Glass) -->
          <div
            class="absolute -inset-4 bg-linear-to-tr from-primary-500/10 to-transparent rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50"
          ></div>
          <div
            class="relative bg-white/40 dark:bg-surface-950/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 dark:border-surface-800/50 p-12 shadow-3xl overflow-hidden min-h-[450px] flex flex-col justify-center items-center text-center"
          >
            <div class="space-y-6 animate-in fade-in zoom-in duration-1000">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full"
                ></div>
                <div
                  class="p-8 rounded-3xl bg-surface-900 border border-primary-500/20 relative z-10"
                >
                  <i class="pi pi-th-large text-primary-500 text-5xl"></i>
                </div>
              </div>
              <div class="space-y-2">
                <h4
                  class="text-3xl font-black text-surface-900 dark:text-surface-0 italic tracking-tighter"
                >
                  Unified Experience
                </h4>
                <p
                  class="text-xs text-primary-600 dark:text-primary-400 font-black uppercase tracking-[0.2em]"
                >
                  Institutional-Grade Control
                </p>
              </div>
            </div>

            <!-- Floating Element Decor (Slicker) -->
            <div
              class="absolute top-12 right-12 p-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-500/20 -rotate-12 translate-x-4 animate-float"
            >
              <i class="pi pi-bolt text-primary-500 text-xl"></i>
            </div>
            <div
              class="absolute bottom-24 left-12 p-4 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary-500/20 rotate-6 -translate-x-4 animate-pulse"
            >
              <i class="pi pi-shield text-primary-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
