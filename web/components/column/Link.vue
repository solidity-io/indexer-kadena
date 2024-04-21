<script setup lang="ts">
defineProps<{
  to: string;
  label: string | number;
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="text-sm text-font-400 hover:text-kadscan-500 truncate"
  >
    <slot>
      {{ label }}
    </slot>
  </NuxtLink>
</template>
