<script setup lang="ts">
defineProps<{
  //
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
      label="Gas"
      value="-"
    />

    <LabelValue
      label="Result"
      value="-"
    >
      <!-- <template #value>
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
      </template> -->
    </LabelValue>

    <LabelValue
      value="-"
      label="Request Key"
    />

    <LabelValue
      value="-"
      label="Logs"
    />

    <LabelValue
      value="-"
      label="Metadata"
    />

    <LabelValue
      value="-"
      label="Transaction ID"
    />
  </div>
</template>
