<script setup lang="ts">
defineProps<{
  icon: string,
  name: string,
}>()
</script>

<template>
  <div
    class="flex items-center gap-3"
  >
    <div
      class="h-6 w-6 rounded"
    >
      <img
        :src="icon"
      />
    </div>

    <div>
      <span
        class="text-sm text-font-400"
      >
        {{ name }}
      </span>
    </div>
  </div>
</template>
