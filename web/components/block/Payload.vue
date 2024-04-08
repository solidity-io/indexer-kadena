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
      label="Miner Account"
      value="k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"
    />

    <LabelValue
      label="Miner Public Keys"
    >
      <template #value>
        <HighlightValue>
          ['e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3']
        </HighlightValue>
      </template>
    </LabelValue>

    <LabelValue
      label="Miner Predicate"
      value="keys-all"
    />

    <LabelValue
      label="Transactions Hash"
      value="ksXr1ScafAUQB3CWqMk4k7xYkxihTEDHibRp2yoyXxQ"
    />

    <LabelValue
      label="Outputs Hash"
      value="n1xkpzbZUyMhdYlxNgKTa_9nbhoShUuI61bHTxFl9Ww"
    />

    <LabelValue
      label="Payload Hash"
      value="7r6As0ugP6nYUigtvMno0BPH3Rj24c-FWsAjqQlHI3I"
    />
  </div>
</template>
