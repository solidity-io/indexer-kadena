<script setup lang="ts">
const date = ref(new Date())
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <client-only>
      <Calendar
        v-model="date"
      />
    </client-only>
  </div>
</template>
