<script setup lang="ts">
defineProps<{
  name: string;
  symbol: string;
  description: any;
  market_data: any;
}>()

const {
  blockchainTooltipData
} = useAppConfig()
</script>

<template>
  <PageRoot>
    <div
      class="flex flex-col gap-4"
    >
      <span
        class="bazk:text-xl bazk:font-semibold text-font-400"
      >
        Overview
      </span>

      <span
        class="text-xs bazk:text-sm text-font-400"
      >
        {{ description.en }}
      </span>
    </div>

    <div
      class="flex flex-col gap-3 bazk:gap-4"
    >
      <span
        class="bazk:text-xl bazk:font-semibold text-font-400"
      >
        Market
      </span>

      <div
        class="flex flex-col gap-4"
      >
        <LabelValue
          label="Market Capitalization"
          :value="moneyCompact.format(market_data.market_cap.usd)"
          :description="blockchainTooltipData.tokenDetails.information.marketCapitalization"
        />

        <LabelValue
          label="Volume (24H)"
          :value="moneyCompact.format(market_data.total_volume.usd)"
          :description="blockchainTooltipData.tokenDetails.information.volume24H"
        />

        <LabelValue
          label="Circulating supply"
          :description="blockchainTooltipData.tokenDetails.information.circulatingSupply"
        >
          <template #value>
            <span class="uppercase">
              {{ `${integer.format(market_data.circulating_supply)} ${symbol}` }}
            </span>
          </template>
        </LabelValue>

        <LabelValue
          label="Market Data Source"
          class="w-max bazk:w-auto"
        >
          <template #value>
            <div
              class="flex items-center px-2 py-1 gap-1 rounded bg-gray-600 shrink-0"
            >
              <IconCoinGecko
                class="w-4 h-4 shrink-0"
              />

              <span
                class="text-xs font-medium leading-[150%] shrink-0"
              >
                CoinGecko
              </span>
            </div>
          </template>
        </LabelValue>
      </div>
    </div>
  </PageRoot>
</template>
