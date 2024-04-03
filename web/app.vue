<script setup lang="ts">
import '@fontsource/inter/latin.css'
import '@fontsource/roboto/latin.css'
</script>

<template>
  <Html lang="en" />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
  body {
    background-color: #010101;
  }
</style>
