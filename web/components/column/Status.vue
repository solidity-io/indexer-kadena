<script setup lang="ts">
const props = defineProps<{
  row: any,
}>()

const variant = computed(() => {
  return +props.row.status > 0 ? 'success' : 'failed'
})

const label = computed(() => {
  return +props.row.status > 0 ? 'Success' : 'Finalized'
})
</script>

<template>
  <Tag
    :label="label"
    :variant="variant"
  />
</template>
