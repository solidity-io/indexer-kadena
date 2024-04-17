<script setup lang="ts">
defineProps<{
  status: string;
  metadata: any;
  requestKey: string;
  blockId: string | number | null;
  createdAt: string | number;
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
      label="Request Key"
      :value="requestKey"
    />

    <LabelValue
      label="Status"
    >
      <template
        #value
      >
        <ColumnStatus
          :row="{ result: status }"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="Chain"
      :value="String(metadata.chainId)"
    />

    <LabelValue
      label="Block Height"
      :value="String(blockId)"
    />

    <LabelValue
      label="Timestamp"
      :value="new Date(createdAt).toUTCString()"
    />
  </div>
</template>
