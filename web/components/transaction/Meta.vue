<script setup lang="ts">
defineProps<{
  code: string;
  data: string;
  metadata: any;
  publicKey: string;
  createdAt: string;
}>()
</script>

<template>
  <div>
    <div
      class="
        pb-6
        gap-6
        flex flex-col
      "
    >
      <LabelValue
        withCopy
        label="Sender"
        :value="metadata.sender"
      />

      <LabelValue
        label="Chain"
        :value="metadata.chainId + ''"
      />

      <LabelValue
        label="Gas Price"
        :value="metadata.gasPrice + ''"
      />

      <LabelValue
        label="Gas limit"
        :value="metadata.gasLimit + ''"
      />

      <LabelValue
        label="TTL"
        :value="metadata.ttl + ''"
      />

      <LabelValue
        label="Creation Time"
        :value="createdAt"
      />
    </div>

    <div
      class="
        py-6
        gap-6
        flex flex-col
        border-t border-t-gray-300
      "
    >
      <LabelValue
        withCopy
        label="Public Key"
        :value="publicKey"
      />
    </div>

    <div
      class="
        pt-6
        gap-6
        flex flex-col
        border-t border-t-gray-300
      "
    >
      <LabelValue
        label="Nonce"
        :value="metadata.nonce"
      />

      <LabelValue
        label="Data"
      >
        <template #value>
          <Code :value="JSON.parse(data)" />
        </template>
      </LabelValue>
    </div>
  </div>
</template>
