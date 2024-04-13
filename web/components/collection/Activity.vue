<script setup lang="ts">
const {
  collectionActivityTableColumns
} = useAppConfig()

const rows = [
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    createdAt: 1712954633979,
    name: 'The Angel Doggos',
    collection: 'Hack a Collection',
    image: '/collection/doggos.png',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Kadena Bears',
    image: '/collection/bears.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Brawler Bears',
    image: '/collection/brwalers.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Boxing Badger',
    image: '/collection/badger.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Kadena Mining Club',
    image: '/collection/mining.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Kadena Komodos',
    image: '/collection/komodos.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'JODIE INU',
    image: '/collection/inu.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'INU Crew',
    image: '/collection/inu.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Eighties Bulls',
    image: '/collection/bulls.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
    name: 'Dadbod #999999',
    image: '/collection/dadbod.png',
    createdAt: 1712954633979,
    collection: 'Hack a Collection',
    hash: 'bOSdGKpPS5OYiF2HgVc_dBQPPfj-b_LuVbEnXnuDL1Q',
    to: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
    from: 'k:685357523ce9b43de4fa5b1e7041afa19df3e40e43d7e8f9cf2e1175a95835b7',
  },
  {
    amount: "10,21 KDA",
    dollar: "$ 1,55",
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
    class="border border-gray-300 rounded-2xl p-6"
  >
    <Table
      :class="data.pending && 'bg-white'"
      :rows="rows"
      :columns="collectionActivityTableColumns"
    >
      <template #price="{ row }">
        <ColumnPrice
          v-bind="row"
        />
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
</template>
