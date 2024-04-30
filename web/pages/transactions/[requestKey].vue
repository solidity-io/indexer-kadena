<script setup lang="ts">
import { gql } from 'nuxt-graphql-request/utils';
import { TabPanel } from '@headlessui/vue'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Transaction Details'
})

const data = reactive({
  tabs: [
    {
      key: 'overview',
      label: 'Overview',
    },
    {
      key: 'meta',
      label: 'Meta',
    },
    {
      key: 'output',
      label: 'Transaction Output',
    },
    {
      key: 'events',
      label: 'Events',
    },
  ],
})

const query = gql`
  query GetTransactionById($id: ID!) {
    transaction(nodeId: $id) {
      chainid
      continuation
      code
      createdAt
      creationtime
      gas
      data
      gasprice
      gaslimit
      updatedAt
      txid
      step
      rollback
      ttl
      sender
      result
      proof
      requestkey
      payloadHash
      pactid
      numEvents
      nodeId
      nonce
      logs
      metadata
      id
      blockId
      blockByBlockId {
        adjacents
        chainId
        createdAt
        chainwebVersion
        epochStart
        creationTime
        featureFlags
        hash
        height
        id
        nodeId
        nonce
        target
        parent
        payloadHash
        updatedAt
        weight
      }
      eventsByTransactionId {
        nodes {
          updatedAt
          transactionId
          requestkey
          qualname
          paramtext
          params
          payloadHash
          nodeId
          modulehash
          module
          name
          createdAt
          id
          chainid
        }
      }
      transfersByTransactionId {
        nodes {
          updatedAt
          transactionId
          tokenId
          requestkey
          toAcct
          payloadHash
          nodeId
          modulename
          modulehash
          id
          createdAt
          chainid
          amount
          fromAcct
        }
      }
    }
  }
`

const route = useRoute()

const { $graphql } = useNuxtApp();

const { data: transaction } = await useAsyncData('GetTransactionById', async () => {
  const {
    transaction
  } = await $graphql.default.request(query, {
    id: route.params.requestKey,
  });

  return transaction
});

const formattedTransaction = useTransaction(transaction.value)
</script>

<template>
  <PageRoot>
    <PageTitle>
      Transaction Details
    </PageTitle>

    <PageContainer>
      <TransactionDetails
        v-bind="formattedTransaction"
      />
    </PageContainer>

    <PageContainer>
      <Tabs
        :tabs="data.tabs"
      >
        <TabPanel>
          <TransactionOverview
            v-bind="formattedTransaction"
          />
        </TabPanel>

        <TabPanel>
          <TransactionMeta
            v-bind="formattedTransaction"
          />
        </TabPanel>

        <TabPanel>
          <TransactionOutput
            v-bind="formattedTransaction"
          />
        </TabPanel>

        <TabPanel>
          <TransactionEvents
            v-bind="formattedTransaction"
          />
        </TabPanel>
      </Tabs>
    </PageContainer>
  </PageRoot>
</template>
