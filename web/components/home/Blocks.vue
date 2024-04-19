<script setup lang="ts">
const props = defineProps<{
  data: any
}>()

const blocks = computed(() => {
  return props.data?.nodes || []
})
</script>

<template>
  <div
    class="p-6 bg-gray-800 rounded-xl flex flex-col gap-4"
  >
    <div
      class="flex justify-between items-center"
    >
      <span
        class="text-lg text-font-400 font-semibold"
      >
        Recent Blocks
      </span>

      <NuxtLink
        to="/blocks"
      >
        <Button
          label="View All"
          size="medium"
        />
      </NuxtLink>
    </div>

    <div
      class="border-t border-t-gray-300"
    >
      <HomeTruncatedBlock
        v-bind="block"
        :key="block.hash"
        v-for="block in blocks"
      />
    </div>
  </div>
</template>
