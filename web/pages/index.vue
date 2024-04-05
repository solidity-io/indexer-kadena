<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Kadscan'
})
</script>

<template>
  <div
    class="flex flex-col gap-10 pt-10"
  >
    <div
      class="flex gap-2 items-center justify-between bg-[linear-gradient(180deg,_#01D796_0%,_#009367_105.48%)] rounded-2xl py-[52px] px-[48px]"
    >
      <div
        class="flex flex-col justify-between gap-6 w-full"
      >
        <h1
          class="font-title text-font-400 text-[40px] font-[700] leading-[140%]"
        >
          Explore Kadena Blockchain
        </h1>

        <Search />
      </div>

      <div
        class="bg-gray-800 rounded-xl w-full max-w-[420px] h-[132px]"
      />
    </div>

    <div
      class="rounded-2xl bg-gray-800 p-8 gap-6 grid grid-cols-2"
    >
      <div
        class="
          p-4 gap-4 flex-grow grid grid-cols-2 bg-gray-700 rounded-xl
        "
      >
        <HomeChartCard
          label="Kadena Price"
          description="$3,401.66"
          suffix="@0.0021 BTC"
          float="2.46%"
        />

        <HomeChartCard
          isDark
          label="Total transactions"
          description="90.61 M"
        />

        <HomeChartCard
          label="Market Capital"
          description="$345.94 M"
        />

        <HomeChartCard
          label="Circulating Supply"
          description="264.08 M"
          float="-0.45%"
        />
      </div>

      <div
        class="w-full h-full"
      >
        <Chart />
      </div>
    </div>

    <div
      class="grid grid-cols-2 gap-6"
    >
      <HomeTransactions />

      <HomeBlocks />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
