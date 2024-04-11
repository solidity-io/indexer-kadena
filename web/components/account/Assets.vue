<script setup lang="ts">
const data = reactive({
  date: null
})
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <DatePicker
      v-model="data.date"
    />
  </div>
</template>
