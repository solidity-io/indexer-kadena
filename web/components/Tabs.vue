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
      <TabList class="flex items-center gap-6">
        <Tab
          v-for="tab in tabs"
          as="template"
          :key="tab.key"
          v-slot="{ selected }"
        >
          <button
            :class="[
              'pb-[10px] px-3 outline-none box-border border-b border-b-[2px]',
              selected
                ? 'text-font-400  border-b-kadscan-500'
                : 'text-font-500 border-b-transparent',
            ]"
          >
            <span
              class="block leading-[22px]"
            >
              {{ tab.label }}
            </span>
          </button>
        </Tab>
      </TabList>

      <TabPanels class="pt-8">
        <slot />
      </TabPanels>
    </TabGroup>
  </div>
</template>
