<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Kadscan'
})

const defaultChartData = {
  market_caps: [],
  prices: [],
  total_volumes: []
}

const { $graphql, $coingecko } = useNuxtApp();

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
        sender
        gas
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
        coinbase
        minerData
      }
    }
  }
`

const { data, error } = await useAsyncData('GetChartData', async () => {
  const [
    apiRes,
    token,
    chartData,
  ] = await Promise.all([
    $graphql.default.request(query),
    $coingecko.request('coins/kadena'),
    $coingecko.request('coins/kadena/market_chart', {
      days: 14,
      interval: 'daily',
      vs_currency: 'usd',
    })
  ])

  console.log('token', token)
  console.log('chatData', chartData)

  return {
    token,
    chartData,
    ...apiRes
  };
});
</script>

<template>
  <div
    class="flex flex-col gap-4 lg:gap-10 lg:pt-4"
  >
    <HomeHero />

    <Container
      class="lg:!p-8 gap-4 lg:gap-6 grid lg:grid-cols-2"
    >
      <div
        class="
          p-3 lg:p-4 gap-2 lg:gap-4 flex-grow grid lg:grid-cols-2 bg-gray-700 rounded-lg lg:rounded-xl
        "
      >
        <HomeCard
          :label="data?.token?.name + ' Price'"
          :description="moneyCompact.format(data?.token?.market_data?.current_price?.usd || 0)"
          :delta="data?.token?.market_data?.price_change_percentage_24h_in_currency?.usd || 0"
        />

        <HomeCard
          isDark
          label="Total Volume"
          :description="moneyCompact.format(data?.token?.market_data?.total_volume?.usd || 0)"
        />

        <HomeCard
          label="Market Capital"
          :description="moneyCompact.format(data?.token?.market_data?.market_cap?.usd || 0)"
        />

        <HomeCard
          label="Circulating Supply"
          :description="moneyCompact.format(data?.token?.market_data?.circulating_supply || 0)"
        />
      </div>

      <div
        class="w-full h-full flex flex-col gap-3 lg:gap-6"
      >
        <span
          class="text-font-400"
        >
          Total transactions history in 14 days
        </span>

        <div
          class="h-full max-h-[216px]"
        >
          <Chart
            v-bind="data?.chartData || defaultChartData"
          />
        </div>
      </div>
    </Container>

    <div
      v-if="data?.allTransactions"
      class="grid lg:grid-cols-2 gap-4 lg:gap-6"
    >
      <HomeList
        label="Recent Transactions"
        path="/transactions"
      >
        <HomeTransaction
          v-bind="transaction"
          :key="transaction.requestKey"
          v-for="transaction in data?.allTransactions?.nodes"
        />
      </HomeList>

      <HomeList
        label="Recent Blocks"
        path="/blocks"
      >
        <HomeBlock
          v-bind="block"
          :key="block.hash"
          v-for="block in data?.allBlocks?.nodes"
        />
      </HomeList>
    </div>
  </div>
</template>
