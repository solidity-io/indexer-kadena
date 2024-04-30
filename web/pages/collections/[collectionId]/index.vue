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
  <PageRoot>
    <CollectionHeader />

    <PageContainer>
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
    </PageContainer>
  </PageRoot>
</template>
