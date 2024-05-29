<script lang="ts" setup>
defineProps<{
  id: string,
  name?: string,
  image?: string,
  collection?: string,
}>()
</script>

<template>
  <div
    class="col-span-1 rounded-lg overflow-hidden border border-gray-500"
  >
    <div
      class="max-w-full aspect-square overflow-hidden"
    >
      <img
        :src="image"
        class="w-full"
      />
    </div>

    <div
      class="p-2 bazk:p-4 bg-gray-700 flex flex-col grow"
    >
      <span
        class="text-xs bazk:text-sm text-font-500"
      >
        {{ collection }}
      </span>

      <span
        class="text-sm bazk:text-base text-font-400"
      >
        {{ name }}
      </span>

      <!-- <span
        class="text-sm bazk:text-base pt-3 text-font-400"
      >
        0.0 KDA
      </span> -->
    </div>
  </div>
</template>
