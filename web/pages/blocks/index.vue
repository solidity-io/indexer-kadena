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
        adjacents
        chainId
        chainwebVersion
        coinbase
        createdAt
        creationTime
        epochStart
        featureFlags
        hash
        height
        id
        nodeId
        minerData
        nonce
        outputsHash
        parent
        payloadHash
        target
        updatedAt
        weight
        transactionsHash
        transactionsByBlockId {
          totalCount
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
  data: blocks,
} = await usePaginate({
  query,
  key: 'allBlocks'
})

console.log("blocks", blocks.value)
</script>

<template>
  <PageRoot>
    <PageTitle>
      Blocks
    </PageTitle>

    <div
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
    </div>

    <PageContainer>
      <TableRoot
        :pending="pending"
        :rows="blocks.nodes"
        title="Recent Blocks"
        :columns="blocksTableColumns"
      >
        <template #todo>
          -
        </template>

        <template #height="{ row }">
          <ColumnLink
            :to="`/blocks/${row.nodeId}`"
            :label="row.height"
          />
        </template>

        <template #transactions="{ row }">
          {{ row.transactionsByBlockId.totalCount }}
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
            class="flex items-center justify-center"
          >
            <IconEye />
          </div>
        </template>
      </TableRoot>

      <PaginateTable
        itemsLabel="Blocks"
        :currentPage="page"
        :totalItems="blocks.totalCount ?? 1"
        :totalPages="blocks.totalPages"
        @pageChange="page = Number($event)"
      />
    </PageContainer>
  </PageRoot>
</template>
