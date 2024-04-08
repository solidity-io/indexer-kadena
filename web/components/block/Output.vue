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
      label="Gas"
      value="k:5d96a61871e582fb285a5b7fda79f1925bc0f68745f7a3a0ebea71d094f2718b"
    />

    <LabelValue
      label="Result"
    >
      <template #value>
        <div
          class="flex items-center gap-2"
        >
          <IconSuccess
            class="w-6 h-6"
          />

          <span>
            Write Succeeded
          </span>
        </div>
      </template>
    </LabelValue>

    <LabelValue
      label="Request Key"
      value="IjZ0SDduU3ZEQnczVUpwekJT"
    />

    <LabelValue
      label="Logs"
      value="0ZrkuHRW8j_1uC0kY1Xu5BgIc11RsIxKfO4Eri1H-tQ"
    />

    <LabelValue
      label="Metadata"
      value="None"
    />

    <LabelValue
      label="Transaction ID"
      value="9902406"
    />
  </div>
</template>
