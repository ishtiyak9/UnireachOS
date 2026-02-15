<script setup lang="ts">
import ServiceDetail from "@/components/service/Detail.vue";

const route = useRoute();
const slug = computed(() => route.params.slug as string);

definePageMeta({
  layout: "partner",
  middleware: ["auth"],
});
</script>

<template>
  <ServiceDetail :slug="slug" />
</template>
