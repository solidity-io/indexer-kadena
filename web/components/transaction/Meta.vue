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
  <Divide>
    <DivideItem>
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
    </DivideItem>

    <DivideItem>
      <LabelValue
        withCopy
        label="Public Key"
        :value="publicKey"
      />
    </DivideItem>

    <DivideItem>
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
    </DivideItem>
  </Divide>
</template>
