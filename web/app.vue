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
    height: 100%
  }

  html {
    height: 100%;
 }

 .scrollbar-custom::-webkit-scrollbar {
    -webkit-appearance: none !important;
    width: 8px !important;
  }

  .scrollbar-custom::-webkit-scrollbar-thumb {
    border-radius: 20px !important;
    background-color: #202327cc !important;
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5) !important;
  }
</style>
