<script setup lang="ts">
defineProps<{
  delta: number,
}>()
</script>

<template>
  <span
    class="text-sm"
    :class="delta < 0 ? 'text-system-red' : 'text-system-green'"
  >
    {{ delta * 100 }}%
  </span>
</template>
