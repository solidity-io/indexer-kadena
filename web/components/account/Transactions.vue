<script setup lang="ts">
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
      :value="transaction.sender"
    />

    <!-- <LabelValue
      withCopy
      label="To"
      value="xfS-eHFuzE72619KflxCn0FKSa5BhvvhyR9THumhdOE"
    /> -->
    <LabelValue
      label="To"
      value="- todo -"
    />

    <LabelValue
      label="Crosschain"
    >
      <template #value>
        <!-- <div
          class="flex items-center gap-2"
        >
          <span>
            1
          </span>

          <IconChevron />

          <span>
            2 (origination)
          </span>
        </div> -->
        <span>
          - todo -
        </span>
      </template>
    </LabelValue>

    <!-- <LabelValue
      label="Amount"
      value="2"
    /> -->
    <LabelValue
      label="Amount"
      value="- todo -"
    />

    <!-- <LabelValue
      label="Transaction Fee"
      value="43.06 KDA (49.95 USD)"
    /> -->
    <LabelValue
      label="Transaction Fee"
      value="- todo -"
    />

    <!-- <LabelValue
      withCopy
      label="Paid by"
      value="k:9c56a61871e582fb285a5b7fda79f1925bc0f68745f7a3a0ebea71d094f2246a"
    /> -->
    <LabelValue
      label="Paid by"
      value="- todo -"
    />
  </div>
</template>
