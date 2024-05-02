<script setup lang="ts">
defineProps<{
  hash: string;
  height: number;
  parent: string;
  chainId: number;
  createdAt: string;
}>()
</script>

<template>
  <PageRoot>
    <LabelValue
      :value="height"
      label="Block Height"
    />

    <LabelValue
      label="Chain"
      :value="chainId"
    />

    <LabelValue
      label="Creation Time"
      :value="new Date(createdAt).toUTCString()"
    />

    <LabelValue
      withCopy
      label="Parent"
      :value="parent"
    />

    <LabelValue
      label="POW Hash"
      value="-"
    />
  </PageRoot>
</template>
