<script lang="ts" setup />

<template>
  <div
    class="
      flex items-center justify-between bg-[linear-gradient(180deg,_#01D796_0%,_#009367_105.48%)]
      gap-2 rounded-xl bazk:rounded-2xl py-6 bazk:py-[52px] px-4 bazk:px-[48px]"
  >
    <div
      class="flex flex-col justify-between gap-4 bazk:gap-6 w-full"
    >
      <h1
        class="
          text-font-400
          font-semibold bazk:font-[700]
          text-xl bazk:text-[40px]
          leading-[28px] bazk:leading-[140%]"
      >
        Explore Kadena Blockchain
      </h1>

      <Search />
    </div>

    <div
      class="hidden bazk:block bg-gray-800 rounded-xl w-full max-w-[420px] bazk:h-[132px]"
    />
  </div>
</template>
