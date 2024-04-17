<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number;
  col?: boolean;
  withCopy?: boolean;
}>()
</script>

<template>
  <div
    class="flex gap-4"
    :class="[
      col && 'flex-col !items-start'
    ]"
  >
    <div
      class="w-full max-w-[200px] h-max pt-[6px]"
    >
      <span
        class="text-font-500 text-sm font-medium block"
      >
        {{ label }}
      </span>
    </div>

    <div
      :class="!value && 'flex-col'"
      class="text-font-400 text-sm items-center flex gap-2"
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
