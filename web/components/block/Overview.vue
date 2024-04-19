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
  <div>
    <div
      class="
        pb-6
        gap-4
        flex flex-col
      "
    >
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
    </div>

    <div
      class="
        py-6
        gap-4
        flex flex-col
        border-t border-t-gray-300
      "
    >
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
    </div>
  </div>
</template>
