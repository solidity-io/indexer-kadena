<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Blocks'
})

const {
  blocksTableColumns
} = useAppConfig()

const query = gql`
  query GetBlocks($first: Int, $offset: Int) {
    allBlocks(offset: $offset, orderBy: ID_DESC, first: $first) {
      nodes {
        chainId
        coinbase
        createdAt
        hash
        height
        id
        nodeId
        minerData
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
  data: blocks,
} = await usePaginate({
  query,
  key: 'allBlocks'
})
</script>

<template>
  <PageRoot>
    <PageTitle>
      Blocks
    </PageTitle>

    <!-- <div
      class="grid gap-3 bazk:grid-cols-4 bazk:gap-6"
    >
      <Card
        :description="integer.format(blocks.totalCount)"
        label="Mined Blocks"
      />

      <Card
        label="Todo"
        description="-"
      />

      <Card
        label="Todo"
        description="-"
      />

      <Card
        :description="integer.format(blocks.totalCount - 1)"
        label="Last Mined Block Height"
      />
    </div> -->

    <TableContainer>
      <TableRoot
        :pending="pending"
        title="Recent Blocks"
        :rows="blocks?.nodes || []"
        :columns="blocksTableColumns"
      >
        <template
          #empty
        >
          <EmptyTable
            image="/empty/txs.png"
            title="No recent blocks found yet"
            description="We couldn't find any recent blocks"
          />
        </template>

        <template #fees="{ row }">
          <ColumnBlockFees
            v-bind="row"
          />
        </template>

        <template #hash="{ row }">
          <span
            class="max-w-[200px] text-font-450 text-sm block truncate"
          >
            {{ row.hash }}
          </span>
        </template>

        <template #height="{ row }">
          <ColumnLink
            :to="`/blocks/chain/${row.chainId}/height/${row.height}`"
            :label="row.height"
          />
        </template>

        <template #miner="{ row }">
          <ColumnMiner
            :minerData="row.minerData"
          />
        </template>

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

        <template #icon>
          <div
            class="w-6 h-full group hover:bg-gray-500 rounded grid items-center justify-center"
          >
            <IconEye
              class="mx-auto text-white group-hover:text-kadscan-500 transition"
            />
          </div>
        </template>

        <template
          #footer
        >
          <PaginateTable
            itemsLabel="Blocks"
            :currentPage="page"
            :totalItems="blocks.totalCount ?? 1"
            :totalPages="blocks.totalPages"
            @pageChange="page = Number($event)"
          />
        </template>
      </TableRoot>
    </TableContainer>
  </PageRoot>
</template>
