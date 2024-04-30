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
  <PageRoot>
    <NftDetails />

    <PageContainer>
      <Tabs
        :tabs="data.tabs"
      >
        <template
          #button
        >
          <NuxtLink
            to="/collections/1"
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
    </PageContainer>
  </PageRoot>
</template>

