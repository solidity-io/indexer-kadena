<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'NFT Collections'
})

const {
  mockCollection,
  nftCollectionsTableColumns
} = useAppConfig()

const data = reactive({
  page: 1,
  totalPages: 1,
  pending: false,
  totalCount: 20,
})
</script>

<template>
  <PageRoot>
    <PageTitle>
      NFT Collections
    </PageTitle>

    <PageContainer>
      <TableRoot
        title="Trending Collections"
        :class="data.pending && 'bg-white'"
        :rows="mockCollection"
        :columns="nftCollectionsTableColumns"
      >
        <template #position>
          1
        </template>

        <template #collection="{ row }">
          <ColumnCollection
            v-bind="row"
          />
        </template>

        <template #volume="{ row }">
          <ColumnVolume
            v-bind="row"
          />
        </template>

        <template #delta="{ row }">
          <ColumnDelta
            v-bind="row"
          />
        </template>

        <template #floorPrice="{ row }">
          <ColumnVolume
            v-bind="row"
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
        :currentPage="data.page"
        :totalItems="data.totalCount ?? 1"
        :totalPages="data.totalPages"
        @pageChange="data.page = Number($event)"
      />
    </PageContainer>
  </PageRoot>
</template>
