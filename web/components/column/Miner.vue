<script setup lang="ts">
const props = defineProps<{
  minerData: string,
}>()

const miner = useBlockMiner(props.minerData)
</script>

<template>
  <ColumnLink
    :to="`/account/${miner.account}`"
    :label="shortenAddress(miner.account, 8)"
  />
</template>
