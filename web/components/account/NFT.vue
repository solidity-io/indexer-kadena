<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

defineProps<{
  hash: string;
}>()

const {
  blockchainTooltipData,
  blockTransactionsTableColumns
} = useAppConfig()

const query = gql`
  query GetTransactions($first: Int, $offset: Int) {
    allTransactions(offset: $offset, orderBy: ID_DESC, first: $first) {
      nodes {
        code
        result
        nodeId
        requestkey
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

const data = reactive({
  page: 1,
  limit: 20
})

const { $graphql } = useNuxtApp();

const key = 'allTransactions'

const { data: transactions, pending } = useAsyncData(key, async () => {
  const res = await $graphql.default.request(query, {
    first: data.limit,
    offset: (data.page - 1) * 20,
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
    <div
      class="
        gap-2
        bazk:gap-4
        grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 bazk:grid-cols-5
      "
    >
      <NftCard
        v-for="n in 10"
        :key="'nft-' + n"
        :id="n + ''"
        name="HC - Smoked  #823"
        collection="Hack a Collection"
      />
    </div>

    <PaginateTable
      itemsLabel="NFT's"
      :currentPage="1"
      :totalItems="150"
      :totalPages="10"
    />
  </div>
</template>
