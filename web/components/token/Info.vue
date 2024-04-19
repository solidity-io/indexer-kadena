<script setup lang="ts">
defineProps<{
  name: string;
  symbol: string;
  description: any;
  market_data: any;
}>()
</script>

<template>
  <div
    class="p-6 rounded-2xl border border-gray-300 flex flex-col gap-6"
  >
    <div
      class="flex flex-col gap-4"
    >
      <span
        class="text-xl font-semibold text-font-400"
      >
        Overview
      </span>

      <span
        class="text-sm text-font-400"
      >
        {{ description.en }}
      </span>
    </div>

    <div
      class="flex flex-col gap-4"
    >
      <span
        class="text-xl font-semibold text-font-400"
      >
        Market
      </span>

      <div
        class="flex flex-col gap-4"
      >
        <LabelValue
          label="Market Capitalization"
          :value="moneyCompact.format(market_data.market_cap.usd)"
        />

        <LabelValue
          label="Volume (24H)"
          :value="moneyCompact.format(market_data.total_volume.usd)"
        />

        <LabelValue
          label="Circulating supply"
        >
          <template #value>
            <span class="uppercase">
              {{ `${integer.format(market_data.circulating_supply)} ${symbol}` }}
            </span>
          </template>
        </LabelValue>

        <LabelValue
          label="Market Data Source"
        >
          <template #value>
            <div
              class="flex items-center px-2 py-1 gap-1 rounded bg-gray-600"
            >
              <IconCoinGecko
                class="w-4 h-4"
              />

              <span
                class="text-xs font-medium leading-[150%]"
              >
                CoinGecko
              </span>
            </div>
          </template>
        </LabelValue>
      </div>
    </div>
  </div>
</template>
