<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'NFT Collections'
})

const {
  nftCollectionsTableColumns
} = useAppConfig()

const rows = [
  {
    name: 'The Angel Doggos',
    amount: '76.51 ',
    currency: 'KDA',
    delta: -0.401,
    floor: "10",
    owners: '5,270',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/doggos.png',
  },
  {
    name: 'Kadena Bears',
    amount: '36.0279 ',
    currency: 'KDA',
    delta: 0.0383,
    floor: "2.326",
    owners: '2,270',
    transfers: '10,000',
    assets: '17,719',
    icon: '/collection/bears.png',
  },
  {
    name: 'Brawler Bears',
    amount: '29.1683 ',
    currency: 'KDA',
    delta: 0.498,
    floor: "0.000",
    owners: '270',
    transfers: '20,000',
    assets: '17,719',
    icon: '/collection/brwalers.png',
  },
  {
    name: 'Boxing Badger',
    amount: '25.15 ',
    currency: 'KDA',
    delta: 0.1864,
    floor: "10",
    owners: '70',
    transfers: '1000',
    assets: '7,719',
    icon: '/collection/badger.png',
  },
  {
    name: 'Kadena Mining Club',
    amount: '11.9734',
    currency: 'KDA',
    delta: 0.5936,
    floor: "1.4",
    owners: '5,470',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/mining.png',
  },
  {
    name: 'Kadena Komodos',
    amount: '11.9497',
    currency: 'KDA',
    delta: 0.3715,
    floor: "0.",
    owners: '570',
    transfers: '10000',
    assets: '1,719',
    icon: '/collection/komodos.png',
  },
  {
    name: 'JODIE INU',
    amount: '711.5678',
    currency: 'KDA',
    delta: 0.401,
    floor: "10",
    owners: '50',
    transfers: '100',
    assets: '119',
    icon: '/collection/inu.png',
  },
  {
    name: 'INU Crew',
    amount: '10.8542 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "1.385",
    owners: '170',
    transfers: '14,000',
    assets: '19',
    icon: '/collection/inu.png',
  },
  {
    name: 'Eighties Bulls',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.18877,
    floor: "10",
    owners: '8,270',
    transfers: '100',
    assets: '19',
    icon: '/collection/bulls.png',
  },
  {
    name: 'Dadbod #999999',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "1.385",
    owners: '670',
    transfers: '18,000',
    assets: '87,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #123456',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "10",
    owners: '12,270',
    transfers: '14,000',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: -0.401,
    floor: "11.3852",
    owners: '530',
    transfers: '10,000',
    assets: '27,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: -0.401,
    floor: "10",
    owners: '60',
    transfers: '100',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "11.3852",
    owners: '5,270',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: -0.401,
    floor: "10",
    owners: '270',
    transfers: '10',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "10",
    owners: '1,270',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "1.385",
    owners: '5,270',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: -0.401,
    floor: "10",
    owners: '5,470',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "10",
    owners: '5,470',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/dadbod.png',
  },
  {
    name: 'Dadbod #122346',
    amount: '76.51 ',
    currency: 'KDA',
    delta: 0.401,
    floor: "10",
    owners: '5,270',
    transfers: '10,000',
    assets: '197,719',
    icon: '/collection/dadbod.png',
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
  <PageRoot>
    <PageTitle>
      NFT Collections
    </PageTitle>

    <PageContainer>
      <TableRoot
        title="Trending Collections"
        :class="data.pending && 'bg-white'"
        :rows="rows"
        :columns="nftCollectionsTableColumns"
      >
        <template #position>
          1
        </template>

        <template #collection="{ row }">
          <ColumnCollection
            v-bind="row"
          />
        </template>

        <template #volume="{ row }">
          <ColumnVolume
            v-bind="row"
          />
        </template>

        <template #delta="{ row }">
          <ColumnDelta
            v-bind="row"
          />
        </template>

        <template #floorPrice="{ row }">
          <ColumnVolume
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
      </TableRoot>

      <PaginateTable
        :currentPage="data.page"
        :totalItems="data.totalCount ?? 1"
        :totalPages="data.totalPages"
        @pageChange="data.page = Number($event)"
      />
    </PageContainer>
  </PageRoot>
</template>
