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
    class="flex flex-wrap items-center gap-3 bazk:gap-4 py-3 border-b border-b-gray-300 bazk:max-h-[82px]"
  >
    <IconStatus
      :status="status"
    />

    <div
      class="flex bazk:flex-col gap-4 grow"
    >
      <Value
        isLink
        label="Request Key"
        :to="`/transactions/${nodeId}`"
        :value="shortenAddress(props.requestkey)"
      />

      <Value
        label="Chain"
        :value="props.chainid"
      />
    </div>

    <div
      class="flex bazk:flex-col gap-4 bazk:mx-auto grow"
    >
      <Value
        isLink
        label="From"
        :to="`/account/${sender}`"
        :value="shortenAddress(sender)"
      />

      <Value
        isLink
        label="To"
        :to="`/account/${receiver}`"
        :value="shortenAddress(receiver)"
      />
    </div>

    <div
      class="flex flex-row-reverse justify-between w-full bazk:w-auto bazk:justify-start bazk:flex-col items-end gap-4 bazk:ml-auto"
    >
      <div
        class="flex px-2 py-1 border border-gray-300 rounded"
      >
        <span
          class="text-font-450 text-xs"
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

      <Value
        :value="format(new Date(props.createdAt), 'dd MMM y HH:mm:ss')"
      />
    </div>
  </div>
</template>
