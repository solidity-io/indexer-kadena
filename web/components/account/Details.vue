<script setup lang="ts">
const {
  blockchainTooltipData
} = useAppConfig()
</script>

<template>
  <PageRoot>
    <LabelValue
      col
      withCopy
      label="Account"
      :description="blockchainTooltipData.account.address"
      value="k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"
    />

    <div
      class="grid gap-4 bazk:gap-0 bazk:grid-cols-4"
    >
      <LabelValue
        col
        label="Balance"
        value="3044.34 KDA"
        :description="blockchainTooltipData.account.balance"
      />

      <LabelValue
        col
        label="Assets"
        value="3"
        :description="blockchainTooltipData.account.assets"
      />

      <LabelValue
        col
        label="Transactions"
        value="25716773"
        :description="blockchainTooltipData.account.transactions"
      />

      <LabelValue
        col
        label="Created at"
        value="Sep-08-2022 14:18:01"
        :description="blockchainTooltipData.account.createdAt"
      />
    </div>
  </PageRoot>
</template>
