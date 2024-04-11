<script lang="ts" setup>
defineProps<{
  id: string,
  name: string,
  collection: string,
}>()
</script>

<template>
  <div
    class="col-span-1 rounded-lg overflow-hidden border border-gray-500"
  >
    <div
      class="max-w-full scale-1"
    >
      <img
        :src="`/nft/${id}.webp`"
        class="w-full"
      />
    </div>

    <div
      class="p-4 bg-gray-700 flex flex-col"
    >
      <span
        class="text-sm text-font-500"
      >
        {{ collection }}
      </span>

      <span
        class="text-font-400"
      >
        {{ name }}
      </span>

      <span
        class="pt-3 text-font-400"
      >
        15.32 KDA
      </span>
    </div>
  </div>
</template>
