<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number;
  col?: boolean;
  withCopy?: boolean;
  description?: string
}>()
</script>

<template>
  <div
    class="flex gap-2 md:gap-4 flex-col md:flex-row lg:items-center"
    :class="[
      col && '!flex-col !items-start'
    ]"
  >
    <div
      class="w-full max-w-[200px] h-full flex items-center gap-2"
    >
      <Tooltip
        v-if="description"
        :value="description"
      />

      <span
        class="text-font-500 text-xs md:text-sm font-medium"
      >
        {{ label }}
      </span>
    </div>

    <div
      :class="[!value && 'flex-col', value && 'items-center']"
      class="text-font-400 text-sm fix flex gap-2 break-words"
    >
      <slot
        name="value"
      >
        <span
          v-if="value"
        >
          {{ value }}
        </span>

        <div
          v-if="withCopy"
          class="p-[6px]"
        >
          <IconCopy
            class="w-5 h-5"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<style>
.fix {
  overflow-wrap:anywhere
}
</style>
