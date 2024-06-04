<script setup lang="ts">
defineProps<{
  address: string,
  balances: any
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
            <ColumnPrice
              :label="row.current_price"
              :delta="row.price_change_percentage_24h"
            />
          </template>

          <template #balance="{ row }">
            {{ integer.format(row.balance) }}
          </template>

          <template #value="{ row }">
            {{ row.current_price ? money.format(row.balance * row.current_price) : '-' }}
          </template>

          <template #distribution="{ open }">
            <div
              :class="[open && 'bg-gray-500']"
              class="w-8 h-8 group hover:bg-gray-500 rounded grid items-center justify-center"
            >
              <IconArrow
                :class="[open && 'rotate-90 text-kadscan-500']"
                class="mx-auto -rotate-90 group-hover:text-kadscan-500 transition"
              />
            </div>
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
