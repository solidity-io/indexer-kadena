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
        <TabList class="flex items-center gap-4 bazk:gap-6">
          <Tab
            v-for="tab in tabs"
            as="template"
            :key="tab.key"
            v-slot="{ selected }"
          >
            <button
              :class="[
                'pb-[6px] bazk:pb-[10px] px-3 bazk:px-3 outline-none box-border border-b border-b-[2px] shrink-0',
                selected
                  ? 'text-font-400  border-b-kadscan-500'
                  : 'text-font-500 border-b-transparent',
              ]"
            >
              <span
                class="block text-sm leading-[19.6px] bazk:text-base bazk:leading-[22px]"
              >
                {{ tab.label }}
              </span>
            </button>
          </Tab>
        </TabList>
        <!-- <slot name="button" /> -->
      </div>

      <TabPanels class="pt-4 bazk:pt-8 w-full break-words">
        <slot />
      </TabPanels>
    </TabGroup>
  </div>
</template>
