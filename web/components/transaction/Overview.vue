<script setup lang="ts">
defineProps<{
  code: string;
  nodeId: string,
  result: string,
  sender: string,
  chainId: number,
  gasprice: string,
  createdAt: string,
  requestkey: string,
  continuation: string;
  transfersByTransactionId: any
}>()

const {
  blockchainTooltipData
} = useAppConfig()
</script>

<template>
  <Divide>
    <DivideScroll
      class="max-h-[360px]"
    >
      <div
        class="grid gap-2"
        :key="'transfer:' + transfer.id"
        v-for="transfer in transfersByTransactionId?.nodes"
      >
        <LabelValue
          withCopy
          label="From"
          :value="transfer.fromAcct"
          :description="blockchainTooltipData.transaction.overview.from"
        />

        <LabelValue
          withCopy
          label="To"
          :value="transfer.toAcct"
          :description="blockchainTooltipData.transaction.overview.to"
        />

        <LabelValue
          label="Amount"
          :value="`${transfer.amount} ${transfer.modulename}`"
          :description="blockchainTooltipData.transaction.overview.amount"
        />
      </div>
    </DivideScroll>

    <DivideItem>
      <LabelValue
        label="Transaction Fee"
        :value="`${gasprice} KDA`"
        :description="blockchainTooltipData.transaction.overview.transactionFee"
      />

      <LabelValue
        withCopy
        label="Paid by"
        :value="sender"
        :description="blockchainTooltipData.transaction.overview.paidBy"
      />
    </DivideItem>

    <DivideItem>
      <LabelValue
        label="Gas Price"
        :value="`${gasprice} KDA`"
        :description="blockchainTooltipData.transaction.overview.gasPrice"
      />
    </DivideItem>

    <DivideItem>
      <LabelValue
        label="Code"
        :description="blockchainTooltipData.transaction.overview.code"
      >
        <template #value>
          <HighlightValue>
            {{ code }}
          </HighlightValue>
        </template>
      </LabelValue>
    </DivideItem>
  </Divide>
</template>
