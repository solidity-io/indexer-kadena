<script setup lang="ts">
defineProps<{
  hash: string;
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
        label="Target"
        :value="target"
      />

      <LabelValue
        withCopy
        label="Hash"
        :value="hash"
      />

      <LabelValue
        label="Total Fees"
        value="-"
      />
    </DivideItem>

    <DivideItem>
      <LabelValue
        label="Nonce"
        :value="nonce"
      />

      <LabelValue
        label="Weight"
        :value="weight"
      />

      <LabelValue
        label="Epoch Start"
        :value="epochStart"
      />

      <LabelValue
        label="Flags"
        value="-"
      />
    </DivideItem>

    <DivideItem>
      <LabelValue
        label="Chainweb Version"
        :value="chainwebVersion"
      />

      <LabelValue
        label="Neighbors"
      >
        <template #value>
          <Code
            :value="`Chain ${key} ${value}`"
            :key="`adjacent-${key}-${value}`"
            v-for="(value, key) in JSON.parse(adjacents)"
          />
        </template>
      </LabelValue>
    </DivideItem>
  </Divide>
</template>
