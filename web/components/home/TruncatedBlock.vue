<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  parent: string,
  chainId: number,
  height: number,
  hash: string,
  createdAt: string,
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
  <NuxtLink
    to="/block/1"
  >
    <div
      class="flex items-center gap-4 py-3 max-h-[82px] border-b border-b-gray-300 hover:bg-gray-700 cursor-pointer"
    >
      <IconStatus
        :status="status"
      />

      <div
        class="flex flex-col gap-4"
      >
        <div
          class="flex gap-2 text-sm"
        >
          <span
            class="text-font-500 whitespace-nowrap"
          >
            Hash
          </span>

          <span
            class="text-font-400"
          >
            {{ shortenAddress(props.hash) }}
          </span>
        </div>

        <div
          class="flex gap-2 text-sm"
        >
          <span
            class="text-font-500 whitespace-nowrap"
          >
            Chain
          </span>

          <span
            class="text-font-400"
          >
            {{ props.chainId }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col mb-auto mx-auto"
      >
        <div
          class="flex gap-2 text-sm"
        >
          <span
            class="text-font-500 whitespace-nowrap"
          >
            Block
          </span>

          <span
            class="text-font-400"
          >
            {{ props.height }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col items-end gap-4 ml-auto"
      >
        <div
          class="flex gap-2 text-sm"
        >
          <span
            class="text-font-500 whitespace-nowrap"
          >
            Transactions
          </span>

          <span
            class="text-font-400"
          >
            25
          </span>
        </div>

        <div
          class="flex gap-2"
        >
          <span
            class="text-font-400 text-sm"
          >
            {{ format(props.createdAt, 'dd MMM y HH:mm:ss') }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
