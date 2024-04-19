<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    float?: string,
    suffix?: string;
    delta?: number;
    description?: string | number;
  }>(),
  {
    label: '',
    suffix: '',
    description: '',
  }
)
</script>

<template>
  <div
    class="p-6 flex flex-col gap-2.5 rounded-lg bg-gray-800"
  >
    <div
      class="flex items-center justify-between gap-2"
    >
      <span
        class="text-font-500 text-sm"
      >
        {{ label }}
      </span>
    </div>

    <div
      class="flex items-center justify-between gap-2"
    >
      <div
        class="flex items-center justify-between gap-2 text-font-400 flex items-end gap-1"
      >
        <span
          class="text-2xl leading-[100%] font-[600]"
        >
          {{ description }}
        </span>

        <span
          v-if="suffix"
          class="text-[14px] font-[500]"
        >
          {{ suffix }}
        </span>
      </div>

      <div
        v-if="delta"
        class="px-2 py-1 bg-gray-900 rounded"
      >
        <span
          class="text-xs block"
          :class="delta < 0 ? 'text-system-red' : 'text-system-green'"
        >
          {{ delta.toFixed(2) }}
        </span>
      </div>
    </div>
  </div>
</template>
