<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import type { BaseRoute } from '~/config';

const props = defineProps<{
  label: string;
  items: BaseRoute[];
}>()

import { provideUseId } from '@headlessui/vue';
//import { Disclosure, DisclosureButton, DisclosurePanel,} from '@headlessui/vue'

provideUseId(() => useId())
</script>

<template>
  <div>
    <Popover
      v-slot="{ open }"
      class="relative"
      inheritAttrs
    >
      <PopoverButton
        :class="open ? 'text-kadscan-500' : 'text-font-400'"
        class="hover:text-kadscan-500 flex items-center justify-center gap-2 px-3 py-2 ring-0 outline-none"
      >
        <span
          class="text-sm"
        >
          {{ label }}
        </span>

        <IconArrow
          class="transition"
          :class="open ? 'rotate-90' : '-rotate-90'"
        />
      </PopoverButton>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel
          class="
            px-2
            pb-3
            pt-2
            absolute right-0 top-[calc(100%+16px)] border-t-[2px] border-t-kadscan-500 bg-gray-700 rounded-b-lg w-[240px]
          "
        >
          <div
            class="flex flex-col gap-2"
          >
            <NuxtLink
              :to="'#'"
              :key="subroute.tag"
              class="p-3 text-sm text-font-400 hover:text-kadscan-500"
              v-for="subroute in props.items"
            >
              {{ subroute.label }}
            </NuxtLink>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>
