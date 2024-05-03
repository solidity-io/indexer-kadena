<script setup lang="ts">
const {
  networks
} = useAppConfig()
</script>

<template>
  <div
    class="rounded-lg bazk:rounded-2xl overflow-hidden bg-gray-800 flex flex-col bazk:flex-row"
  >
    <div
      class="
        w-full
        aspect-square
        bazk:max-w-[560px]
        bazk:rounded-2xl
        overflow-hidden border border-[3px] border-gray-800 shrink-0 flex justify-center items-center"
    >
      <img
        src="/nft/1.webp"
        class="aspect-square min-w-full bazk:min-w-[560px]"
      />
    </div>

    <div
      class="p-4 bazk:p-8 flex flex-col gap-4 bazk:gap-6 w-full"
    >
      <div
        class="grid gap-3"
      >
        <div
          class="grid gap-2"
        >
          <span
            class="text-font-500 font-medium block"
          >
            Hack a Collection
          </span>

          <span
            class="text-[40px] font-semibold font-semibold block text-font-400"
          >
            Meka #2341
          </span>
        </div>

        <div
          class="bazk:hidden"
        >
          <span
            class="text-xs text-font-400 block max-w-[560px]"
          >
            A Skybreach Land Deed is not just a piece of paper, it's a gateway to a realm of possibilities. As the holder, you can build on the land, mine its hidden resources, embark on thrilling quests, and so much more. Uncover the magic at
          </span>
        </div>
      </div>

      <div
        class="w-full hidden bazk:flex gap-6"
      >
        <NftVolume
          label="Price"
          amount="23 KDA"
          conversion="$42,22"
        />

        <NftVolume
          label="Floor Price"
          amount="23 KDA"
          conversion="$42,22"
        />
      </div>

      <div
        class="grid gap-3 bazk:gap-6"
      >
        <LabelValue
          copy
          label="Owner"
          value="0x20f489cf69AF6f169E5d5835525C1F6166eAf25B"
        />

        <LabelValue
          label="Creator"
          value="Mekaverse"
        />

        <LabelValue
          label="Timestamp"
          value="Fri, 16 Feb 2024 13:13:35 GMT"
        />

        <LabelValue
          label="Marketplace"
        >
          <template #value>
            <div
              class="flex gap-4 items-center"
            >
              <img
                class="h-5 w-5"
                src="/marketplace/1.svg"
              />

              <img
                class="h-5 w-5"
                src="/marketplace/2.svg"
              />
            </div>
          </template>
        </LabelValue>
      </div>
    </div>
  </div>
</template>
