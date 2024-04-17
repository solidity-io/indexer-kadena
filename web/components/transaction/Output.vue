<script setup lang="ts">
defineProps<{
  logs: string;
  result: string;
  id: string | number;
  continuation: string;
}>()
</script>

<template>
  <div>
    <div
      class="
        pb-6
        gap-6
        flex flex-col
      "
    >
      <LabelValue
        label="Transaction ID"
        :value="id"
      />

      <LabelValue
        label="Result"
      >
        <template #value>
          <div
            class="flex flex-col gap-4"
          >
            <div
              class="flex items-center gap-2"
            >
              <IconSuccess class="h-6 w-6" />

              <span
                class="text-font-400"
              >
                Write Succeeded
              </span>
            </div>

            <Code
              :value="result"
            />
          </div>
        </template>
      </LabelValue>

      <LabelValue
        label="Logs"
        :value="logs"
      />
    </div>

    <div
      class="
        pt-6
        gap-6
        flex flex-col
        border-t border-t-gray-300
      "
    >
      <LabelValue
        label="Signatures"
      >
        <template #value>
          <HighlightValue>
            -
          </HighlightValue>
        </template>
      </LabelValue>

      <LabelValue
        label="Continuation"
      >
        <template #value>
          <Code
            :value="continuation"
          />
        </template>
      </LabelValue>
    </div>
  </div>
</template>
