<script setup lang="ts">
const {
  tokenDetailTransferTableColumns
} = useAppConfig()

const rows = [
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    icon: '/tokens/kadena.svg',
    amount: '0.99158 KDA',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    amount: '0.99158 KDA',
    icon: '/tokens/kadena.svg',
    createdAt: 1712954633979,
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
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
