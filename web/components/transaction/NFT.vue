<script setup lang="ts">
const props = defineProps<{
  nodeId: any,
  contract: any
}>()

const {
  blockchainTooltipData
} = useAppConfig()

const nft = useNft(props.contract)
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
          <NftImage
            :image="nft.image"
            classRoot="aspect-square max-w-[44px] bg-gray-200 pulse w-full"
          />
        </div>

        <div>
          <span
            class="text-font-400 text-sm fix flex gap-2 break-words"
          >
            {{ nft.name }}
          </span>
        </div>
      </NuxtLink>
    </template>
  </LabelValue>
</template>
