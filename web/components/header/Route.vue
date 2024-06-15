<script setup lang="ts">
import { provideUseId, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

provideUseId(() => useId())

interface BaseRoute {
  path?: string;
  tag: string;
  label: string;
}

const props = defineProps<{
  tag: string,
  path?: string,
  label: string,
  type: 'group' | 'link',
  subroutes?: BaseRoute[];
}>()
</script>

<template>
  <div>
    <NuxtLink
      :to="props.path"
      v-if="props.type === 'link'"
      class="px-3 py-2 text-font-400 hover:text-kadscan-500 block"
    >
      {{ props.label }}
    </NuxtLink>

    <div
      v-else
    >
      <Popover
        v-slot="{ open, close }"
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
            {{ props.label }}
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
              md:absolute right-0 top-[calc(100%+16px)] border-t-[2px] border-t-kadscan-500 bg-gray-700 rounded-b-lg w-[240px]
            "
          >
            <div
              class="flex flex-col gap-2"
            >
              <NuxtLink
                @click="close"
                :to="subroute.path"
                :key="subroute.tag"
                class="p-3 text-sm text-font-400 hover:text-kadscan-500"
                v-for="subroute in props.subroutes ?? []"
              >
                {{ subroute.label }}
              </NuxtLink>
            </div>
          </PopoverPanel>
        </transition>
      </Popover>
    </div>
  </div>
</template>
