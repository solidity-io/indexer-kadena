<script lang="ts" setup>
defineProps<{
  text: string
}>()
</script>

<template>
  <div
    class="w-full py-60 gap-6 flex flex-col items-center justify-center"
  >
    <img
      src="/empty/table.png"
      class="w-[190px] h-[190px]"
    />

    <span
      class="text-lg font-medium text-font-400"
    >
      {{ text }}
    </span>
  </div>
</template>
