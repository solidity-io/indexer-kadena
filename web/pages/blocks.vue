<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Blocks'
})

const {
  blocks,
  blocksTableColumns
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
        Blocks
      </h1>
    </div>

    <div
      class="grid grid-cols-4 gap-6"
    >
      <Card
        float="+2,02%"
        description="1,227,000"
        label="Mined Blocks"
      />

      <Card
        float="19.56%"
        description="676.74 KDA"
        label="Transactions per Block"
      />

      <Card
        float="28.71%"
        description="19.51 KDA"
        label="Avg. Transaction Fee (24h)"
      />

      <Card
        suffix="(Average)"
        description="176,299"
        label="Last Mined Block Height "
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
        :rows="blocks"
        :columns="blocksTableColumns"
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
