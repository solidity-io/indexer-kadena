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
        contractByContractId {
          metadata
          precision
          tokenId
          nodeId
          module
          chainId
          createdAt
          updatedAt
          type
        }
      }
      totalCount
    }
  }
`

const data = reactive({
  page: 1,
  limit: 10
})

const { $graphql } = useNuxtApp();

const key = 'allBalances'

//k:48704163cc65e8eea903b9ff6b48a8d905a2aa6c7e9d512607c84f7dc98cfbd2

const { data: nfts, pending } = useAsyncData('all-nft-balances', async () => {
  const res = await $graphql.default.request(query, {
    first: data.limit,
    offset: (data.page - 1) * 10,
    account: props.address,
  });

  const totalPages = Math.max(Math.ceil(res[key].totalCount / data.limit), 1)

  return {
    ...res[key],
    totalPages
  };
}, {
  watch: [() => data.page]
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
          :currentPage="data.page"
          :totalItems="nfts?.totalCount ?? 1"
          :totalPages="nfts?.totalPages"
          @pageChange="data.page = Number($event)"
        />
      </template>
    </TableNft>
  </div>
</template>
