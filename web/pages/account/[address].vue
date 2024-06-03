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

// k:5adb16663073280acf63bc2a4bf477ad1391736dcd6217b094926862c72d15c9
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


const { $graphql } = useNuxtApp();

const { data: rawBalances } = await useAsyncData('allBalances', async () => {
  const {
    allBalances
  } = await $graphql.default.request(query, {
    // account: "k:5adb16663073280acf63bc2a4bf477ad1391736dcd6217b094926862c72d15c9",
    account: address,
  });

  return allBalances
});

const balances = formatBalances(rawBalances.value.nodes)

console.log('balances', balances)
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

console.log('address', address)
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
