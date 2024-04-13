<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Token Transfers'
})

const {
  tokenTransfersTableColumns
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
    class="flex flex-col gap-6 pt-6"
  >
    <div>
      <h1
        class="text-[28px] font-semibold leading-[150%] text-font-400"
      >
        Token Transfers
      </h1>
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
          Latest Transactions
        </span>
      </div>

      <Table
        :class="data.pending && 'bg-white'"
        :rows="rows"
        :columns="tokenTransfersTableColumns"
      >
        <template #method>
          <Chip />
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

        <template #token="{ row }">
          <ColumnToken
            v-bind="row"
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
      </Table>

      <PaginateTable
        :currentPage="data.page"
        :totalItems="data.totalCount ?? 1"
        :totalPages="data.totalPages"
        @pageChange="data.page = Number($event)"
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
