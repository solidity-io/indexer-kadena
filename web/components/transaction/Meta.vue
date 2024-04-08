<script setup lang="ts">
import json from '../../txJson.json'

// defineProps<{
//   transaction: any
// }>()
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <LabelValue
      withCopy
      label="Sender"
      value="d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
    />

    <LabelValue
      label="Chain"
      value="2"
    />

    <LabelValue
      label="Gas Price"
      value="1e-7"
    />

    <LabelValue
      label="Gas limit"
      value="1900"
    />

    <LabelValue
      label="TTL"
      value="300"
    />

    <LabelValue
      label="Creation Time"
      value="2024-02-29T18:37:24.000-03:00"
    />

    <LabelValue
      label="Nonce"
      value="2024-02-29T21:37:39.014575"
    />

    <LabelValue
      withCopy
      label="Public Key"
      value="d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
    />

    <LabelValue
      label="Data"
    >
      <template #value>
        <Code :value="json" />
      </template>
    </LabelValue>

    <LabelValue
      label="Data"
    >
      <template #value>
        <HighlightValue>
          (free.radio02.add-received-with-chain "787264fffee802a1" "U2FsdGVkX187zG71Z/jS8YUNJqPEZizcD6z/FlNqsIY=;;;;;hJ/LX2cwDOu/eJJqctzmF9Q3AXIrOuO8Tp1mE5byf3qln/aKVoRs1g9wwrqAPdMCj8qZu/IH3q5Q4GEFxeP+e/Q+pBzlr4UA5YYJPVrGuSamHsCLagoQy35i++FBH2Ke1jSG13OIDI8eupOCxAy131xgdZwa8xlU3Zq1S6oIRmE=" "0" )
        </HighlightValue>
      </template>
    </LabelValue>
  </div>
</template>
