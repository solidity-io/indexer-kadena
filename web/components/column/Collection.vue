<script setup lang="ts">
defineProps<{
  name: string,
  icon: string,
}>()
</script>

<template>
  <div
    class="flex items-center gap-4"
  >
    <img
      :src="icon"
      class="w-11 h-11 rounded"
    />

    <span
      class="text-sm text-font-400"
    >
      {{ name }}
    </span>
  </div>
</template>
