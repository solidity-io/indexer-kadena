<script setup lang="ts">
const props = defineProps<{
  status: string,
  chainId: string,
  requestKey: string,
  sender: string,
  receiver: string,
  amount: number,
  createdAt: Date,
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
  <div
    class="flex items-center justify-between gap-4 py-3 border-b border-b-gray-300"
  >
    <Status
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
      class="flex flex-col gap-4"
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
      class="flex flex-col text-sm gap-4"
    >
      <div
        class="flex gap-2"
      >
        <span
          class="text-font-400"
        >
          {{ props.amount }}
        </span>
      </div>

      <div
        class="flex gap-2"
      >
        <span
          class="text-font-400"
        >
          {{ props.createdAt.toUTCString() }}
        </span>
      </div>
    </div>
  </div>
</template>
