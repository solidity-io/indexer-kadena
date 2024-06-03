<script setup lang="ts">
defineProps<{
  address: string,
  balances: any[]
}>()

const {
  assetsTableColumns,
  assetsTableSubColumns
} = useAppConfig()

// const data = reactive({
//   currentPage: 1,
//   totalPages: 15,
// })
</script>

<template>
  <div
    class="py-3 bazk:p-6 rounded-lg bazk:rounded-2xl border border-gray-300"
  >
    <TableRoot
      :rows="balances"
      :columns="assetsTableColumns"
    >
      <template #row="{ row, columns, rowIndex }">
        <TableRowExpansible
          :row="row"
          :columns="columns"
          :rowIndex="rowIndex"
          :subColumns="assetsTableSubColumns"
        >
          <template #asset="{ row }">
            <ColumnToken
              v-bind="row"
              :withSymbol="false"
              :icon="row.image"
            />
          </template>

          <template #symbol="{ row }">
            <span
              class="uppercase"
            >
              {{ row.symbol }}
            </span>
          </template>

          <template #price="{ row }">
            <span
              class="uppercase"
            >
              0
            </span>
          </template>

          <template #value="{ row }">
            <span
              class="uppercase"
            >
              0
            </span>
          </template>

          <template #distribution>
            <IconArrow
              class="mx-auto -rotate-90"
            />
          </template>
        </TableRowExpansible>
      </template>
    </TableRoot>

    <!-- <PaginateTable
      itemsLabel="Tokens"
      :totalItems="180"
      :currentPage="data.currentPage"
      :totalPages="data.totalPages"
      @pageChange="data.currentPage = $event"
    /> -->
  </div>
</template>
