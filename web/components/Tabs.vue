<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

withDefaults(
  defineProps<{
    tabs: any[],
  }>(),
  {
    tabs: []
  }
)
</script>

<template>
  <div>
    <TabGroup>
      <TabList class="flex items-center gap-6">
        <Tab
          v-for="tab in tabs"
          as="template"
          :key="tab.key"
          v-slot="{ selected }"
        >
          <button
            :class="[
              'pb-[11px] px-3 outline-none box-border border-b',
              selected
                ? 'text-font-400  border-b-kadscan-500'
                : 'text-font-500 border-b-transparent',
            ]"
          >
            {{ tab.label }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="pt-8">
        <slot />
      </TabPanels>
    </TabGroup>
  </div>
</template>
