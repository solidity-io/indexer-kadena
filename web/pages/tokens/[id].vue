<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Token Details'
})

const data = reactive({
  tabs: [
    {
      key: 'transfers',
      label: 'Transfers',
    },
    {
      key: 'holders',
      label: 'Holders',
    },
    {
      key: 'info',
      label: 'Info',
    },
  ],
})
</script>

<template>
  <div
    class="flex flex-col gap-6 pt-6"
  >
    <TokenDetails />

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
          <TokenTransfers />
        </TabPanel>

        <TabPanel>
          <TokenHolders />
        </TabPanel>

        <TabPanel>
          <TokenInfo />
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
