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
        chainid
        code
        createdAt
        continuation
        creationtime
        data
        gas
        gaslimit
        gasprice
        id
        metadata
        logs
        nonce
        nodeId
        numEvents
        pactid
        payloadHash
        proof
        requestkey
        result
        sender
        rollback
        step
        ttl
        txid
        updatedAt
        eventsByTransactionId {
          nodes {
            chainid
            createdAt
            id
            module
            name
            modulehash
            nodeId
            params
            paramtext
            payloadHash
            qualname
            requestkey
            transactionId
            updatedAt
          }
        }
        transfersByTransactionId {
          nodes {
            amount
            chainid
            createdAt
            fromAcct
            modulehash
            id
            nodeId
            modulename
            requestkey
            payloadHash
            toAcct
            tokenId
            transactionId
            updatedAt
          }
        }
      }
    }
    allBlocks(last: 5) {
      nodes {
        adjacents
        chainId
        chainwebVersion
        createdAt
        creationTime
        epochStart
        featureFlags
        hash
        height
        id
        nodeId
        nonce
        parent
        payloadHash
        target
        updatedAt
        weight
        transactionsByBlockId {
          totalCount
        }
      }
    }
  }
`

const { data } = await useAsyncData('GetLastBlockAndTransaction', async () => {
  const [
    graphqlRes,
    tokenDataRes,
    tokenChartDataRes,
  ] = await Promise.all([
    $graphql.default.request(query),
    fetch('https://api.coingecko.com/api/v3/coins/kadena?x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC'),
    fetch('https://api.coingecko.com/api/v3/coins/kadena/market_chart?vs_currency=usd&days=14&interval=daily&x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC')
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

</script>

<template>
  <div
    class="flex flex-col gap-10 pt-10"
  >
    <div
      class="flex gap-2 items-center justify-between bg-[linear-gradient(180deg,_#01D796_0%,_#009367_105.48%)] rounded-2xl py-[52px] px-[48px]"
    >
      <div
        class="flex flex-col justify-between gap-6 w-full"
      >
        <h1
          class="font-title text-font-400 text-[40px] font-[700] leading-[140%]"
        >
          Explore Kadena Blockchain
        </h1>

        <Search />
      </div>

      <div
        class="bg-gray-800 rounded-xl w-full max-w-[420px] h-[132px]"
      />
    </div>

    <div
      class="rounded-2xl bg-gray-800 p-8 gap-6 grid grid-cols-2"
    >
      <div
        class="
          p-4 gap-4 flex-grow grid grid-cols-2 bg-gray-700 rounded-xl
        "
      >
        <HomeChartCard
          :label="data?.token.name + ' Price'"
          :description="moneyCompact.format(data?.token.market_data.current_price.usd)"
          :delta="data?.token.market_data.price_change_percentage_24h_in_currency.usd"
        />

        <HomeChartCard
          isDark
          label="Total Volume"
          :description="moneyCompact.format(data?.token.market_data.total_volume.usd)"
        />

        <HomeChartCard
          label="Market Capital"
          :description="moneyCompact.format(data?.token.market_data.market_cap.usd)"
        />

        <HomeChartCard
          label="Circulating Supply"
          :description="moneyCompact.format(data?.token.market_data.circulating_supply)"
        />
      </div>

      <div
        class="w-full h-full flex flex-col gap-6"
      >
        <span
          class="text-font-400"
        >
          Total transactions history in 14 days
        </span>

        <div
          class="h-full"
        >
          <Chart
            v-bind="data?.chartData"
          />
        </div>
      </div>
    </div>

    <div
      class="grid grid-cols-2 gap-6"
    >
      <HomeTransactions
        :data="data?.transactions"
      />

      <HomeBlocks
        :data="data?.blocks"
      />
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
