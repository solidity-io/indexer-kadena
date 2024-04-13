<script setup lang="ts">

</script>

<template>
  <div
    class="
      gap-4
      grid grid-cols-5
    "
  >
    <NftCard
      v-for="n in 5"
      :key="'nft-' + n"
      :id="n + ''"
      name="HC - Smoked  #823"
      collection="Hack a Collection"
    />
  </div>
</template>
