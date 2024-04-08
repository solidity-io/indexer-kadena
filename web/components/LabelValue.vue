<script setup lang="ts">
defineProps<{
  label: string;
  value?: string;
  withCopy?: boolean;
}>()
</script>

<template>
  <div
    class="flex gap-4"
    :value="value ? 'items-start' : 'items-center'"
  >
    <div
      class="w-full max-w-[200px]"
    >
      <span
        class="text-font-500 text-sm font-medium"
      >
        {{ label }}
      </span>
    </div>

    <div
      :class="!withCopy && 'flex-col items-center'"
      class="text-font-400 text-sm flex gap-2"
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
