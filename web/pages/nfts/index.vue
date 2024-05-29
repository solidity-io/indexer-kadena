<script setup lang="ts">
// import { gql } from 'nuxt-graphql-request/utils';
import { TabPanel } from '@headlessui/vue'
import { convertArrayToCSV } from 'convert-array-to-csv'

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

const { $graphql } = useNuxtApp();

const { data: nft } = await useAsyncData('GetNftById', async () => {
  const {
    nft
  } = await $graphql.default.request(query, {
    id: route.params.tokenId,
  });

  return nft
});

console.log('nft', nft.value)

// TODO: Check this approach, better if move that to a backend
// const download = () => {
//   try {
//     const csv = convertArrayToCSV(data.tabs)

//     const url = window.URL.createObjectURL(new Blob([csv]));

//     const link = document.createElement('a');

//     link.href = url;

//     link.setAttribute('download', 'dados.csv');

//     document.body.appendChild(link);

//     link.click();

//     document.body.removeChild(link);
//   } catch (error) {
//   console.error("Erro ao exportar CSV:", error);
//   }
// }
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
