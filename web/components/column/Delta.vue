<script setup lang="ts">
defineProps<{
  delta?: number,
}>()
</script>

<template>
  <span
    v-if="delta"
    class="text-sm font-semibold"
    :class="delta < 0 ? 'text-system-red' : 'text-system-green'"
  >
   {{ delta.toFixed(2) }}%
  </span>
</template>
