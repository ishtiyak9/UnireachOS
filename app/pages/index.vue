<template>
  <NuxtLayout name="landing">
    <LandingHero />
    <LandingWhyUnireach />
    <LandingJourney />
    <LandingProcess />
    <LandingDestinations />
    <LandingBusinessImmigration />
    <LandingServices />
    <!-- These sections are already styled for enterprise standards -->
    <LandingTestimonials />
    <LandingCTA />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false, // We specify the layout inside the template for explicit control in this demo
});
</script>
