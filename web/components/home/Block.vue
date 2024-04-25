<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  parent: string,
  nodeId: string,
  chainId: number,
  height: number,
  hash: string,
  createdAt: any,
  transactionsByBlockId: any,
}>()

function shortenAddress (
  address: string,
  chars = 5
): string {
  return `${address.slice(0, chars)}...${address.slice(
    -chars
  )}`
}

const status = computed((): 'success' | 'error' => {
  return props.parent ? 'success' : 'error'
})
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-3 bazk:gap-4 py-3 bazk:max-h-[82px] border-b border-b-gray-300"
  >
    <IconStatus
      :status="status"
    />

    <div
      class="flex bazk:flex-col gap-4"
    >
      <Value
        isLink
        value="k:HLb_zg....bKYXWU"
        label="Miner"
        :to="`/account/${nodeId}`"
        class="w-full"
      />

      <Value
        label="Chain"
        :value="props.chainId"
      />
    </div>

    <div
      class="flex mb-auto mx-auto grow"
    >
      <Value
        isLink
        label="Block"
        :value="props.height"
        :to="`/blocks/${nodeId}`"
      />
    </div>

    <div
      class="flex flex-col flex-wrap gap-3 bazk:gap-4 ml-auto grow"
    >
      <Value
        label="Transactions"
        :value="transactionsByBlockId.totalCount"
      />

      <Value
        :value="format(props.createdAt, 'dd MMM y HH:mm:ss')"
      />
    </div>
  </div>
</template>
