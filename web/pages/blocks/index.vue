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
        createdAt
        creationTime
        epochStart
        featureFlags
        hash
        height
        id
        nodeId
        nonce
        parent
        payloadHash
        target
        updatedAt
        weight
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
</script>

<template>
  <div
    class="flex flex-col gap-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Blocks
      </h1>
    </div>

    <div
      class="grid grid-cols-4 gap-6"
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

    <div
      class="bg-gray-800 p-6 rounded-2xl"
    >
      <div
        class="pb-6"
      >
        <span
          class="text-font-400 text-lg leading-[100%] font-semibold tracking-[0.36px]"
        >
          Recent Blocks
        </span>
      </div>

      <Table
        :pending="pending"
        :rows="blocks.nodes"
        :columns="blocksTableColumns"
      >
        <template #todo>
          -
        </template>

        <template #height="{ row }">
          <ColumnLink
            :to="`/blocks/${row.height}`"
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
      </Table>

      <PaginateTable
        itemsLabel="Blocks"
        :currentPage="page"
        :totalItems="blocks.totalCount ?? 1"
        :totalPages="blocks.totalPages"
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
