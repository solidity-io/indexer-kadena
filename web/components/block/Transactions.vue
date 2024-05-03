<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

defineProps<{
  hash: string;
  nodeId: string;
}>()
const {
  blockTransactionsTableColumns
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
</script>

<template>
  <PageRoot>
    <LabelValue
      withCopy
      label="Block Hash"
      :value="hash"
    />

    <div
      class="py-3 bazk:p-6 rounded-lg bazk:rounded-2xl border border-gray-300"
    >
      <TableRoot
        :pending="pending"
        :rows="transactions.nodes"
        @rowClick="redirect"
        :columns="blockTransactionsTableColumns"
      >
        <template #status="{ row }">
          <ColumnStatus
            :key="'status-' + row.requestKey"
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
          <ColumnAddress
            :value="row.receiver"
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
        class="p-3"
      />
    </div>
  </PageRoot>
</template>
