<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Transactions'
})

const {
  transactionTableColumns
} = useAppConfig()

const query = gql`
  query GetTransactions($first: Int, $offset: Int) {
    allTransactions(offset: $offset, orderBy: ID_DESC, first: $first) {
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
        transfersByTransactionId {
          nodes {
            amount
            chainid
            createdAt
            fromAcct
            id
            modulehash
            nodeId
            modulename
            payloadHash
            requestkey
            toAcct
            tokenId
            transactionId
            updatedAt
          }
        }
        blockByBlockId {
          height
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`

const { data: blockchain } = await useAsyncData('transactions-blockchain', async () => {
  const [
    chainDataRes,
  ] = await Promise.all([
    fetch('https://api.coingecko.com/api/v3/coins/categories/kadena-ecosystem?x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC'),
  ])

  const kadena = await chainDataRes.json()

  return {
    kadena,
  };
});

const {
  page,
  pending,
  data: transactions,
} = await usePaginate({
  query,
  key: 'allTransactions'
})
</script>

<template>
  <div
    class="flex flex-col gap-6 pt-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Transactions
      </h1>
    </div>

    <div
      class="grid grid-cols-4 gap-6"
    >
      <Card
        label="Market Capital"
        :description="moneyCompact.format(blockchain?.kadena.market_cap)"
      />

      <Card
        label="Volume (24h)"
        :description="moneyCompact.format(blockchain?.kadena.volume_24h)"
      />

      <Card
        description="-"
        label="Transactions (24h)"
      />

      <Card
        :description="transactions.totalCount ?? 0"
        label="Total transactions (All time)"
      />
    </div>

    <div
      class="bg-gray-800 p-6 rounded-2xl"
    >
      <div
        class="pb-6"
      >
        <span
          class="text-font-400 text-lg leading-[100%] font-semibold tracking-[0.36px]"
        >
          Recent Transactions
        </span>
      </div>

      <Table
        :pending="pending"
        :rows="transactions.nodes"
        :columns="transactionTableColumns"
      >
        <template #status="{ row }">
          <ColumnStatus
            :row="row"
          />
        </template>

        <template #requestKey="{ row }">
          <ColumnLink
            :label="row.requestkey"
            :to="`/transactions/${row.nodeId}`"
          />
        </template>

        <template #createdAt="{ row }">
          <ColumnDate
            :row="row"
          />
        </template>

        <template #sender="{ row }">
          <ColumnAddress
            :value="row.sender"
          />
        </template>

        <template #receiver="{ row }">
          <ColumnTxReceiver
            :row="row"
          />
        </template>

        <template #block="{ row }">
          <ColumnLink
            :to="`/blocks/${row.blockByBlockId?.height ?? 'null'}`"
            :label="row.blockByBlockId?.height ?? 'null'"
          />
        </template>

        <template #icon>
          <div
            class="flex items-center justify-center"
          >
            <IconEye />
          </div>
        </template>
      </Table>

      <PaginateTable
        :currentPage="page"
        :totalItems="transactions.totalCount ?? 1"
        :totalPages="transactions.totalPages"
        @pageChange="page = Number($event)"
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
