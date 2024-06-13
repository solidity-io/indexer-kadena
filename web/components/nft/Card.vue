<script lang="ts" setup>
const props = defineProps<{
  contract?: any,
}>()

const nft = useNft(props?.contract)

console.log('nft', nft)
</script>

<template>
  <div
    class="nft-card flex flex-col rounded-lg overflow-hidden border border-gray-500"
  >
    <div
      class="max-w-full aspect-square overflow-hidden"
    >
      <div
        v-if="!nft.image"
        class="min-w-full bg-gray-200 pulse w-full"
      />

      <video
        autoplay muted loop
        class="aspect-square min-w-full bg-gray-200 pulse w-full"
        v-else-if="nft.image.match(/\.(mp4|webm|ogg)$/i)"
      >
        <source :src="nft.image" />
      </video>

      <img
        v-else
        :src="nft.image"
        class="aspect-square min-w-full"
      />
    </div>

    <div
      class="p-2 bazk:p-4 bg-gray-700 flex flex-col grow"
    >
      <span
        class="text-xs bazk:text-sm text-font-500"
      >
        {{ nft.collection}}
      </span>

      <span
        class="text-sm bazk:text-base text-font-400"
      >
        {{ nft.name }}
      </span>
    </div>
  </div>
</template>

<style>
.nft-card {
  max-width: 238px;
  min-width: 152px;
  width: 100%;
}
</style>
