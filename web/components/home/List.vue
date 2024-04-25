<script setup lang="ts">
const props = defineProps<{
  label: string,
  path: string
}>()

const transactions = computed(() => {
  return props.data?.nodes || []
})
</script>

<template>
  <Container>
    <div
      class="flex justify-between items-center pb-2 bazk:pb-4 border-b border-b-gray-300"
    >
      <span
        class="text-lg text-font-400 font-semibold leading-[26px] block bazk:leading-[25.2px]"
      >
        {{ label }}
      </span>

      <NuxtLink
        :to="path"
        class="flex items-center"
      >
        <Button
          label="View All"
          size="medium"
          class="hidden bazk:flex"
        />

        <Button
          label="View All"
          size="small"
          class="bazk:hidden"
        />
      </NuxtLink>
    </div>

    <div>
      <slot />
    </div>
  </Container>
</template>
