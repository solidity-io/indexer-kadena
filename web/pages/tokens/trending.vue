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

const { $coingecko } = useNuxtApp();

const { data: tokens, pending } = await useAsyncData('tokens-trending', async () =>
  $coingecko.request('coins/markets', {
    vs_currency: 'usd',
    category: 'kadena-ecosystem',
  })
);
</script>

<template>
  <PageRoot>
    <PageTitle>
      Trending Tokens
    </PageTitle>

    <PageContainer>
      <TableRoot
        :rows="tokens ?? []"
        :pending="pending"
        title="Trending Tokens"
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
          <ColumnVolume
            :amount="money.format(row.total_volume)"
            :dollar="`${integer.format(row.total_volume / row.current_price)} ${row.symbol}`"
          />
        </template>

        <template
          #empty
        >
          <EmptyTable
            image="/empty/txs.png"
            title="No trending tokens found yet"
            description="We couldn't find any trending tokens"
          />
        </template>
      </TableRoot>
    </PageContainer>
  </PageRoot>
</template>
