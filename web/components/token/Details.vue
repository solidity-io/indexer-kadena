<script setup lang="ts">
const {
  networks
} = useAppConfig()
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
      p-8
      rounded-2xl
      bg-gray-800
    "
  >
    <div
      class="flex items-center gap-2"
    >
      <img
        src="/tokens/kadena.svg"
        class="w-[34px] h-[34px]"
      />

      <span
        class="text-2xl font-semibold leading-[130%] text-font-400"
      >
        Kadena
      </span>

      <span
        class="text-[20px] font-medium text-font-500"
      >
        KDA
      </span>

      <IconVerified/>
    </div>

    <div
      class="grid grid-cols-2"
    >
      <div
        class="flex flex-col gap-4"
      >
        <div>
          <span
            class="text-font-400"
          >
            Overview
          </span>
        </div>

        <LabelValue
          value="1 KDA"
          label="Price"
        />

        <LabelValue
          label="Max Total Supply"
          value="905,772,822"
        />

        <LabelValue
          label="Holders"
          value="4521530"
        />

        <LabelValue
          label="Total Transfers"
          value="228,852,342"
        />
      </div>

      <div
        class="flex flex-col gap-4"
      >
        <div>
          <span
            class="text-font-400"
          >
            Profile Summary
          </span>
        </div>

        <LabelValue
          value="rE-A7ijxto8VLJzuhp_iEXVCnAZD23luDEt9XOVgaiA"
          label="Contract"
        />

        <LabelValue
          label="Decimals"
          value="18"
        />

        <LabelValue
          label="Website"
          value="kadena.io"
        />

        <LabelValue
          label="Parent"
        >
          <template #value>
            <div
              class="flex items-center gap-4"
            >
              <Network
                v-for="network in networks"
                :key="network.to"
                :to="network.to"
                target="__blank"
                :icon="network.icon"
              />
            </div>
          </template>
        </LabelValue>
      </div>
    </div>
  </div>
</template>
