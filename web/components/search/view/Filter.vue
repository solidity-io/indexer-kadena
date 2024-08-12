<script setup lang="ts">
defineProps<{
  label: string,
  isActive?: boolean,
}>()
</script>

<template>
  <div
    class="border border-gray-300 px-3 py-1 rounded"
    :class="isActive && 'bg-gray-300'"
  >
    <span
      class="text-white text-sm"
      :class="isActive && '!text-kadscan-500'"
    >
      {{ label }}
    </span>
  </div>
</template>
