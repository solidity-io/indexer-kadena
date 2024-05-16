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
      chainwebVersion
      coinbase
      createdAt
      creationTime
      epochStart
      minerData
      coinbase
      outputsHash
      transactionsHash
      featureFlags
      hash
      height
      id
      nodeId
      minerData
      nonce
      outputsHash
      parent
      payloadHash
      target
      updatedAt
      weight
      transactionsHash
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

console.log('block', block.value)
</script>

<template>
  <PageRoot>
    <PageTitle>
      Block Details
    </PageTitle>

    <PageContainer>
      <BlockDetails
        v-bind="block"
      />
    </PageContainer>

    <PageContainer>
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
    </PageContainer>
  </PageRoot>
</template>
