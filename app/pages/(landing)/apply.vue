<template>
  <NuxtLayout name="landing">
    <!-- Study Abroad Application Page -->
    <LandingStudyAbroadLeadForm />
  </NuxtLayout>
</template>

<script setup lang="ts">
// SEO Meta Tags for Social Media Sharing
useHead({
  title: "Apply for Study Abroad - Unireach Consultancy",
  meta: [
    {
      name: "description",
      content:
        "Start your international education journey with Unireach. Apply now for study abroad programs in USA, UK, Canada, Australia, Germany, and Malaysia. Expert guidance and 98.5% success rate.",
    },
    // Open Graph / Facebook
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: "Apply for Study Abroad - Unireach Consultancy",
    },
    {
      property: "og:description",
      content:
        "Transform your future with international education. Get expert guidance for studying abroad. 350+ partner universities worldwide. Apply now!",
    },
    {
      property: "og:image",
      content: "/og-image-apply.jpg", // You'll need to add this image
    },
    {
      property: "og:url",
      content: "https://unireachbd.com/apply",
    },
    // Twitter Card
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Apply for Study Abroad - Unireach Consultancy",
    },
    {
      name: "twitter:description",
      content:
        "Start your international education journey. Expert counseling, visa support, and scholarship guidance. Apply now!",
    },
    {
      name: "twitter:image",
      content: "/og-image-apply.jpg",
    },
    // Additional Meta
    {
      name: "keywords",
      content:
        "study abroad, international education, student visa, scholarship, USA, UK, Canada, Australia, Germany, Malaysia, university admission, Unireach",
    },
  ],
});
</script>
