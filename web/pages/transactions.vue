<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Transactions'
})

const {
  transactions,
  transactionTableColumns
} = useAppConfig()

const data = reactive({
  currentPage: 1,
  totalPages: 15,
})
</script>

<template>
  <div
    class="flex flex-col gap-6 pt-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Transactions
      </h1>
    </div>

    <div
      class="grid grid-cols-4 gap-6"
    >
      <Card
        float="+2,02%"
        description="1,227,000"
        label="KadenaTransactions (24h)"
      />

      <Card
        float="19.56%"
        description="676.74 KDA"
        label="Network transactions fee (24h)"
      />

      <Card
        float="28.71%"
        description="19.51 KDA"
        label="Avg. Transaction Fee (24h)"
      />

      <Card
        suffix="(Average)"
        description="176,299"
        label="Transactions Pending (Last 1H)"
      />
    </div>

    <div
      class="bg-gray-800 p-6 rounded-2xl"
    >
      <Table
        :rows="transactions"
        :columns="transactionTableColumns"
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
        :currentPage="data.currentPage"
        :totalPages="data.totalPages"
        @pageChange="data.currentPage = $event"
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
