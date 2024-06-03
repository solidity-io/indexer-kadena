<script setup lang="ts">
import { provideUseId, TabGroup, TabList, Tab, TabPanels } from '@headlessui/vue'

withDefaults(
  defineProps<{
    tabs: any[],
  }>(),
  {
    tabs: []
  }
)

provideUseId(() => useId())
</script>

<template>
  <div>
    <TabGroup>
      <div
        class="flex justify-between gap-4 max-w-full overflow-auto"
      >
        <TabList class="flex items-center gap-4 lg:gap-6">
          <Tab
            v-for="tab in tabs"
            as="template"
            :key="tab.key"
            :disabled="tab.disabled"
            v-slot="{ selected }"
          >
            <button
              v-tooltip="tab.disabled && 'Coming soon'"
              :class="[
                'pb-[6px] lg:pb-[10px] px-3 lg:px-3 outline-none box-border border-b border-b-[2px] shrink-0 disabled:cursor-not-allowed disabled:opacity-[0.8]',
                selected
                  ? 'text-font-400  border-b-kadscan-500'
                  : 'text-font-500 border-b-transparent',
              ]"
            >
              <span
                class="block text-sm leading-[19.6px] lg:text-base lg:leading-[22px]"
              >
                {{ tab.label }}
              </span>
            </button>
          </Tab>
        </TabList>
        <!-- <slot name="button" /> -->
      </div>

      <TabPanels class="pt-4 lg:pt-8 w-full break-words">
        <slot />
      </TabPanels>
    </TabGroup>
  </div>
</template>
