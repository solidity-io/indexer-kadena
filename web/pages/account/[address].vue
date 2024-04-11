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

// const query = gql`
//   query GetTransactionById($id: ID!) {
//     transaction(nodeId: $id) {
//       chainid
//       continuation
//       code
//       createdAt
//       creationtime
//       gas
//       data
//       gasprice
//       gaslimit
//       updatedAt
//       txid
//       step
//       rollback
//       ttl
//       sender
//       result
//       proof
//       requestkey
//       payloadHash
//       pactid
//       numEvents
//       nodeId
//       nonce
//       logs
//       metadata
//       id
//     }
//   }
// `

// const route = useRoute()

// const { $graphql } = useNuxtApp();

// const { data: transaction } = await useAsyncData('GetTransactionById', async () => {
//   const {
//     transaction
//   } = await $graphql.default.request(query, {
//     id: route.params.requestKey,
//   });

//   return transaction
// });
</script>

<template>
  <div
    class="flex flex-col gap-6 pt-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Account Details
      </h1>
    </div>

    <div
      class="
        p-8
        bg-gray-800
        rounded-2xl
      "
    >
      <AccountDetails />
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
