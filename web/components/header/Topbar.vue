<script setup lang="ts">
const config = useAppConfig()
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full flex items-center justify-center bg-gray-800 z-[10]
      h-[56px] bazk:h-[72px]
    "
  >
    <div
      class="w-full max-w-screen-bazk py-3 bazk:py-4 px-4 bazk:px-[60px] flex justify-between"
    >
      <NuxtLink
        to="/"
      >
        <IconLogoWhite
          class="h-7 bazk:h-8"
        />
      </NuxtLink>

      <div
        v-if="config.routes"
        class="hidden bazk:flex items-center justify-center gap-2"
      >
        <HeaderMenu
          :key="route.tag + i"
          v-bind="route"
          v-for="(route, i) in config.routes"
        />
      </div>

      <div
        class="bazk:hidden h-8 w-8 rounded p-1"
      >
        <IconMenu />
      </div>
    </div>
  </div>
</template>
