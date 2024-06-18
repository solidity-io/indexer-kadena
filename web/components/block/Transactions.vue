<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

const props = defineProps<{
  hash: string;
  id: number,
  chainId: number,
}>()

const {
  blockchainTooltipData,
  blockTransactionsTableColumns
} = useAppConfig()

const query = gql`
  query GetTransactions($first: Int, $offset: Int, $blockId: Int, $chainId: Int) {
    allTransactions(offset: $offset, orderBy: ID_DESC, first: $first, condition: {blockId: $blockId, chainId: $chainId}) {
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
    blockId: Number(props.id),
    chainId: Number(props.chainId)
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
  <PageRoot>
    <LabelValue
      withCopy
      label="Block Hash"
      :value="hash"
      :description="blockchainTooltipData.block.transactions.blockHash"
    />

    <div
      class="py-3 md:p-6 rounded-lg md:rounded-2xl border border-gray-300"
    >
      <TableRoot
        :pending="pending"
        :rows="transactions?.nodes ?? []"
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
            class="w-6 h-6 group hover:bg-gray-500 rounded grid items-center justify-center"
          >
            <IconEye
              class="mx-auto -rotate-90 text-white group-hover:text-kadscan-500 transition"
            />
          </div>
        </template>

        <template
          #empty
        >
          <EmptyTable
            image="/empty/txs.png"
            title="No transactions found yet"
            description="We couldn't find any recent transactions"
          />
        </template>

        <template
          #footer
        >
          <PaginateTable
            :currentPage="data.page"
            :totalItems="transactions?.totalCount ?? 1"
            :totalPages="transactions?.totalPages"
            @pageChange="data.page = Number($event)"
            class="p-3"
          />
        </template>
      </TableRoot>
    </div>
  </PageRoot>
</template>
