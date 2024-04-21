<script setup lang="ts">
defineProps<{
  id: string,
  icon: string,
  name: string,
  symbol?: string,
}>()
</script>

<template>
  <NuxtLink
    :to="`/tokens/${id}`"
  >
    <div
      class="flex items-center gap-2"
    >
      <div
        class="h-6 w-6 rounded shrink-0"
      >
        <img
          :src="icon"
        />
      </div>

      <div
        class="flex gap-2 items-end"
      >
        <span
          class="text-sm text-font-400 whitespace-nowrap"
        >
          {{ name }}
        </span>

        <span
          v-if="symbol"
          class="text-font-500 text-xs font-medium uppercase"
        >
          {{ symbol }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
