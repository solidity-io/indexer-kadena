<script setup lang="ts">
defineProps<{
  transaction: any
}>()

const result = {
  "amount": 65.12779373,
  "receiver": "k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d",
  "source-chain": "1",
  "receiver-guard": {
    "pred": "keys-all",
    "keys": [
      "d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
    ]
  }
}

const continbuation = { "pactId": "aTXU7xKv0rS8DEOr77KZMHYfdS0GDgeYmWZfRnd52Wk", "stepHasRollback": false, "step": 0, "yield": { "data": { "amount": 65.12779373, "receiver": "k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d", "source-chain": "1", "receiver-guard": { "pred": "keys-all", "keys": [ "d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d" ] } }, "source": "1", "provenance": { "targetChainId": "2", "moduleHash": "rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4" } }, "continuation": { "args": [ "k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d", "k:d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d", { "pred": "keys-all", "keys": [ "d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d" ] }, "2", 65.12779373 ], "def": "coin.transfer-crosschain" }, "stepCount": 2 }
</script>

<template>
  <div
    class="
      gap-6
      flex flex-col
    "
  >
    <LabelValue
      label="Transaction ID"
      value="9844020"
    />

    <LabelValue
      label="Result"
    >
      <template #value>
        <Code
          :value="result"
        />
      </template>
    </LabelValue>

    <LabelValue
      label="Logs"
      value="Tcfv0F4VOcMSM98c1l_ltdmjgB19DW732F74lqpr5x4"
    />

    <LabelValue
      label="Gas"
      value="621"
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
      label="Public Key"
      value="d7bf621636d4fc45c0c50f59b511f88eb0a737837a7b6d800756762a295fdc4d"
    />

    <LabelValue
      label="Signatures"
    >
      <template #value>
        <HighlightValue>
          faddf8f5f035ee2358fa765122b379acc06b84b2dedcd4223039ee02c935712acab6eb7ab3e7bab7091fc3803d8e03a66baa82595d0977135745aa8a16aeec05
        </HighlightValue>
      </template>
    </LabelValue>

    <LabelValue
      label="Continuation"
    >
      <template #value>
        <Code
          :value="continbuation"
        />
      </template>
    </LabelValue>
  </div>
</template>
