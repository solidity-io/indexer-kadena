<script setup lang="ts">
defineProps<{
  amount: string,
  modulename: string,
}>()

const {
  blockchainTooltipData
} = useAppConfig()
</script>

<template>
  <LabelValue
    label="Amount"
    :value="`${amount} ${modulename}`"
    :description="blockchainTooltipData.transaction.overview.amount"
  />
</template>
