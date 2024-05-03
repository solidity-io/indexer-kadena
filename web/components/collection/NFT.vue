<script setup lang="ts">
</script>

<template>
  <div>
    <div
      class="
        gap-2
        bazk:gap-4
        grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 bazk:grid-cols-5
      "
    >
      <NftCard
        v-for="n in 10"
        :key="'nft-' + n"
        :id="n + ''"
        name="HC - Smoked  #823"
        collection="Hack a Collection"
      />

      <NftCard
        v-for="n in 10"
        :key="'nft-' + n + 10"
        :id="n + ''"
        name="HC - Smoked  #823"
        collection="Hack a Collection"
      />
    </div>

    <PaginateTable
      itemsLabel="NFT's"
      :currentPage="1"
      :totalItems="150"
      :totalPages="10"
    />
  </div>
</template>
