<script setup lang="ts">
import { createPopper } from '@popperjs/core';

const props = defineProps<{
  value: string | number | undefined
}>()

const button = ref(null);
const tooltip = ref(null);
const copying = ref(false);

let popperInstance: any = null;

const onCopy = async () => {
  copying.value = true

  await copyToClipboard(props.value || '')

  copying.value = false
}

const copyToClipboard = async (value: string | number) => {
  try {
    await navigator.clipboard.writeText(value + '');

    return new Promise(resolve => setTimeout(resolve, 900));
  } catch (e) {
    console.warn(e)
  }
}

watchEffect(() => {
  if (copying.value && button.value && tooltip.value) {
    popperInstance = createPopper(button.value, tooltip.value, {
      placement: 'top',
    });
  } else {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  }
});
</script>

<template>
  <div
    class="relative"
  >
    <div
      ref="tooltip"
      v-if="copying"
      class="z-[99999999]"
    >
      <div
        class="
          w-[72px] h-[33px] border bg-gray-700 border-gray-300 rounded grid place-items-center
        "
      >
        <span
          class="text-sm leading-[19.6px] relative"
        >
          Copied
        </span>
      </div>
    </div>

    <button
      ref="button"
      @click.prevent="onCopy()"
      class="p-1.5 rounded-lg hover:bg-gray-500 place-items-center grid"
    >
      <IconCopy
        class="w-5 h-5 text-white"
        :class="[copying && '!text-kadscan-500']"
      />
    </button>
  </div>
</template>
