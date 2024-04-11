<script setup lang="ts">
// defineProps<{
//   transaction: any
// }>()

const {
  blockTransactionsTableColumns
} = useAppConfig()

const data = reactive({
  currentPage: 1,
  totalPages: 15,
})
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <LabelValue
      withCopy
      label="Block Hash"
      value="ghJ3vFyrqesnscMzMga7HtSrzEsAf93MCfYq63QaPUY"
    />

    <div
      class="p-6 rounded-2xl border border-gray-300"
    >
      <Table
        :rows="[]"
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
            class="flex items-center justify-center"
          >
            <IconEye />
          </div>
        </template>
      </Table>

      <PaginateTable
        itemsLabel="Transactions"
        :totalItems="150"
        :currentPage="data.currentPage"
        :totalPages="data.totalPages"
        @pageChange="data.currentPage = $event"
      />
    </div>
  </div>
</template>
