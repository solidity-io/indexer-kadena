<script setup lang="ts">
const props = defineProps<{
  transaction: any
}>()

const variant = computed(() => {
  return props.transaction.result.includes('\"status\":\"success\"') ? 'success' : 'failed'
})

const label = computed(() => {
  return props.transaction.result.includes('\"status\":\"success\"') ? 'Success' : 'Finalized'
})
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
      :value="transaction.requestkey"
    />

    <LabelValue
      label="Status"
    >
      <template
        #value
      >
        <Tag
          :variant="variant"
          :label="label"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="Chain"
      :value="transaction.chainid"
    />

    <LabelValue
      label="Block Height"
      value="- todo -"
    />

    <LabelValue
      label="Timestamp"
      :value="new Date(transaction.createdAt).toUTCString()"
    />
  </div>
</template>
