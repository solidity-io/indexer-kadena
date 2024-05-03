<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'

const props = defineProps<{
  row: any;
  columns: any;
  rowIndex: any;
}>()

const emit = defineEmits(['click'])
</script>

<template>
  <Disclosure
    as="div"
  >
    <DisclosureButton
      @click.prevent="emit('click')"
      class="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4 px-4 py-3 border-b border-b-gray-300 justify-between hover:bg-gray-700 w-full"
    >
      <div
        :key="index"
        v-for="(column, index) in columns"
        :style="{ gridColumn: `span ${column.cols} / span ${column.cols}` }"
        class="text-font-450 flex items-center"
        :class="column.center && 'text-center justify-center'"
      >
        <slot
          :row="row"
          :name="column.key"
          :order="rowIndex"
        >
          <span
            class="text-font-450 text-sm truncate"
          >
            {{ row[column.key] }}
          </span>
        </slot>
      </div>
    </DisclosureButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-out"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <DisclosurePanel
        class="text-gray-500"
      >
        Yes! You can purchase a license that you can share with your entire team.
      </DisclosurePanel>
    </transition>
  </Disclosure>
</template>
