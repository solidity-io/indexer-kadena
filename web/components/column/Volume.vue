<script setup lang="ts">
defineProps<{
  amount: string,
  currency: string,
}>()
</script>

<template>
  <span
    class="text-sm"
  >
    <span
      class="text-font-400"
    >
      {{ amount  }}
    </span>

    <span
      class="text-font-500"
    >
      {{ currency }}
    </span>
  </span>
</template>
