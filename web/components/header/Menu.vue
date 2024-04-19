<script setup lang="ts">
interface BaseRoute {
  path?: string;
  tag: string;
  label: string;
}

const props = defineProps<{
  tag: string,
  path?: string,
  label: string,
  type: 'group' | 'link',
  subroutes?: BaseRoute[];
}>()
</script>

<template>
  <div>
    <NuxtLink
      :to="props.path"
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
