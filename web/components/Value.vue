<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string,
    value: string | number,
    label?: string | number,
    isLink?: boolean,
  }>(),
  {
    to: '#',
    isLink: false,
  }
)
</script>

<template>
  <div
    class="grow flex flex-col xl:flex-row gap-2 text-sm"
  >
    <span
      v-if="label"
      class="text-font-500 whitespace-nowrap"
    >
      {{ label }}
    </span>

    <ColumnLink
      :to="to"
      :label="value"
      v-if="isLink"
    />

    <span
      v-else
      class="text-font-450 leading-[20px] block"
    >
      {{ value }}
    </span>
  </div>
</template>
