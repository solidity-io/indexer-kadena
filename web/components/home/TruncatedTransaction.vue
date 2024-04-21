<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  nodeId: string,
  result: string,
  chainid: number,
  createdAt: string,
  requestkey: string,
  transfersByTransactionId: any
}>()

const shortenAddress = (
  address: string,
  chars = 5
): string => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, chars)}...${address.slice(
    -chars
  )}`
}

const {
  sender,
  status,
  receiver,
  transfers,
  gasTransaction,
} = useTransaction(props)
</script>

<template>
  <div
    class="flex items-center gap-4 py-3 border-b border-b-gray-300 max-h-[82px]"
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

        <ColumnLink
          :label="shortenAddress(props.requestkey)"
          :to="`/transactions/${nodeId}`"
        />
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
          class="text-font-450"
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

        <ColumnLink
          :label="shortenAddress(sender)"
          :to="`/account/${sender}`"
        />
      </div>

      <div
        class="flex gap-2 text-sm"
      >
        <span
          class="text-font-500 whitespace-nowrap"
        >
          To
        </span>

        <ColumnLink
          :label="shortenAddress(receiver)"
          :to="`/account/${receiver}`"
        />
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
          <template
            v-if="transfers.length > 0"
          >
            {{ `${transfers[0].amount}` }}
          </template>

          <template
            v-else
          >
            {{ `${Number(gasTransaction.amount).toPrecision(2)} ${gasTransaction.modulename}`}}
          </template>
        </span>
      </div>

      <div
        class="flex gap-2"
      >
        <span
          class="text-font-450 text-sm"
        >
          {{ format(new Date(props.createdAt), 'dd MMM y HH:mm:ss') }}
        </span>
      </div>
    </div>
  </div>
</template>
