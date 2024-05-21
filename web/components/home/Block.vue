<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  parent: string,
  nodeId: string,
  chainId: number,
  height: number,
  hash: string,
  createdAt: any,
  minerData: string,
  // transactionsByBlockId: any,
}>()

const status = computed((): 'success' | 'error' => {
  return props.parent ? 'success' : 'error'
})

const miner = useBlockMiner(props.minerData)
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-3 xl:gap-4 py-3 lg:h-[111px] xl:max-h-[82px] border-b border-b-gray-300"
  >
    <IconStatus
      :status="status"
      class="mb-auto xl:mb-0"
    />

    <div
      class="flex xl:flex-col gap-4 mb-auto xl:mb-0"
    >
      <Value
        isLink
        :value="shortenAddress(miner.account)"
        label="Miner"
        :to="`/account/${miner.account}`"
        class="xl:w-full "
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
      class="flex flex-col flex-wrap gap-3 xl:gap-4 ml-auto grow"
    >
      <!-- <Value
        label="Transactions"
        :value="transactionsByBlockId.totalCount"
      /> -->

      <Value
        :value="format(props.createdAt, 'dd MMM y HH:mm:ss')"
      />
    </div>
  </div>
</template>
