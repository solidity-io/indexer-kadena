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
      class="grid bazk:grid-cols-2 gap-4 bazk:gap-6"
    >
      <HomeList
        label="Recent Transactions"
        path="/transactions"
      >
        <HomeTransaction
          v-bind="transaction"
          :key="transaction.requestKey"
          v-for="transaction in data?.transactions.nodes"
        />
      </HomeList>

      <HomeList
        label="Recent Blocks"
        path="/blocks"
      >
        <HomeBlock
          v-bind="block"
          :key="block.hash"
          v-for="block in data?.blocks.nodes"
        />
      </HomeList>
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
