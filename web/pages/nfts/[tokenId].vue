<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';
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
      key: 'properties',
      label: 'Properties',
    },
    {
      disabled: true,
      key: 'activity',
      label: 'Activity',
    },
    {
      key: 'more',
      disabled: true,
      label: 'More from this Collection',
    },
  ],
})

const query = gql`
  query GetNftById($id: ID!) {
    contract(nodeId: $id) {
      chainId
      createdAt
      id
      metadata
      module
      network
      nodeId
      precision
      tokenId
      updatedAt
      type
    }
  }
`

const route = useRoute()

const { $graphql } = useNuxtApp();

const { data: nft } = await useAsyncData('GetNftById', async () => {
  const {
    contract
  } = await $graphql.default.request(query, {
    id: route.params.tokenId,
  });

  return contract
});
</script>

<template>
  <PageRoot>
    <NftDetails
      v-bind="nft"
    />

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
          <NftProperties
            v-bind="nft"
          />
        </TabPanel>

        <TabPanel>
          <NftActivity />
        </TabPanel>

        <TabPanel>
          <NftMore />
        </TabPanel>
      </Tabs>
    </PageContainer>
  </PageRoot>
</template>

