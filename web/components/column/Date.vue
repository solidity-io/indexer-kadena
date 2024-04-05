<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  row: any,
}>()
</script>

<template>
  <span
    class="text-sm"
  >
    {{ new Date(row.createdAt).toUTCString() }}
  </span>
</template>
