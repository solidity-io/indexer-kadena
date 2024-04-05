<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    float?: string,
    suffix?: string;
    description?: string;
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
        v-if="float"
        class="px-2 py-1 bg-gray-900 rounded"
      >
        <span
          class="text-xs block"
          :class="float.includes('-') ? 'text-system-red' : 'text-system-green'"
        >
          {{ float.replace('-', '') }}
        </span>
      </div>
    </div>
  </div>
</template>
