<script setup lang="ts">
const blocks = [
  {
    block: "4559754",
    status: "0",
    chainId: "1",
    hash: '132qkE8Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    createdAt: 1712173641169
  },
  {
    block: "4559754",
    status: "1",
    chainId: "2",
    hash: '2452qkE8Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    createdAt: 1712173641169
  },
  {
    block: "4559754",
    status: "1",
    chainId: "3",
    hash: '32qkE68Fwl3ruJpf4d_9t1NhaBEz03cchuGA7RYGO5vnU',
    createdAt: 1712173641169
  },
  {
    block: "4559754",
    status: "0",
    chainId: "4",
    hash: '42qkE8Fwl3ruJpf5434d_9t1NhaBEz03cchuGA7RYGO5vnU',
    createdAt: 1712173641169
  },
  {
    block: "4559754",
    status: "1",
    chainId: "5",
    hash: '52qkE8Fwl3ruJpf4d_43239t1NhaBEz03cchuGA7RYGO5vnU',
    createdAt: 1712173641169
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
        Recent Blocks
      </span>

      <Button
        label="View All"
        size="medium"
      />
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
