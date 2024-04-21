<script setup lang="ts">
defineProps<{
  image: string,
  name: string,
  collection: string,
}>()
</script>

<template>
  <NuxtLink
    :to="`/collections/1/nfts/1`"
  >
    <div
      class="flex items-center justify-center gap-4"
    >
      <div>
        <img
          :src="image"
          class="w-11 h-11 rounded"
        />
      </div>

      <div
        class="flex flex-col gap-1"
      >
        <span
          class="text-sm text-font-400"
        >
          {{ name }}
        </span>

        <span
          class="text-xs font-medium text-font-500 block leading-[150%]"
        >
          {{ collection }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
