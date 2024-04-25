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
    class="p-3 bazk:p-6 flex flex-col gap-3 bazk:gap-4 rounded-lg"
  >
    <div
      class="flex items-center justify-between gap-2 py-px min-h-[26px]"
    >
      <span
        class="text-sm bazk:text-base text-font-500 bazk:font-[500]"
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
        class="text-xl bazk:text-2xl bazk:leading-[100%] font-medium bazk:font-semibold"
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
