<script setup lang="ts">
defineProps<{
  value: string
}>()
</script>

<template>
  <span
    class="text-sm font-semibold text-system-green"
  >
    {{ value }}
  </span>
</template>
