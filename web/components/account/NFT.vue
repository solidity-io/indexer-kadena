<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

const props = defineProps<{
  address: string;
}>()

const {
  blockchainTooltipData,
  blockTransactionsTableColumns
} = useAppConfig()

const query = gql`
  query GetNftBalances($first: Int, $offset: Int, $account: String!) {
    allBalances(offset: $offset, orderBy: ID_DESC, first: $first, condition: {account: $account, hasTokenId: true}) {
      nodes {
        updatedAt
        tokenId
        qualname
        nodeId
        network
        module
        id
        hasTokenId
        createdAt
        contractId
        chainId
        balance
        account
      }
      totalCount
    }
  }
`

const {
  page,
  limit,
  updatePage,
} = usePagination(10);

const { $graphql } = useNuxtApp();

const key = 'allBalances'

const { data: nfts, pending } = useAsyncData('all-nft-balances', async () => {
  const res = await $graphql.default.request(query, {
    first: limit.value,
    offset: (page.value - 1) * 10,
    account: props.address,
  });

  const totalPages = Math.max(Math.ceil(res[key].totalCount / limit.value), 1)

  return {
    ...res[key],
    totalPages
  };
}, {
  watch: [page]
});
</script>

<template>
  <div>
    <TableNft
      :pending="pending"
      :items="nfts?.nodes ?? []"
    >
      <template
        #empty
      >
        <EmptyTable
          image="/empty/txs.png"
          title="No NFTs found yet"
          description="We couldn't find any nft"
        />
      </template>

      <template
        #footer
      >
        <PaginateTable
          itemsLabel="NFT's"
          :currentPage="page"
          :totalItems="nfts?.totalCount ?? 1"
          :totalPages="nfts?.totalPages"
          @pageChange="updatePage(Number($event))"
        />
      </template>
    </TableNft>
  </div>
</template>
