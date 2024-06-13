<script setup lang="ts">
const props = defineProps<{
  nodeId: string
  metadata: string
}>()

const {
  blockchainTooltipData
} = useAppConfig()

const nftMetadata = useNftMetadata(props.metadata)
</script>

<template>
  <LabelValue
    label="NFT"
    :description="blockchainTooltipData.transaction.overview.amount"
  >
    <template
      #value
    >
      <NuxtLink
        :to="`/nfts/${nodeId}`"
        class="flex gap-2 items-center"
      >
        <div
          class="
            w-full
            rounded-lg
            aspect-square
            max-w-[44px]
            overflow-hidden border-[3px] border-gray-800 shrink-1 flex justify-center items-center"
        >
          <video
            autoplay muted loop
            class="aspect-square max-w-[44px] bg-gray-200 pulse w-full"
            v-if="nftMetadata.datum?.assetUrl?.match(/\.(mp4|webm|ogg)$/i)"
          >
            <source :src="nftMetadata.datum.assetUrl" />
          </video>

          <img
            v-else
            :src="nftMetadata?.datum?.assetUrl || nftMetadata.datum?.thumbnailUrl"
            class="aspect-square max-w-[44px]"
          />
        </div>

        <div>
          <span
            class="text-font-400 text-sm fix flex gap-2 break-words"
          >
            {{ nftMetadata.datum.title || nftMetadata.datum.name }}
          </span>
        </div>
      </NuxtLink>
    </template>
  </LabelValue>
</template>
