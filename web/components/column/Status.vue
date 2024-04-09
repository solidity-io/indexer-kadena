<script setup lang="ts">
const props = defineProps<{
  row: any,
}>()

const variant = computed(() => {
  return props.row.result.includes('\"status\":\"success\"') ? 'success' : 'failed'
})

const label = computed(() => {
  return props.row.result.includes('\"status\":\"success\"') ? 'Success' : 'Finalized'
})
</script>

<template>
  <Tag
    :label="label"
    :variant="variant"
  />
</template>
