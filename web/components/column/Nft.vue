<script setup lang="ts">
const props = defineProps<{
  image: string,
  name: string,
  collection: string,
  nodeId?: string,
  metadata?: string,
}>()

const nftMetadata = useNftMetadata(props.metadata)
</script>

<template>
  <NuxtLink
    :to="`/nfts/${props.nodeId}`"
    class="w-full"
  >
    <div
      class="flex items-center gap-4 w-full"
    >
      <div
        class="shrink-0"
      >
        <div
          v-if="nftMetadata.isUnknown"
          class="w-11 h-11 rounded bg-gray-200"
        />

        <video
          autoplay muted loop
          class="w-11 h-11 rounded bg-gray-200 pulse"
          v-else-if="nftMetadata.assetUrl?.match(/\.(mp4|webm|ogg)$/i)"
        >
          <source :src="nftMetadata.assetUrl || nftMetadata.thumbnailUrl" />
        </video>

        <img
          v-else
          :src="nftMetadata.assetUrl || nftMetadata.thumbnailUrl"
          class="w-11 h-11 rounded bg-gray-200"
        />
      </div>

      <div
        class="flex flex-col gap-1 max-w-full break-words"
      >
        <span
          class="text-sm text-font-400 line-clamp-2"
        >
          {{ nftMetadata?.name }}
        </span>

        <span
          v-if="!nftMetadata.isUnknown"
          class="text-xs font-medium text-font-500 block leading-[150%]"
        >
          <!-- {{ nftMetadata?.description }} -->
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
