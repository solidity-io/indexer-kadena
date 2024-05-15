<script setup lang="ts">
defineProps<{
  code: string;
  gasTransaction: any;
  metadata: any;
  receiver: string;
  continuation: string;
}>()

const {
  blockchainTooltipData
} = useAppConfig()
</script>

<template>
  <Divide>
    <DivideScroll>
      <LabelValue
        withCopy
        label="From"
        :value="metadata.sender"
      />

      <LabelValue
        withCopy
        label="To"
        :value="receiver"
      />

      <LabelValue
        label="Amount"
        value="2"
      />
    </DivideScroll>

    <DivideItem>
      <LabelValue
        label="Transaction Fee"
        :value="`${gasTransaction.amount} KDA`"
      />

      <LabelValue
        withCopy
        label="Paid by"
        :value="gasTransaction.fromAcct"
      />
    </DivideItem>

    <DivideItem>
      <LabelValue
        label="Gas Price"
        :value="`${metadata.gasPrice}`"
      />
    </DivideItem>

    <DivideItem>
      <LabelValue
        label="Code"
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
