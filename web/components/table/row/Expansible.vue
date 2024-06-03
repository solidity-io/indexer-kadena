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
  subColumns: any;
}>()

const emit = defineEmits(['click'])
</script>

<template>
  <Disclosure
    as="div"
    v-slot="{ open }"
  >
    <DisclosureButton
      @click.prevent="emit('click')"
      class="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-4 px-4 py-3 justify-between w-full"
      :class="[!open && 'border-b border-b-gray-300 hover:bg-gray-700']"
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
            class="text-font-400 text-sm truncate"
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
        class="text-gray-500 rounded-lg bg-gray-700 p-4 mx-4"
      >
        <div
          class="grid grid-cols-3 pb-4 border-b border-b-gray-300"
        >
          <div
            :key="`subheader:${index}`"
            v-for="(column, index) in subColumns"
            class="text-center"
          >
            <span
              class="text-font-500 text-xs truncate font-semibold"
            >
              {{ column.label }}
            </span>
          </div>
        </div>

        <div
          :key="`subrow:${index}`"
          v-for="(balance, index) in row.balances"
          class="grid grid-cols-3 py-4 border-b border-b-gray-300"
        >
          <div
            :key="`subcol:${index}`"
            v-for="(column, index) in subColumns"
            class="text-font-450 flex items-center justify-center text-center"
          >
            <slot
              :row="balance"
              :name="column.key"
              :order="rowIndex"
            >
              <span
                class="text-font-400 text-sm truncate"
              >
                {{ balance[column.key] }}
              </span>
            </slot>
          </div>
        </div>
      </DisclosurePanel>
    </transition>
  </Disclosure>
</template>
