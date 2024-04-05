<script setup lang="ts">
const {
  transactions
} = useAppConfig()
</script>

<template>
  <div
    class="p-6 bg-gray-800 rounded-xl flex flex-col gap-4"
  >
    <div
      class="flex justify-between items-center"
    >
      <span
        class="text-lg text-font-400 font-semibold	"
      >
        Recent Transactions
      </span>

      <NuxtLink
        to="/transactions"
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
      <HomeTruncatedTransaction
        v-bind="transaction"
        :key="transaction.requestKey"
        v-for="transaction in transactions.slice(0, 5)"
      />
    </div>
  </div>
</template>
