<script setup lang="ts">
defineProps<{
  value: string
}>()

function shortenAddress (
  address: string,
  chars = 5
): string {
  return `${address.slice(0, chars)}...${address.slice(
    -chars
  )}`
}
</script>

<template>
  <span
    class="text-sm"
  >
    {{ shortenAddress(value, 8) }}
  </span>
</template>
