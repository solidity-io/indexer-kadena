<script setup lang="ts">
// import { gql } from 'nuxt-graphql-request/utils';
import { TabPanel } from '@headlessui/vue'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Account Details'
})

const data = reactive({
  tabs: [
    {
      key: 'assets',
      label: 'Assets',
    },
    {
      key: 'nft',
      label: 'NFT',
    },
    {
      key: 'transactions',
      label: 'Transactions',
    },
    {
      key: 'statement',
      label: 'Account Statement',
    },
  ],
})
</script>

<template>
  <PageRoot>
    <PageTitle>
      Account Details
    </PageTitle>

    <PageContainer>
      <AccountDetails />
    </PageContainer>

    <PageContainer>
      <Tabs
        :tabs="data.tabs"
      >
        <TabPanel>
          <AccountAssets />
        </TabPanel>

        <TabPanel>
          <AccountNFT />
        </TabPanel>

        <TabPanel>
          <AccountTransactions />
        </TabPanel>

        <TabPanel>
          <AccountStatement />
        </TabPanel>
      </Tabs>
    </PageContainer>
  </PageRoot>
</template>
