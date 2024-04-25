<script setup lang="ts"/>

<template>
  <div
    class="h-screen flex flex-col"
  >
    <div
      class="w-full bg-blue-400"
    >
      <HeaderTopbar/>
    </div>

    <div
      class="
        w-full max-w-screen-bazk mx-auto grow
        px-4 bazk:px-[60px]
        pt-4 bazk:pt-6
        pb-[60px] bazk:pb-[38px]
      "
    >
      <slot />
    </div>

    <Footer />
  </div>
</template>
