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

const { data: tokens, pending } = await useAsyncData('tokens-trending', async () => {
  const [
    tokensDataRes,
  ] = await Promise.all([
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=kadena-ecosystem&x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC'),
  ])

  const tokens = await tokensDataRes.json()

  return tokens;
});

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
        :rows="tokens"
        :pending="pending"
        :columns="trendingTokensTableColumns"
      >
        <template #ranking="{ order }">
          {{ order + 1 }}
        </template>

        <template #token="{ row }">
          <ColumnToken
            v-bind="row"
            :icon="row.image"
          />
        </template>

        <template #price="{ row }">
          ${{ integer.format(row?.current_price) }}
        </template>

        <template #change="{ row }">
          <ColumnDelta
            :delta="row.price_change_percentage_24h"
          />
        </template>

        <template #marketCap="{ row }">
          {{ money.format(row.market_cap) }}
        </template>

        <template #supply="{ row }">
          {{ money.format(row.circulating_supply) }}
        </template>

        <template #volume="{ row }">
          <ColumnPrice
            :amount="money.format(row.total_volume)"
            :dollar="`${integer.format(row.total_volume / row.current_price)} ${row.symbol}`"
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
