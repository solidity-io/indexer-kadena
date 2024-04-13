<script setup lang="ts">
const {
  networks
} = useAppConfig()
</script>

<template>
  <div
    class="w-full flex flex-col rounded-2xl bg-gray-800 overflow-hidden"
  >
    <div
      class="w-full"
    >
      <img
        src="/collection/banner.webp"
        class="w-full"
      />
    </div>

    <div
      class="p-6 flex flex-col gap-8"
    >
      <div
        class="flex justify-between items-start gap-4"
      >
        <div
          class="flex flex-col gap-4 max-w-[464px]"
        >
          <div
            class="flex gap-4 items-end max-h-[78px]"
          >
            <div
              class="rounded-2xl overflow-hidden border border-[3px] border-gray-800"
            >
              <img
                src="/collection/profile.webp"
                class="w-[180px] h-[180px]"
              />
            </div>

            <div
              class="flex flex-col gap-3"
            >
              <div
                class="flex items-center gap-2"
              >
                <span
                  class="text-2xl	font-semibold block text-font-400"
                >
                  MekaVerse
                </span>

                <IconVerified
                  class="h-6 w-6"
                />
              </div>

              <div
                class="gap-2 rounded border border-gray-300 px-3 py-1.5 flex items-center"
              >
                <span
                  class="text-xs text-font-400 font-medium block"
                >
                  k:e7f7130f359fb1f8c87873...
                </span>

                <IconCopy />
              </div>
            </div>
          </div>

          <div>
            <span
              class="text-xs text-font-400 block"
            >
              A Skybreach Land Deed is not just a piece of paper, it's a gateway to a realm of possibilities. As the holder, you can build on the land, mine its hidden resources, embark on thrilling quests, and so much more. Uncover the magic at
            </span>
          </div>
        </div>

        <div
          class="flex h-auto gap-4"
        >
          <Network
            v-for="network in networks"
            :key="network.to"
            :to="network.to"
            target="__blank"
            :icon="network.icon"
          />
        </div>
      </div>

      <div
        class="grid grid-cols-6"
      >
        <LabelValue
          col
          label="Total items"
          value="731"
        />

        <LabelValue
          col
          label="Owners"
          value="92"
        />

        <LabelValue
          col
          label="For Sale"
          value="132"
        />

        <LabelValue
          col
          label="Floor Price"
          value="161 KDA"
        />

        <LabelValue
          col
          label="Average Price"
          value="145 KDA"
        />

        <LabelValue
          col
          label="Volume"
          value="1347.5 KDA"
        />
      </div>
    </div>
  </div>
</template>
