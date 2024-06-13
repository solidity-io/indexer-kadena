<script setup lang="ts">
const props = defineProps<{
  nodeId?: any
  contract?: any,
}>()

const nft = useNft(props?.contract)
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
        <NftImage
          :image="nft.image"
          classRoot="w-11 h-11 rounded bg-gray-200"
        />
      </div>

      <div
        class="flex flex-col gap-1 max-w-full break-words"
      >
        <span
          class="text-sm text-font-400 line-clamp-2"
        >
          {{ nft.name }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
