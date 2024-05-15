<script setup lang="ts">
const props = defineProps<{
  result: string;
  blockId: number;
  chainId: string;
  requestkey: string;
  createdAt: string | number;
}>()

const status = useTransactionStatus(props.result)

const {
  blockchainTooltipData
} = useAppConfig()
</script>

<template>
  <PageRoot>
    <LabelValue
      withCopy
      label="Request Key"
      :value="requestkey"
      :description="blockchainTooltipData.transactionDetails.requestKey"
    />

    <LabelValue
      label="Status"
      :description="blockchainTooltipData.transactionDetails.status"
    >
      <template
        #value
      >
        <ColumnStatus
          :row="{ result: status }"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="Chain"
      :value="String(chainId)"
      :description="blockchainTooltipData.transactionDetails.chain"
    />

    <LabelValue
      label="Block Height"
      :value="blockId"
      :description="blockchainTooltipData.transactionDetails.blockHeight"
    />

    <LabelValue
      label="Timestamp"
      :value="new Date(createdAt).toUTCString()"
      :description="blockchainTooltipData.transactionDetails.timestamp"
    />
  </PageRoot>
</template>
