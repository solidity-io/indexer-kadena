<script setup lang="ts">
const searchItems = [
  {
    value: 'all',
    label: 'All filters',
  },
  {
    value: 'addresses',
    label: 'Addresses',
  },
  {
    value: 'tokens',
    label: 'Tokens',
  },
  {
    value: 'name-tags',
    label: 'Name Tags',
  },
  {
    value: 'domain-names',
    label: 'Domain Names',
  },
  {
    value: 'labels',
    label: 'Labels',
  },
]

const value = ref(searchItems[0])
</script>

<template>
  <div
    class="
      flex gap-2 items-center
      w-full p-2 bg-gray-800 rounded-lg max-w-[700px]
    "
  >
    <div>
      <Select
        v-model="value"
        :items="searchItems"
      />
    </div>

    <input
      class="
        px-2
        py-2
        text-sm
        bg-transparent
        outline-none
        h-full w-full
        text-font-400
        placeholder:text-font-500
      "
      placeholder="Search by Address / Token / Block"
    />

    <div
      class="flex items-center justify-center p-[6px] bg-gray-500 rounded-lg h-9 w-9 shrink-0"
    >
      <IconSearch />
    </div>
  </div>
</template>
