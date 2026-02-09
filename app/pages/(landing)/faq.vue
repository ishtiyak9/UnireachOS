<template>
  <NuxtLayout name="landing">
    <!-- FAQ Page Hero -->
    <section class="relative py-24 overflow-hidden bg-surface-950">
      <!-- Background Effects -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.04)_1px,transparent_1px)] bg-size-[60px_60px] opacity-30"
        />
        <div
          class="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full animate-pulse-slow"
        />
      </div>

      <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-xl mb-6"
        >
          <i class="pi pi-question-circle text-primary-400 text-xs"/>
          <span
            class="text-[9px] font-black uppercase tracking-[0.5em] text-primary-400"
            >Help Center</span
          >
        </div>

        <!-- Title -->
        <h1
          class="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6"
        >
          <span class="block text-white">Frequently Asked</span>
          <span
            class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic"
            >Questions</span
          >
        </h1>

        <!-- Description -->
        <p class="text-base md:text-lg text-surface-300 max-w-2xl mx-auto mb-8">
          Find answers to common questions about studying, working, and doing
          business in Europe. Can't find what you're looking for? Contact our
          expert counselors.
        </p>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div
            class="p-4 bg-surface-900/50 backdrop-blur-xl border border-white/10 rounded-xl"
          >
            <div class="text-2xl font-black text-primary-400 mb-1">20+</div>
            <div class="text-xs text-surface-400 uppercase tracking-wider">
              Questions
            </div>
          </div>
          <div
            class="p-4 bg-surface-900/50 backdrop-blur-xl border border-white/10 rounded-xl"
          >
            <div class="text-2xl font-black text-primary-400 mb-1">4</div>
            <div class="text-xs text-surface-400 uppercase tracking-wider">
              Categories
            </div>
          </div>
          <div
            class="p-4 bg-surface-900/50 backdrop-blur-xl border border-white/10 rounded-xl"
          >
            <div class="text-2xl font-black text-primary-400 mb-1">24/7</div>
            <div class="text-xs text-surface-400 uppercase tracking-wider">
              Support
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Component -->
    <LandingFAQ />
  </NuxtLayout>
</template>

<script setup lang="ts">
// SEO Meta Tags
useHead({
  title: "FAQ - Frequently Asked Questions | Unireach Consultancy",
  meta: [
    {
      name: "description",
      content:
        "Get answers to common questions about studying, working, and doing business in Europe. Learn about EU Blue Card, student visas, Golden Visa, scholarships, work permits, and more.",
    },
    {
      name: "keywords",
      content:
        "EU study FAQ, work visa Europe, EU Blue Card, student visa questions, Golden Visa, study abroad costs, work in Europe, business migration EU, Schengen visa, scholarship Europe",
    },
    // Open Graph
    {
      property: "og:title",
      content: "FAQ - Study, Work & Business in Europe | Unireach",
    },
    {
      property: "og:description",
      content:
        "Comprehensive FAQ about European migration for study, work, and business. Expert answers to visa, costs, requirements, and more.",
    },
    {
      property: "og:type",
      content: "website",
    },
  ],
});

definePageMeta({
  layout: false,
});
</script>

<style scoped>
.bg-size-\[60px_60px\] {
  background-size: 60px 60px;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
