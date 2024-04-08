<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  status: string,
  chainId: string,
  requestKey: string,
  sender: string,
  receiver: string,
  amount: number,
  createdAt: number,
}>()

function shortenAddress (
  address: string,
  chars = 5
): string {
  return `${address.slice(0, chars)}...${address.slice(
    -chars
  )}`
}
</script>

<template>
  <NuxtLink
    to="/transaction/1"
  >
    <div
      class="flex items-center gap-4 py-3 border-b border-b-gray-300 hover:opacity-[0.8] cursor-pointer"
    >
      <IconStatus
        :status="+props.status > 0 ? 'success' : 'error'"
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
            {{ shortenAddress(props.requestKey) }}
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
            {{ shortenAddress(props.receiver) }}
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
            {{ props.amount }} KDA
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
