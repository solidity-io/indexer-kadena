<script setup lang="ts">
const props = defineProps<{
  metadata: string
}>()

const nftMetadata = useNftMetadata(props.metadata)
</script>

<template>
  <div
    class="grid gap-3 md:gap-6"
  >
    <LabelValue
      :value="value"
      :key="trait_type"
      :label="trait_type"
      v-for="{ value, trait_type } in nftMetadata.datum.attributes"
    />
  </div>
</template>
