<script setup lang="ts">
</script>

<template>
  <div>
    <div
      class="
        gap-4
        grid grid-cols-5
      "
    >
      <NftCard
        v-for="n in 10"
        :key="'nft-' + n"
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
