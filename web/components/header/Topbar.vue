<script setup lang="ts">
const config = useAppConfig()
</script>

<template>
  <div
    class="w-full flex items-center justify-center bg-gray-800"
  >
    <div
      class="w-full max-w-screen-bazk py-4 px-[60px] flex justify-between"
    >
      <NuxtLink
        to="/"
      >
        <IconLogoWhite
          class="h-8"
        />
      </NuxtLink>

      <div
        v-if="config.routes"
        class="flex items-center justify-center gap-2"
      >
        <HeaderMenu
          :key="route.tag + i"
          v-bind="route"
          v-for="(route, i) in config.routes"
        />
      </div>
    </div>
  </div>
</template>
