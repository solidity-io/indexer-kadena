<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Block Details'
})

const data = reactive({
  tabs: [
    {
      key: 'overview',
      label: 'Overview',
    },
    {
      key: 'payload',
      label: 'Payload',
    },
    {
      key: 'output',
      label: 'Coinbase Output',
    },
    {
      key: 'block-transactions',
      label: 'Block Transactions',
    },
  ],
})

const query = gql`
  query GetBlockById($id: ID!) {
    block(nodeId: $id) {
      adjacents
      chainId
      createdAt
      chainwebVersion
      epochStart
      creationTime
      featureFlags
      hash
      height
      id
      nodeId
      nonce
      target
      parent
      payloadHash
      updatedAt
      weight
    }
  }
`

const route = useRoute()

const { $graphql } = useNuxtApp();

const { data: block } = await useAsyncData('GetBlockById', async () => {
  const {
    block
  } = await $graphql.default.request(query, {
    id: route.params.hash,
  });

  return block
});
</script>

<template>
  <div
    class="flex flex-col gap-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Block Details
      </h1>
    </div>

    <div
      class="
        p-8
        bg-gray-800
        rounded-2xl
      "
    >
      <BlockDetails
        v-bind="block"
      />
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
          <BlockOverview
            v-bind="block"
          />
        </TabPanel>

        <TabPanel>
          <BlockPayload
            v-bind="block"
          />
        </TabPanel>

        <TabPanel>
          <BlockOutput
            v-bind="block"
          />
        </TabPanel>

        <TabPanel>
          <BlockTransactions
            v-bind="block"
          />
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
