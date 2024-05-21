<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';
import { debounce } from 'chart.js/helpers';

const getBlocksQuery = gql`
  query SearchBlocks($hash: String) {
    allBlocks(last: 4, filter: {or: {hash: {includes: $hash}}}) {
      nodes {
        id
        hash
        parent
        chainId
        nodeId
        height
      }
    }
    allTransactions(last: 4, filter: {or: {requestkey: {includes: $hash}}}) {
      nodes {
        id
        result
        chainId
        nodeId
        requestkey
      }
    }
  }
`

const data = reactive({
  query: '',
  open: false,
  loading: false,
  searched: null,
  filter: {
    value: 'all',
    label: 'All filters',
  },
  filters: [
    {
      value: 'all',
      label: 'All filters',
    },
    {
      value: 'blocks',
      label: 'Blocks',
    },
    {
      value: 'transactions',
      label: 'Transactions',
    },
  ]
})

const { $graphql } = useNuxtApp();

const isEmpty = computed(() => {
  if (data.searched === null) {
    return true
  }

  return Object.values(data.searched).every(({ nodes }: any) => nodes?.length === 0)
})

const search = debounce(async (value: string[]) => {
  if (!value[0]) {
    data.searched = null

    return
  }

  data.loading = true

  const res = await $graphql.default.request(getBlocksQuery, {
    hash: value[0],
  });

  if (value[0] === data.query) {
    data.searched = res
    data.loading = false
  }
}, 500)

const close = () => {
  data.open = false
}

const cleanup = () => {
  data.query = ''
  data.searched = null
  close()
}
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
          v-if="data.open"
        />

        <IconSearch
          v-else
          class="w-5 h-5"
        />
      </div>
    </div>

    <div
      v-if="data.open"
      class="absolute top-full mt-2 w-full max-w-[580px] right-0 bg-gray-700 rounded-lg p-4 gap-4 flex flex-col border border-gray-300 max-h-[344px] overflow-auto scrollbar-custom"
    >
      <div
        v-if="data.loading"
        class="text-sm text-white"
      >
        Loading...
      </div>

      <span
        class="text-white text-sm"
        v-else-if="isEmpty"
      >
        No results found.
      </span>

      <template
        v-else
      >
        <div
          v-if="data?.searched?.allBlocks?.nodes?.length > 0"
          class="flex flex-col"
        >
          <div
            class="pb-2"
          >
            <span
              class="text-white text-sm"
            >
              Blocks
            </span>
          </div>

          <SearchBlock
            v-bind="block"
            class="py-3 border-b border-gray-300"
            :key="'block:'+block.id"
            v-for="block in data.searched?.allBlocks?.nodes"
          />
        </div>

        <div
          v-if="data?.searched?.allTransactions?.nodes?.length > 0"
          class="flex flex-col gap-2"
        >
          <div
            class="pb-2"
          >
            <span
              class="text-white text-sm"
            >
              Transactions
            </span>
          </div>

          <SearchTransaction
            v-bind="transaction"
            class="py-3 border-b border-gray-300"
            :key="'transaction:'+transaction.id"
            v-for="transaction in data.searched?.allTransactions?.nodes"
          />
        </div>
      </template>
    </div>
  </div>
</template>
