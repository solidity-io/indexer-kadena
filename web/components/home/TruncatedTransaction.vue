<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  nodeId: string,
  result: string,
  sender: string,
  chainid: number,
  createdAt: string,
  requestkey: string,
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
  return props.result.includes('\"status\":\"success\"') ? 'success' : 'error'
})
</script>

<template>
  <NuxtLink
    :to="`/transaction/${nodeId}`"
  >
    <div
      class="flex items-center gap-4 py-3 border-b border-b-gray-300 hover:opacity-[0.8] cursor-pointer"
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
            Request Key
          </span>

          <span
            class="text-font-400"
          >
            {{ shortenAddress(props.requestkey) }}
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
            {{ props.chainid }}
          </span>
        </div>
      </div>

      <div
        class="flex flex-col gap-4 mx-auto"
      >
        <div
          class="flex gap-2 text-sm"
        >
          <span
            class="text-font-500 whitespace-nowrap"
          >
            From
          </span>

          <span
            class="text-font-400"
          >
            {{ shortenAddress(props.sender) }}
          </span>
        </div>

        <div
          class="flex gap-2 text-sm"
        >
          <span
            class="text-font-500 whitespace-nowrap"
          >
            To
          </span>

          <span
            class="text-font-400"
          >
            <!-- {{ shortenAddress("coin") }} -->
            - todo -
          </span>
        </div>
      </div>

      <div
        class="flex flex-col items-end gap-4 ml-auto"
      >
        <div
          class="flex px-2 py-0.5 border border-gray-300 rounded"
        >
          <span
            class="text-font-400 text-xs"
          >
            <!-- {{ props.amount }} KDA -->
            - todo -
          </span>
        </div>

        <div
          class="flex gap-2"
        >
          <span
            class="text-font-400 text-sm"
          >
            {{ format(new Date(props.createdAt), 'dd MMM y HH:mm:ss') }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
