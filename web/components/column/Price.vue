<script setup lang="ts">
defineProps<{
  amount: string,
  dollar: string,
}>()
</script>

<template>
  <div
    class="flex flex-col "
  >
    <span
      class="text-sm text-font-400"
    >
      {{ amount  }}
    </span>

    <span
      class="text-xs text-font-500 font-semibold leading-[150%] block"
    >
      {{ dollar }}
    </span>
  </div>
</template>
