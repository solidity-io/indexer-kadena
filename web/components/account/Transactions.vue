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
    class="py-3 bazk:p-6 rounded-lg bazk:rounded-2xl border border-gray-300"
  >
    <TableRoot
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
    </TableRoot>

    <PaginateTable
      itemsLabel="Transactions"
      :currentPage="page"
      class="px-3 bazk:px-0"
      :totalItems="transactions.totalCount ?? 1"
      :totalPages="transactions.totalPages"
      @pageChange="page = Number($event)"
    />
  </div>
</template>
