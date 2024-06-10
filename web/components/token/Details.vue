<script setup lang="ts">
defineProps<{
  links: any;
  image: any;
  name: string;
  symbol: string;
  market_data: any;
}>()

const {
  blockchainTooltipData
} = useAppConfig()
</script>

<template>
  <PageRoot>
    <div
      class="flex items-center gap-2"
    >
      <img
        :src="image.large"
        class="w-[34px] h-[34px]"
      />

      <span
        class="text-2xl font-semibold leading-[130%] text-font-400"
      >
        {{ name}}
      </span>

      <span
        class="uppercase text-[20px] font-medium text-font-500"
      >
        {{ symbol }}
      </span>

      <IconVerified/>
    </div>

    <div
      class="grid grid-cols-1 bazk:gap-4 bazk:grid-cols-2 divide-y divide-gray-300 bazk:divide-y-0"
    >
      <div
        class="flex flex-col gap-4 pb-4 bazk:pb-0"
      >
        <div>
          <span
            class="text-font-400"
          >
            Overview
          </span>
        </div>

        <div
          class="grid grid-cols-2 bazk:grid-cols-1 gap-3 bazk:gap-4"
        >
          <LabelValue
            label="Price"
            :description="blockchainTooltipData.tokenDetails.overview.price"
          >
            <template
              #value
            >
              <div
                class="flex text-base gap-2"
              >
                1 KDA <span class="text-font-500">{{ money.format(market_data?.current_price.usd) }}</span>
              </div>
            </template>
          </LabelValue>

          <LabelValue
            label="Max Total Supply"
            :value="integer.format(market_data.max_supply)"
            :description="blockchainTooltipData.tokenDetails.overview.maxTotalSupply"
          />

          <!-- <LabelValue
            value="-"
            label="Holders"
            :description="blockchainTooltipData.tokenDetails.overview.holders"
          /> -->

          <!-- <LabelValue
            value="-"
            label="Total Transfers"
            :description="blockchainTooltipData.tokenDetails.overview.totalTransfers"
          /> -->
        </div>
      </div>

      <div
        class="flex flex-col gap-4 pt-4 bazk:pt-0"
      >
        <div>
          <span
            class="text-font-400"
          >
            Profile Summary
          </span>
        </div>

        <div
          class="grid grid-cols-2 bazk:grid-cols-1 gap-3 bazk:gap-4"
        >
          <LabelValue
            value="-"
            label="Module"
            :description="blockchainTooltipData.tokenDetails.summary.contract"
          />

          <LabelValue
            label="Decimals"
            value="-"
            :description="blockchainTooltipData.tokenDetails.summary.decimals"
          />

          <!-- <LabelValue
            label="Website"
            :value="links.homepage[0]"
            :description="blockchainTooltipData.tokenDetails.summary.website"
          /> -->

          <!-- <LabelValue
            label="Community"
          >
            <template #value>
              <div
                class="flex items-center gap-4"
              >
                <Network
                  icon="github"
                  target="__blank"
                  :to="links.repos_url?.github[0]"
                  v-if="links.repos_url?.github[0]"
                />

                <Network
                  icon="github"
                  target="__blank"
                  :to="`https://t.me/${links.telegram_channel_identifier}`"
                  v-if="links.telegram_channel_identifier"
                />

                <Network
                  icon="twitter"
                  target="__blank"
                  :to="`https://x.com/${links.twitter_screen_name}`"
                  v-if="links.twitter_screen_name"
                />
              </div>
            </template>
          </LabelValue> -->
        </div>
      </div>
    </div>
  </PageRoot>
</template>
