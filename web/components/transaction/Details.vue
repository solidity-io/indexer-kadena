<script setup lang="ts">
// defineProps<{
//   transaction: any
// }>()
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <LabelValue
      withCopy
      label="Request Key"
      value="rE-A7ijxto8VLJzuhp_iEXVCnAZD23luDEt9XOVgaiA"
    />

    <LabelValue
      label="Status"
    >
      <template
        #value
      >
        <Tag
          variant="success"
          label="Success"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="Chain"
      value="2"
    />

    <LabelValue
      label="Block Height"
      value="4521530"
    />

    <LabelValue
      label="Timestamp"
      value="Fri, 16 Feb 2024 13:13:35 GMT"
    />
  </div>
</template>
