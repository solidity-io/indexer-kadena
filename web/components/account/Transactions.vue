<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

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
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <div
      class="p-6 rounded-2xl border border-gray-300"
    >
      <Table
        :pending="pending"
        :rows="transactions.nodes"
        :columns="transactionTableColumns"
      >
        <template #status="{ row }">
          <ColumnStatus
            :key="'status-' + row.requestkey"
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

        <template #receiver>
          <!-- <ColumnAddress
            value="TODO"
          /> -->
          <span>
            - todo -
          </span>
        </template>

        <template #block>
          <!-- <ColumnAddress
            value="TODO"
          /> -->
          <span>
            - todo -
          </span>
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
        itemsLabel="Transactions"
        :currentPage="page"
        :totalItems="transactions.totalCount ?? 1"
        :totalPages="transactions.totalPages"
        @pageChange="page = Number($event)"
      />
    </div>
  </div>
</template>
