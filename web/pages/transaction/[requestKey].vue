<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Transaction Details'
})

const data = reactive({
  currentPage: 1,
  totalPages: 15,
  tabs: [
    {
      key: 'overview',
      label: 'Overview',
    },
    {
      key: 'meta',
      label: 'Meta',
    },
    {
      key: 'output',
      label: 'Transaction Output',
    },
    {
      key: 'events',
      label: 'Events',
    },
  ],
})
</script>

<template>
  <div
    class="flex flex-col gap-6 pt-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Transaction Details
      </h1>
    </div>

    <div
      class="
        p-8
        bg-gray-800
        rounded-2xl
      "
    >
      <TransactionDetails />
    </div>

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
          <TransactionOverview />
        </TabPanel>

        <TabPanel>
          <TransactionMeta />
        </TabPanel>

        <TabPanel>
          <TransactionOutput />
        </TabPanel>

        <TabPanel>
          <TransactionEvents />
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
