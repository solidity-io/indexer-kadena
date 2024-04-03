<script setup lang="ts">
const transactions = [
  {
    status: "0",
    chainId: "1",
    requestKey: '2qkE8Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    gasLimit: 150000,
    ttl: 2880,
    sender: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    receiver: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    gasPrice: 0.00001,
    amount: 0.155,
    createdAt: Date.now()
  },
  {
    status: "1",
    chainId: "2",
    requestKey: '2qkE8Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    gasLimit: 150000,
    ttl: 2880,
    sender: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    receiver: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    gasPrice: 0.00001,
    amount: 0.155,
    createdAt: Date.now()
  },
  {
    status: "1",
    chainId: "3",
    requestKey: '2qkE8Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    gasLimit: 150000,
    ttl: 2880,
    sender: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    receiver: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    gasPrice: 0.00001,
    amount: 0.155,
    createdAt: Date.now()
  },
  {
    status: "0",
    chainId: "4",
    requestKey: '2qkE8Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    gasLimit: 150000,
    ttl: 2880,
    sender: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    receiver: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    gasPrice: 0.00001,
    amount: 0.155,
    createdAt: Date.now()
  },
  {
    status: "1",
    chainId: "5",
    requestKey: '2qkE8Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    gasLimit: 150000,
    ttl: 2880,
    sender: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    receiver: "k:8ac2e82a3aa9a1f18e1f73ef660f1e2f0f91aced95e7f7365b41adf2c3c8ab43",
    gasPrice: 0.00001,
    amount: 0.155,
    createdAt: Date.now()
  }
]
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

      <Button
        label="View All"
        size="medium"
      />
    </div>

    <div
      class="border-t border-t-gray-300"
    >
      <HomeTruncatedTransaction
        v-bind="transaction"
        :key="transaction.requestKey"
        v-for="transaction in transactions"
      />
    </div>
  </div>
</template>
