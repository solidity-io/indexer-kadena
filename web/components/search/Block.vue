<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  parent: string,
  nodeId: string,
  chainId: number,
  height: number,
  hash: string,
  // createdAt: any,
  // minerData: string,
  // transactionsByBlockId: any,
}>()

const status = computed((): 'success' | 'error' => {
  return props.parent ? 'success' : 'error'
})

// const miner = useBlockMiner(props.minerData)
</script>

<template>
  <NuxtLink
    :to="`/blocks/${nodeId}`"
    class="py-3 border-b border-gray-300 flex gap-2 hover:opacity-[0.8]"
  >
    <IconStatus
      :status="status"
      class="mb-auto xl:mb-0  w-[28px] h-[28px]"
    />

    <div
      class="flex flex-col"
    >
      <span
        class="text-font-400 text-sm"
      >
        {{ hash }}
      </span>

      <div>
        <span
          class="text-font-500 text-xs"
        >
          Block Height: {{ height }}
        </span>

        -

        <span
          class="text-font-500 text-xs"
        >
          Chain Id: {{ chainId }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
