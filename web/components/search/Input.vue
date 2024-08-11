<script setup lang="ts">
const {
  data,
  close,
  search,
  cleanup,
} = useSearch();
</script>

<template>
  <div
    class="relative bazk:max-w-[700px]"
    v-outside="close"
  >
    <div
      :class="[data.open && '!border-kadscan-500']"
      class="
        flex gap-2 items-center
        w-full p-2 bg-gray-800 rounded-lg border border-transparent
      "
    >
      <div
        class="hidden bazk:block"
      >
        <Select
          v-model="data.filter"
          :items="data.filters"
          @click="close"
          @update:model-value="search(data.query as any)"
        />
      </div>

      <input
        class="
          px-1
          bazk:px-2
          py-2
          text-sm
          bg-transparent
          outline-none
          h-full w-full
          text-font-400
          placeholder:text-font-500
        "
        @click.prevent="data.open = true"
        v-model="data.query"
        @input="search(($event.target as any).value)"
        placeholder="Search by Address / Token / Block"
      />

      <div
        @click="cleanup()"
        class="mr-1 flex items-center justify-center p-[6px] bg-gray-500 rounded-lg h-8 w-8 bazk:h-9 bazk:w-9 shrink-0 cursor-pointer"
      >
        <IconSearchClose
          class="w-5 h-5"
          v-if="data.open && !!data.query"
        />

        <IconSearch
          v-else
          class="w-5 h-5"
        />
      </div>
    </div>

    <SearchModal
      :open="data.open && !!data.query"
      :error="data.error"
      :loading="data.loading"
      :items="data.searched"
    />
  </div>
</template>
