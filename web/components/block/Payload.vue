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
  <Divide>
    <DivideItem>
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
    </DivideItem>

    <DivideItem>
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
    </DivideItem>
  </Divide>
</template>
