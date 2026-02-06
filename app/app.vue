<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 font-sans">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <BaseToast />
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup>
// Root app component
</script>

<style>
body {
  margin: 0;
}
</style>
