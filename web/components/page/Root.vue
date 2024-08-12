<script setup lang="ts">
withDefaults(
  defineProps<{
    error?: any,
  }>(),
  {
    error: null,
  }
)
</script>

<template>
  <div
    class="flex flex-col gap-4 md:gap-6"
  >
    <template
      v-if="!error"
    >
      <slot />
    </template>

    <TableContainer
      v-else
    >
      <div
        class="pb-4"
      >
        <span
          class="text-font-400 text-md font-bold"
        >
          Server Error
        </span>
      </div>

      <span
        class="text-font-400"
      >
        {{ error?.message }}
      </span>
  </TableContainer>
  </div>
</template>
