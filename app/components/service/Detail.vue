<script setup lang="ts">
const props = defineProps<{
  slug: string;
}>();

const {
  data: service,
  pending,
  error,
} = await useFetch(`/api/services/${props.slug}`);

const pageTitle = computed(() => service.value?.title || "Service Details");

// Set page meta based on service title
useHead({
  title: pageTitle,
});
</script>

<template>
  <div class="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
    <div v-if="pending" class="flex justify-center p-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="text-center p-12 bg-red-500/10 rounded-xl border border-red-500/20"
    >
      <div class="text-red-400 font-bold text-lg mb-2">Service Not Found</div>
      <p class="text-surface-400">
        {{ error.statusMessage || "Unable to load service details." }}
      </p>
      <NuxtLink
        :to="
          useRoute().path.startsWith('/partner')
            ? '/partner-portal'
            : '/applicant-portal'
        "
        class="mt-4 inline-block text-primary-400 hover:text-primary-300 transition-colors underline"
      >
        Return to Dashboard
      </NuxtLink>
    </div>

    <div
      v-else-if="service"
      class="bg-surface-800/50 backdrop-blur-xl border border-surface-700/50 rounded-2xl overflow-hidden shadow-2xl"
    >
      <!-- Hero Header -->
      <div
        class="relative bg-gradient-to-br from-surface-800 to-surface-900 border-b border-surface-700/50 p-8 md:p-12 overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i
            :class="[
              service.icon || 'pi pi-star',
              'text-[12rem] text-primary-500 transform rotate-12',
            ]"
          ></i>
        </div>

        <div class="relative z-10 max-w-3xl">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Details
          </div>
          <h1
            class="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            {{ service.title }}
          </h1>
          <p
            class="text-xl text-surface-400 font-light leading-relaxed max-w-2xl"
          >
            {{ service.description }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-8 md:p-12">
        <div
          class="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-surface-300 prose-a:text-primary-400 hover:prose-a:text-primary-300 prose-strong:text-white"
        >
          <div v-html="service.content"></div>
        </div>

        <!-- Call to Action / Support (Optional) -->
        <div
          class="mt-12 pt-8 border-t border-surface-700/50 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div class="text-surface-400">
            <h3 class="text-white font-bold mb-1">Need specific assistance?</h3>
            <p class="text-sm">
              Contact support for personalized help with this service.
            </p>
          </div>
          <button
            class="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-500/20 flex items-center gap-2"
          >
            <i class="pi pi-envelope"></i>
            <span>Contact Support</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
