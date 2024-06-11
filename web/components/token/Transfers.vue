<script setup lang="ts">
const {
  tokenDetailTransferTableColumns
} = useAppConfig()

const data = reactive({
  page: 1,
  totalPages: 1,
  pending: false,
  totalCount: 20,
})
</script>

<template>
  <div
    class="py-3 bazk:p-6 rounded-lg bazk:rounded-2xl border border-gray-300"
  >
    <TableRoot
      :rows="[]"
      :pending="false"
      id="token-transfers-table"
      :columns="tokenDetailTransferTableColumns"
    >
      <template #method>
        <Chip />
      </template>

      <template #block>
        4650805
      </template>

      <template #from="{ row }">
        <ColumnAddress
          :value="row.from"
        />
      </template>

      <template #to="{ row }">
        <ColumnAddress
          :value="row.to"
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
    </TableRoot>

    <PaginateTable
      :currentPage="data.page"
      :totalItems="data.totalCount ?? 1"
      :totalPages="data.totalPages"
      class="px-3 bazk:px-0"
      @pageChange="data.page = Number($event)"
    />
  </div>
</template>
