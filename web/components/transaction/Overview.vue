<script setup lang="ts">
defineProps<{
  code: string;
  gasTransaction: any;
  metadata: any;
  receiver: string;
  continuation: string;
}>()
</script>

<template>
  <div>
    <div
      class="
        gap-6
        pb-6
        flex flex-col
      "
    >
      <LabelValue
        withCopy
        label="From"
        :value="metadata.sender"
      />

      <LabelValue
        withCopy
        label="To"
        :value="receiver"
      />

      <LabelValue
        label="Amount"
        value="2"
      />
    </div>

    <div
      class="
        py-6
        gap-6
        flex flex-col
        border-t border-t-gray-300
      "
    >
      <LabelValue
        label="Transaction Fee"
        :value="`${gasTransaction.amount} KDA`"
      />

      <LabelValue
        withCopy
        label="Paid by"
        :value="gasTransaction.fromAcct"
      />
    </div>

    <div
      class="
        py-6
        gap-6
        flex flex-col
        border-t border-t-gray-300
      "
    >
      <LabelValue
        label="Gas Price"
        :value="`${metadata.gasPrice}`"
      />
    </div>

    <div
      class="
        pt-6
        border-t border-t-gray-300
      "
    >
      <LabelValue
        label="Code"
      >
        <template #value>
          <HighlightValue>
            {{ code }}
          </HighlightValue>
        </template>
      </LabelValue>
    </div>
  </div>
</template>
