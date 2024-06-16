<script setup lang="ts">
import { IconArrowRight } from '#components'

const props = withDefaults(
  defineProps<{
    label: string,
    icon?: 'arrowRight',
    iconPosition?: 'left' | 'right',
    size?: 'small' | 'medium' | 'large',
    type?: 'outline' | 'filled' | 'double' | 'icon',
  }>(),
  {
    icon: 'arrowRight',
    iconPosition: 'right',
    size: 'small',
    type: 'filled',
  }
)

const iconSizes = {
  large: 'h-5 w-5',
  small: 'h-4 w-4',
}

const rootSizes = {
  large: 'px-4 py-2',
  small: 'px-2 py-1 !rounded',
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

const icons = {
  arrowRight: IconArrowRight,
}
</script>

<template>
  <button
    :class="[
      rootSizes[props.size],
      rootClass[props.type],
      iconPosition === 'left' && 'flex-row-reverse',
    ]"
    class="rounded-lg group box-border w-auto h-auto flex w-full items-center"
  >
    <span
      class="text-font-400 group-hover:text-kadscan-500 block"
      :class="[
        labelSizes[props.size]
      ]"
    >
      {{ props.label }}
    </span>

    <component
      v-if="icon"
      :is="icons[icon]"
      :class="[iconSizes[props.size]]"
      class="
        w-0
        z-[2]
        relative
        text-font-400 group-hover:text-kadscan-500
        duration-[0.3s]
        translate-y-[-5%]
        group-hover:w-[24px]
        group-hover:mr-[-8px]
      "
    />
  </button>
</template>
