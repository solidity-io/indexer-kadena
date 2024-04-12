<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

useHead({
  title: 'NFT Transfers'
})

const {
  nftTransfersTableColumns
} = useAppConfig()

const rows = [
  {
    createdAt: 1712954633979,
    name: 'The Angel Doggos',
    collection: 'Hack a Collection',
    image: '/collection/doggos.png',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Kadena Bears',
    image: '/collection/bears.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Brawler Bears',
    image: '/collection/brwalers.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Boxing Badger',
    image: '/collection/badger.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Kadena Mining Club',
    image: '/collection/mining.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Kadena Komodos',
    image: '/collection/komodos.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'JODIE INU',
    image: '/collection/inu.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'INU Crew',
    image: '/collection/inu.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Eighties Bulls',
    image: '/collection/bulls.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
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
        NFT Transfers
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
        :columns="nftTransfersTableColumns"
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

        <template #date="{ row }">
          <ColumnDate
            :row="row"
          />
        </template>

        <template #item="{ row }">
          <ColumnNft
            v-bind="row"
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
