<script setup lang="ts">
import type { Route } from '~/config';

const props = defineProps<Route>()
</script>

<template>
  <div>
    <NuxtLink
      :to="'#'"
      v-if="props.type === 'link'"
      class="px-3 py-2 text-font-400 hover:text-kadscan-500"
    >
      {{ props.label }}
    </NuxtLink>

    <HeaderDropdown
      v-else
      :label="props.label"
      :items="props.subroutes ?? []"
    />
  </div>
</template>
