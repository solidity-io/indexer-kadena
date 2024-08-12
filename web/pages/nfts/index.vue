<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'NFT Transfers'
})

const {
  nftTransfersTableColumns
} = useAppConfig()

const query = gql`
  query GetNftTransfers($first: Int, $offset: Int) {
    allTransfers(
      condition: {type: "poly-fungible"}
      offset: $offset
      orderBy: ID_DESC
      first: $first
    ) {
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
        contractByContractId {
          id
          metadata
          module
          tokenId
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
  limit,
  updatePage,
} = usePagination();

const { $graphql } = useNuxtApp();

const key = 'allTransfers'

const { data: transfers, pending, error } = useAsyncData('all-nft-transfers', async () => {
  const res = await $graphql.default.request(query, {
    first: limit.value,
    offset: (page.value - 1) * 20,
  });

  const totalPages = Math.max(Math.ceil(res[key].totalCount / limit.value), 1)

  return {
    ...res[key],
    totalPages
  };
}, {
  watch: [page]
});

console.log('nft:transfers', transfers.value)
</script>

<template>
  <PageRoot
    :error="error"
  >
    <PageTitle>
      NFT Transfers
    </PageTitle>

    <TableContainer>
      <TableRoot
        title="Latest Transactions"
        :pending="pending"
        :rows="transfers?.nodes || []"
        :columns="nftTransfersTableColumns"
      >
        <template #method>
          <Chip />
        </template>

        <template #hash="{ row }">
          <ColumnLink
            withCopy
            :label="row.requestkey"
            :to="`/transactions/${row.requestkey}`"
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

        <template #date="{ row }">
          <ColumnDate
            :row="row"
          />
        </template>

        <template #item="{ row }">
          <ColumnNft
            :contract="row.contractByContractId"
          />
        </template>

        <template #icon="{ row }">
          <EyeLink
            :to="`/transactions/${row.requestkey}`"
          />
        </template>

        <template
          #empty
        >
          <EmptyTable
            image="/empty/txs.png"
            title="No latest transfers found yet"
            description="We couldn't find any latest transfers"
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
            @pageChange="updatePage(Number($event))"
          />
        </template>
      </TableRoot>
    </TableContainer>
  </PageRoot>
</template>
