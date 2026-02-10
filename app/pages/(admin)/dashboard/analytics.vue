<template>
  <div>
    <h1>Analytics Dashboard</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

// Page title
useHead({
  title: "Analytics Dashboard | Unireach OS",
});
</script>

<style lang="scss" scoped></style>
