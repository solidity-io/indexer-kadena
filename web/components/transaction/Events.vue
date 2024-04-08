<script setup lang="ts">
defineProps<{
  transaction: any
}>()

const result = [
  "k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d",
  "k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d",
  {
    "pred": "keys-all",
    "keys": [
      "d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
    ]
  },
  "2",
  65.12779373
]
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <LabelValue
      label="coin.TRANSFER"
    >
      <template #value>
        <Code
          value="k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
        />

        <Code
          value="99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"
        />

        <Code
          value="0.0000621"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="coin.TRANSFER_XCHAIN"
    >
      <template #value>
        <Code
          value="k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
        />

        <Code
          value="k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
        />

        <Code
          value="65.12779373"
        />

        <Code
          value="2"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="coin.TRANSFER"
    >
      <template #value>
        <Code
          value="k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
        />

        <Code
          value="-"
        />

        <Code
          value="65.12779373"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="pact.X_YIELD"
    >
      <template #value>
        <Code
          value="2"
        />

        <Code
          value="coin.transfer-crosschain"
        />

        <Code
          :value="result"
        />
      </template>
    </LabelValue>
  </div>
</template>
