<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Kadscan'
})

const { $graphql } = useNuxtApp();

const query = gql`
  query GetLastBlockAndTransaction {
    allTransactions(last: 5) {
      nodes {
        chainId
        createdAt
        id
        metadata
        nodeId
        numEvents
        requestkey
        result
        transfersByTransactionId {
          nodes {
            amount
            fromAcct
            modulename
            toAcct
            tokenId
          }
        }
      }
    }
    allBlocks(last: 5) {
      nodes {
        chainId
        parent
        createdAt
        hash
        height
        id
        nodeId
        minerData
        transactionsByBlockId {
          totalCount
        }
      }
    }
  }
`

const { data, error } = await useAsyncData('GetLastBlockAndTransaction', async () => {
  const [
    graphqlRes,
    tokenDataRes,
    tokenChartDataRes,
  ] = await Promise.all([
    $graphql.default.request(query),
    fetch('https://api.coingecko.com/api/v3/coins/kadena?x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC'),
    fetch('https://api.coingecko.com/api/v3/coins/kadena/market_chart?vs_currency=usd&days=14&interval=daily&x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC'),
  ])

  const token = await tokenDataRes.json()
  const chartData = await tokenChartDataRes.json()

  return {
    token,
    chartData,
    blocks: graphqlRes.allBlocks,
    transactions: graphqlRes.allTransactions
  };
});

console.log('error', error.value)
</script>

<template>
  <div
    class="flex flex-col gap-4 bazk:gap-10 bazk:pt-4"
  >
    <HomeHero />

    <Container
      class="bazk:p-8 gap-4 bazk:gap-6 grid bazk:grid-cols-2"
    >
      <div
        class="
          p-3 bazk:p-4 gap-2 bazk:gap-4 flex-grow grid bazk:grid-cols-2 bg-gray-700 rounded-lg bazk:rounded-xl
        "
      >
        <HomeCard
          :label="data?.token.name + ' Price'"
          :description="moneyCompact.format(data?.token.market_data?.current_price.usd)"
          :delta="data?.token.market_data.price_change_percentage_24h_in_currency.usd"
        />

        <HomeCard
          isDark
          label="Total Volume"
          :description="moneyCompact.format(data?.token.market_data.total_volume.usd)"
        />

        <HomeCard
          label="Market Capital"
          :description="moneyCompact.format(data?.token.market_data.market_cap.usd)"
        />

        <HomeCard
          label="Circulating Supply"
          :description="moneyCompact.format(data?.token.market_data.circulating_supply)"
        />
      </div>

      <div
        class="w-full h-full flex flex-col gap-3 bazk:gap-6"
      >
        <span
          class="text-font-400"
        >
          Total transactions history in 14 days
        </span>

        <div
          class="h-full min-h-[216px]"
        >
          <Chart
            v-bind="data?.chartData"
          />
        </div>
      </div>
    </Container>

    <div
      v-if="!error"
      class="grid bazk:grid-cols-2 gap-4 bazk:gap-6"
    >
      <HomeList
        label="Recent Transactions"
        path="/transactions"
      >
        <HomeTransaction
          v-bind="transaction"
          :key="transaction.requestKey"
          v-for="transaction in data?.transactions?.nodes"
        />
      </HomeList>

      <HomeList
        label="Recent Blocks"
        path="/blocks"
      >
        <HomeBlock
          v-bind="block"
          :key="block.hash"
          v-for="block in data?.blocks?.nodes"
        />
      </HomeList>
    </div>
  </div>
</template>
