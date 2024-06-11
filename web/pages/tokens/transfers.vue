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
        chainId
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
  <PageRoot>
    <PageTitle>
      Token Transfers
    </PageTitle>

    <PageContainer>
      <TableRoot
        title="Latest Transactions"
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
            v-bind="row"
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

        <template
          #empty
        >
          <EmptyTable
            image="/empty/txs.png"
            title="No latest token transactions found yet"
            description="We couldn't find any trending tokens"
          />
        </template>

        <template
          #footer
        >
          <PaginateTable
            itemsLabel="Transfers"
            :currentPage="page"
            :totalItems="transfers?.totalCount ?? 1"
            :totalPages="transfers?.totalPages"
            @pageChange="page = Number($event)"
          />
        </template>
      </TableRoot>
    </PageContainer>
  </PageRoot>
</template>
