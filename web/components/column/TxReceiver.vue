<script setup lang="ts">
const props = defineProps<{
  row: any
}>()

const {
  receiver
} = useTransaction(props.row)
</script>

<template>
  <ColumnAddress
    :value="receiver"
  />
</template>
