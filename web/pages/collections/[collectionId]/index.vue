<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'NFT Collection'
})

const data = reactive({
  tabs: [
    {
      key: 'items',
      label: 'Items',
    },
    {
      key: 'activity',
      label: 'Activity',
    },
  ],
})
</script>

<template>
  <div
    class="flex flex-col gap-6 pt-6"
  >
    <CollectionHeader />

    <div
      class="
        p-8
        bg-gray-800
        rounded-2xl
      "
    >
      <Tabs
        :tabs="data.tabs"
      >
        <TabPanel>
          <CollectionNFT />
        </TabPanel>

        <TabPanel>
          <CollectionActivity />
        </TabPanel>
      </Tabs>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
