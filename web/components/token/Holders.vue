<script setup lang="ts">
const {
  holdersTableColumns
} = useAppConfig()

const rows = [
  {
    address: 'aurorafinance.sputnik-dao.kadena',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.5421,
  },
  {
    address: 'liquidity.nekotoken',
    quantity: '1,693,225,820',
    value: '$746,170.75',
    percentage: 0.1707,
  },
  {
    address: 'creators.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'cookie.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.13077,
  },
  {
    address: 'marketing.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'treasury.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'v2.ref-finance',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'minigame.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'coreteam.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'launchpad.jumpfinance',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'nftstaking.jumpfinance',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'thesolstice',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'do_not_fade_anon',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'fgt1.multisignature',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'vesting.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'ff.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'camchis1',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'cookiejar.nekotoken',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: '061d3a6cb4f6deeee1519225....',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  },
  {
    address: 'supermariorpg',
    quantity: '4,653,763,812.201',
    value: '$4,653,763,812.20',
    percentage: 0.093077,
  }
]

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
      :class="data.pending && 'bg-white'"
      :rows="rows"
      :columns="holdersTableColumns"
    >
      <template #percentage="{ row }">
        <ColumnPercentage
          :value="row.percentage"
        />
      </template>

      <template #ranking>
        1
      </template>
    </TableRoot>

    <PaginateTable
      class="px-3 bazk:px-0"
      :currentPage="data.page"
      :totalItems="data.totalCount ?? 1"
      :totalPages="data.totalPages"
      @pageChange="data.page = Number($event)"
    />
  </div>
</template>
