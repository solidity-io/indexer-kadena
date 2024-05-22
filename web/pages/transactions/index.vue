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
        chainId
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
        blockId
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

// const { data: blockchain } = await useAsyncData('transactions-blockchain', async () => {
//   const [
//     chainDataRes,
//   ] = await Promise.all([
//     fetch('https://api.coingecko.com/api/v3/coins/categories/kadena-ecosystem?x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC'),
//   ])

//   const kadena = await chainDataRes.json()

//   return {
//     kadena,
//   };
// });

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
  <PageRoot>
    <PageTitle>
      Transactions
    </PageTitle>

    <!-- <div
      class="grid gap-3 bazk:grid-cols-4 bazk:gap-6"
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
    </div> -->

    <PageContainer>
      <TableRoot
        title="Recent Transactions"
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
<!--
        <template #receiver="{ row }">
          <ColumnTxReceiver
            :row="row"
          />
        </template> -->

        <template #block="{ row }">
          <ColumnLink
            :to="`/blocks/${row.blockId ?? 'null'}`"
            :label="row.blockId ?? 'null'"
          />
        </template>

        <template #icon>
          <div
            class="flex items-center justify-center"
          >
            <IconEye />
          </div>
        </template>
      </TableRoot>

      <PaginateTable
        :currentPage="page"
        :totalItems="transactions.totalCount ?? 1"
        :totalPages="transactions.totalPages"
        @pageChange="page = Number($event)"
      />
    </PageContainer>
  </PageRoot>
</template>
