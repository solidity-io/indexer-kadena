<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'NFT Details'
})

const data = reactive({
  tabs: [
    {
      key: 'activity',
      label: 'Activity',
    },
    {
      key: 'properties',
      label: 'Properties',
    },
    {
      key: 'more',
      label: 'More from this Collection',
    },
  ],
})
</script>

<template>
  <div
    class="flex flex-col gap-6 pt-6"
  >
    <NftDetails />

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
        <template
          #button
        >
          <NuxtLink
            to="/collection/1"
          >
            <Button
              size="medium"
              label="View full collection"
            />
          </NuxtLink>
        </template>

        <TabPanel>
          <NftActivity />
        </TabPanel>

        <TabPanel>
          <NftProperties />
        </TabPanel>

        <TabPanel>
          <NftMore />
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
