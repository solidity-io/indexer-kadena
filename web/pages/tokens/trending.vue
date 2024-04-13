<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Trending Tokens (KTS)'
})

const {
  trendingTokensTableColumns
} = useAppConfig()

const rows = [
  {
    key: 'kadena',
    name: 'kadena',
    symbol: 'KDA',
    icon: '/tokens/kadena.svg',
    price: "$1.50",
    float: 0.046,
    volume: "$62,674,910,077.00",
    dollar: "412,693.77 KDA",
    market: "$104,291,713,432.00",
    supply: "351,254.584 KDA"
  },
  {
    key: 'kishu',
    name: 'Kishu Ken',
    symbol: 'KISHK',
    icon: '/tokens/kishu.svg',
    price: "$0.081685",
    float: -0.094,
    volume: "$2,088,186,491.00",
    dollar: "560,765.984 KDA",
    market: "$86,788,382,997.00",
    supply: "267,757.887 KISHK"
  },
  {
    name: 'KDLaunch',
    symbol: 'KDL',
    icon: '/tokens/launch.svg',
    price: "$0.009603",
    float: 0.092,
    volume: "$134,027,024.00",
    dollar: "$34,913,462,287.00",
    market: "$86,788,382,997.00",
    supply: "412,693.77 KDL"
  },
  {
    name: 'KDSwap',
    symbol: 'KDS',
    icon: '/tokens/swap.svg',
    price: "$0.006602",
    float: 0.162,
    volume: "$62,674,910,077.00",
    dollar: "412,693.77 KDA",
    market: "$104,291,713,432.00",
    supply: "351,254.584 KDA"
  },
  {
    name: 'Hypercent',
    symbol: 'HYPE',
    icon: '/tokens/hypercent.svg',
    price: "$1.50",
    float: 0.046,
    volume: "$62,674,910,077.00",
    dollar: "412,693.77 KDA",
    market: "$104,291,713,432.00",
    supply: "351,254.584 KDA"
  },
  {
    name: 'Miners of Kadenia',
    symbol: 'MOK',
    icon: '/tokens/miners.svg',
    price: "$1.50",
    float: 0.046,
    volume: "$62,674,910,077.00",
    dollar: "412,693.77 KDA",
    market: "$104,291,713,432.00",
    supply: "351,254.584 KDA"
  },
  {
    name: 'eckoDAO',
    symbol: 'KDX',
    icon: '/tokens/ecko-dao.svg',
    price: "$1.50",
    float: 0.046,
    volume: "$62,674,910,077.00",
    dollar: "412,693.77 KDA",
    market: "$104,291,713,432.00",
    supply: "351,254.584 KDA"
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
        Trending Tokens (KTS)
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
          Trending Tokens
        </span>
      </div>

      <Table
        :class="data.pending && 'bg-white'"
        :rows="rows"
        :columns="trendingTokensTableColumns"
      >
        <template #ranking>
          1
        </template>

        <template #token="{ row }">
          <ColumnToken
            v-bind="row"
          />
        </template>

        <template #change="{ row }">
          <ColumnDelta
            :delta="row.float"
          />
        </template>

        <template #volume="{ row }">
          <ColumnPrice
            :amount="row.price"
            :dollar="row.dollar"
          />
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
