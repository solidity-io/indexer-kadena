<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'
import { gql } from 'nuxt-graphql-request/utils';
// import { convertArrayToCSV } from 'convert-array-to-csv'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Account Details'
})

const route = useRoute()

const {
  address
} = route.params

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
  query GetBalanceByAccount($account: String!) {
    allBalances(
      condition: {account: $account}
    ) {
      nodes {
        account
        balance
        chainId
        createdAt
        id
        module
        nodeId
        network
        qualname
        tokenId
        updatedAt
      }
    }
  }
`

const { $graphql, $coingecko } = useNuxtApp();

const { data: balances } = await useAsyncData('allBalances', async () => {
  const [
    apiRes,
    prices,
  ] = await Promise.all([
    $graphql.default.request(query, {
      // "k:faca5ae889fcbd144c908ba4757df4ee496aa849c52d6f30b5bf9e8a51ee3d81",
      account: address,
    }),
    $coingecko.request('coins/markets', {
      vs_currency: 'usd',
      category: 'kadena-ecosystem',
    })
  ])

  const {
    allBalances
  } = apiRes

  return  transformRawBalances({ allBalances, prices})
});

// const balances = transformRawBalances(apiData?.value)
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
      <AccountDetails
        :address="address"
        :balances="balances"
      />
    </PageContainer>

    <PageContainer>
      <Tabs
        :tabs="data.tabs"
      >
        <TabPanel>
          <AccountAssets
            :balances="balances"
            :address="(address as string)"
          />
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
