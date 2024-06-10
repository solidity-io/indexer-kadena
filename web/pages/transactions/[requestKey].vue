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
      chainId
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
      sigs
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
          amount
          fromAcct
          contractByContractId {
            nodeId
            metadata
            module
            tokenId
          }
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
</script>

<template>
  <PageRoot>
    <PageTitle>
      Transaction Details
    </PageTitle>

    <PageContainer>
      <TransactionDetails
        v-bind="transaction"
      />
    </PageContainer>

    <PageContainer>
      <Tabs
        :tabs="data.tabs"
      >
        <TabPanel>
          <TransactionOverview
            v-bind="transaction"
          />
        </TabPanel>

        <TabPanel>
          <TransactionMeta
            v-bind="transaction"
          />
        </TabPanel>

        <TabPanel>
          <TransactionOutput
            v-bind="transaction"
          />
        </TabPanel>

        <TabPanel>
          <TransactionEvents
            v-bind="transaction"
          />
        </TabPanel>
      </Tabs>
    </PageContainer>
  </PageRoot>
</template>
