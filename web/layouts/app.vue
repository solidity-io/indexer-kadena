<script setup lang="ts"/>

<template>
  <div
    class="h-screen flex flex-col"
  >
    <HeaderTopbar/>

    <div
      class="max-w-screen-bazk px-[60px] pt-[64px] mx-auto w-full pb-[38px] grow"
    >
      <slot />
    </div>

    <Footer />
  </div>
</template>
