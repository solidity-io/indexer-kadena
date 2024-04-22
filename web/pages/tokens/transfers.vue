<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Token Transfers'
})

const {
  tokenTransfersTableColumns
} = useAppConfig()

const query = gql`
  query GetTokenTransfers($first: Int, $offset: Int) {
    allTransfers(condition: {tokenId: null}, offset: $offset, orderBy: ID_DESC, first: $first) {
      nodes {
        tokenId
        updatedAt
        transactionId
        toAcct
        requestkey
        payloadHash
        nodeId
        modulehash
        modulename
        id
        chainid
        createdAt
        fromAcct
        amount
        transactionByTransactionId {
          nodeId
        }
      }
      pageInfo {
        startCursor
        hasPreviousPage
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`

const {
  page,
  pending,
  data: transfers,
} = await usePaginate({
  query,
  key: 'allTransfers'
})
</script>

<template>
  <div
    class="flex flex-col gap-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Token Transfers
      </h1>
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
          Latest Transactions
        </span>
      </div>

      <Table
        :pending="pending"
        :rows="transfers.nodes"
        :columns="tokenTransfersTableColumns"
      >
        <template #method>
          <Chip />
        </template>

        <template #requestkey="{ row }">
          <ColumnLink
            :label="row.requestkey"
            :to="`/transactions/${row.transactionByTransactionId.nodeId}`"
          />
        </template>

        <template #from="{ row }">
          <ColumnAddress
            :value="row.fromAcct"
          />
        </template>

        <template #to="{ row }">
          <ColumnAddress
            :value="row.toAcct"
          />
        </template>

        <template #token="{ row }">
          <ColumnToken
            id="todo"
            icon="/tokens/kadena.svg"
            name="todo"
            symbol="todo"
          />
        </template>

        <template #date="{ row }">
          <ColumnDate
            :row="row"
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
        itemsLabel="Transfers"
        :currentPage="page"
        :totalItems="transfers?.totalCount ?? 1"
        :totalPages="transfers?.totalPages"
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
