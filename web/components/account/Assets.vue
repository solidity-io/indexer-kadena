<script setup lang="ts">
const {
  assetsTableColumns
} = useAppConfig()

const data = reactive({
  currentPage: 1,
  totalPages: 15,
})

const assets = [
  {
    isUp: true,
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    icon: '/tokens/kadena.svg',
    quantity: '25255.368749816492',
    price: '$1.740',
    float: '19.56%',
    value: '$43944.342'
  },
  {
    isUp: false,
    key: 'kaddex',
    name: 'KAddex',
    symbol: 'KDX',
    icon: '/tokens/kaddex.svg',
    quantity: '199.454',
    price: '$1.310',
    float: '2,10%',
    value: '$24841.689'
  },
  {
    name: 'Crankk',
    symbol: 'CRKK',
    icon: '/tokens/crankk.svg',
    quantity: '198.877893',
    price: null,
    float: null,
    value: null
  }
]
</script>

<template>
  <div>
    <div
      class="p-6 rounded-2xl border border-gray-300"
    >
      <Table
        :rows="assets"
        :columns="assetsTableColumns"
      >
        <template #asset="{ row }">
          <ColumnToken
            v-bind="row"
          />
        </template>

        <template #distribution>
          <IconArrow
            class="mx-auto -rotate-90"
          />
        </template>
      </Table>

      <PaginateTable
        itemsLabel="Tokens"
        :totalItems="180"
        :currentPage="data.currentPage"
        :totalPages="data.totalPages"
        @pageChange="data.currentPage = $event"
      />
    </div>
  </div>
</template>
