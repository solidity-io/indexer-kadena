<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    error: any,
    open: boolean,
    loading: boolean,
    items: any,
  }>(),
  {
    error: null,
    open: false,
    loading: false,
  }
)
const isEmpty = computed(() => {
  if (props.items === null) {
    return true
  }
  return Object.values(props.items).every(({ nodes }: any) => nodes?.length === 0)
});

const hasBlocks = computed(() => {
  return props.items?.blocks?.nodes?.length > 0
});

const hasTransactions = computed(() => {
  return props.items?.transactions?.nodes?.length > 0
});

const hasAddresses = computed(() => {
  return props.items?.addresses?.nodes?.length > 0
});

const hasTokens = computed(() => {
  return props.items?.tokens?.nodes?.length > 0
});

const activeFilter = ref('');
</script>

<template>
  <div
    v-if="open"
    class="absolute top-full mt-2 w-full right-0 bg-gray-700 rounded-lg border border-gray-300 max-h-[344px] overflow-auto max-w-[580px] z-[99]"
  >
    <div class="sticky top-0 bg-gray-700 z-10 px-4 pt-4">
      <div
        v-if="loading"
        class="pb-4"
      >
        <span
          class="text-sm text-white"
        >
          Loading...
        </span>
      </div>

      <div
        class="pb-4"
        v-else-if="isEmpty"
      >
        <span
          class="text-white text-sm"
        >
          No results found.
        </span>
      </div>

      <div
        v-else
        class="flex gap-2 border-b border-gray-300 pb-4 overflow-auto"
      >
        <SearchViewFilter
          label="Blocks"
          v-if="hasBlocks"
          :isActive="activeFilter === 'blocks'"
        />
        <SearchViewFilter
          label="Transactions"
          v-if="hasTransactions"
          :isActive="activeFilter === 'transactions'"
        />
        <SearchViewFilter
          label="Addresses"
          v-if="hasAddresses"
          :isActive="activeFilter === 'address'"
        />
        <SearchViewFilter
          label="Tokens"
          v-if="hasTokens"
          :isActive="activeFilter === 'tokens'"
        />
      </div>
    </div>

    <div
      v-if="!loading && !isEmpty"
      class="flex flex-col p-4 overflow-auto scrollbar-custom min-h-full gap-4 max-w-full overflow-hidden"
    >
      <SearchViewVisible
        v-if="hasBlocks"
        @visible="activeFilter = 'blocks'"
      >
        <SearchViewBlock :blocks="items?.blocks?.nodes" />
      </SearchViewVisible>

      <SearchViewVisible
        v-if="hasTransactions"
        @visible="activeFilter = 'transactions'"
      >
        <SearchViewTransaction :transactions="items?.transactions?.nodes" />
      </SearchViewVisible>

      <SearchViewVisible
        v-if="hasAddresses"
        @visible="activeFilter = 'address'"
      >
        <SearchViewAddress :addresses="items?.addresses?.nodes" />
      </SearchViewVisible>

      <SearchViewVisible
        v-if="hasTokens"
        @visible="activeFilter = 'tokens'"
      >
        <SearchViewTokens :tokens="items?.tokens?.nodes" />
      </SearchViewVisible>
    </div>
  </div>
</template>
