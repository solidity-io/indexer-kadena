<script setup lang="ts"/>

<template>
  <div
    class="h-screen flex flex-col items-center"
  >
    <div
      class="w-full bg-blue-400"
    >
      <HeaderTopbar/>
    </div>

    <div
      class="
        w-full max-w-[1352px] grow
        px-4
        pt-4 lg:pt-6
        pb-[60px] lg:pb-[38px]
      "
    >
      <slot />
    </div>

    <Footer />
  </div>
</template>
