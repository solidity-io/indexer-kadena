<script setup lang="ts">
const props = defineProps<{
  account: string,
}>();
</script>

<template>
  <NuxtLink
    :to="`/account/${account}`"
    class="py-3 flex gap-2 hover:opacity-[0.8]"
  >
    <IconStatus
      status="success"
      class="mb-auto xl:mb-0  w-[28px] h-[28px]"
    />

    <div
      class="max-w-full truncate"
    >
      <span
        class="text-sm text-font-400"
      >
        {{ account }}
      </span>
    </div>
  </NuxtLink>
</template>
