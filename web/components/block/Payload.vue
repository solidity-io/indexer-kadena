<script setup lang="ts">
defineProps<{
  payloadHash: string;
  nonce: string;
  weight: string;
  target: string;
  adjacents: string;
  epochStart: string;
  featureFlags: number;
  chainwebVersion: string;
}>()
</script>

<template>
  <div>
    <div
      class="
        pb-6
        gap-4
        flex flex-col
      "
    >
      <LabelValue
        label="Miner Account"
        value="-"
      />

      <LabelValue
        label="Miner Public Keys"
        value="-"
      />

      <LabelValue
        label="Miner Predicate"
        value="-"
      />
    </div>

    <div
      class="
        pt-6
        gap-4
        flex flex-col
        border-t border-t-gray-300
      "
    >
      <LabelValue
        label="Transactions Hash"
        value="-"
      />

      <LabelValue
        label="Outputs Hash"
        value="-"
      />

      <LabelValue
        label="Payload Hash"
        :value="payloadHash"
      />
    </div>
  </div>
</template>
