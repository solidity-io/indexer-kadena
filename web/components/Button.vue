<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string,
    size?: 'small' | 'medium' | 'large',
    type?: 'outline' | 'filled' | 'double' | 'icon',
  }>(),
  {
    size: 'small',
    type: 'filled',
  }
)

const rootSizes = {
  large: 'px-4 py-2',
  small: 'px-3 py-2',
  medium: 'px-3 py-2',
}

const labelSizes = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base',
}

const rootClass = {
  filled: 'bg-gray-600 hover:bg-gray-500',
  icon: 'bg-transparent hover:bg-gray-500',
  outline: 'bg-transparent border border-gray-300',
  double: 'bg-transparent border border-gray-300 hover:bg-gray-500',
}
</script>

<template>
  <button
    :class="[
      rootSizes[props.size],
      rootClass[props.type]
    ]"
    class="rounded-lg group box-border w-auto h-auto"
  >
    <span
      class="text-font-400 group-hover:text-kadscan-500 block"
      :class="[
        labelSizes[props.size]
      ]"
    >
      {{ props.label }}
    </span>
  </button>
</template>
