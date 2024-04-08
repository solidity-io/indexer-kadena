<script setup lang="ts">
defineProps<{
  transaction: any
}>()
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
      label="From"
      value="k:5d96a61871e582fb285a5b7fda79f1925bc0f68745f7a3a0ebea71d094f2718b"
    />

    <LabelValue
      withCopy
      label="To"
      value="xfS-eHFuzE72619KflxCn0FKSa5BhvvhyR9THumhdOE"
    />

    <LabelValue
      label="Crosschain"
    >
      <template #value>
        <div
          class="flex items-center gap-2"
        >
          <span>
            1
          </span>

          <IconChevron />

          <span>
            2 (origination)
          </span>
        </div>
      </template>
    </LabelValue>

    <LabelValue
      label="Amount"
      value="2"
    />

    <LabelValue
      label="Transaction Fee"
      value="43.06 KDA (49.95 USD)"
    />

    <LabelValue
      withCopy
      label="Paid by"
      value="k:9c56a61871e582fb285a5b7fda79f1925bc0f68745f7a3a0ebea71d094f2246a"
    />
  </div>
</template>
