<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    delta?: number,
    suffix?: string;
    isDark?: boolean;
    description?: string | number;
  }>(),
  {
    label: '',
    suffix: '',
    description: '',
    isDark: false,
  }
)
</script>

<template>
  <div
    :class="isDark && 'bg-gray-800'"
    class="p-6 flex flex-col gap-4 rounded-lg"
  >
    <div
      class="flex items-center justify-between gap-2"
    >
      <span
        class="text-font-500 font-[500]"
      >
        {{ label }}
      </span>

      <div
        v-if="delta"
        class="px-2 py-1 bg-gray-900 rounded"
      >
        <span
          class="text-xs block"
          :class="delta < 0 ? 'text-system-red' : 'text-system-green'"
        >
            {{ delta.toFixed(2) }}%
        </span>

      </div>
    </div>

    <div
      class="text-font-400 flex items-end gap-1"
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
  </div>
</template>
