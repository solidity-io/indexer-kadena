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

const {
  page,
  pending,
  data: transactions,
} = await usePaginate({
  query,
  key: 'allTransactions'
})

const redirect = (transaction: any) => {
  navigateTo({ path: `/transactions/${transaction.nodeId}` })
}

console.log('transactions,', transactions.value)
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
        float="+2,02%"
        description="1,227,000"
        label="KadenaTransactions (24h)"
      />

      <Card
        float="19.56%"
        description="676.74 KDA"
        label="Network transactions fee (24h)"
      />

      <Card
        float="28.71%"
        description="19.51 KDA"
        label="Avg. Transaction Fee (24h)"
      />

      <Card
        suffix="(Average)"
        description="176,299"
        label="Transactions Pending (Last 1H)"
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
        @rowClick="redirect"
      >
        <template #status="{ row }">
          <ColumnStatus
            :row="row"
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
          {{ row.blockByBlockId?.height ?? "null" }}
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
