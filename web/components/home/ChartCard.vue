<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    suffix?: string;
    isDark?: boolean;
    description?: string;
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
    <span
      class="text-font-500 font-[500]"
    >
      {{ label }}
    </span>

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
