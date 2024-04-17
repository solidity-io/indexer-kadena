<script setup lang="ts">
defineProps<{
  events: any
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
      :key="id"
      :label="`${module }.${name}`"
      v-for="{ id, module, name, params } in events"
    >
      <template #value>
        <Code
          :value="param"
          :key="`event-${name}-${param}`"
          v-for="param in JSON.parse(params)"
        />
      </template>
    </LabelValue>
  </div>
</template>
