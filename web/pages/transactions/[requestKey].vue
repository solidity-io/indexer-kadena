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

// const query = gql`
//   query GetTransactionById {
//     transactionByRequestKey(
//       requestkey: "R0x-RA7B5J7gMWNYa1CWc2HDyas5JsZtv-AyGzdyYmc"
//       transferLimit: 20
//       eventLimit: 20
//     ) {
//       transfers {
//         contract {
//           chainId
//           createdAt
//           id
//           metadata
//           network
//           module
//           precision
//           tokenId
//           nodeId
//           updatedAt
//           type
//         }
//         transfer {
//           amount
//           chainId
//           contractId
//           createdAt
//           fromAcct
//           hasTokenId
//           modulehash
//           id
//           modulename
//           nodeId
//           requestkey
//           tokenId
//           toAcct
//           payloadHash
//           network
//           updatedAt
//           type
//           transactionId
//         }
//       }
//       transaction {
//         blockId
//         chainId
//         code
//         continuation
//         createdAt
//         creationtime
//         data
//         gas
//         gaslimit
//         gasprice
//         hash
//         id
//         logs
//         nodeId
//         metadata
//         numEvents
//         nonce
//         payloadHash
//         pactid
//         requestkey
//         proof
//         rollback
//         result
//         step
//         sigs
//         sender
//         updatedAt
//         ttl
//         txid
//       }
//       events {
//         chainId
//         createdAt
//         id
//         module
//         modulehash
//         nodeId
//         params
//         name
//         paramtext
//         payloadHash
//         qualname
//         requestkey
//         transactionId
//         updatedAt
//       }
//     }
//   }
// `

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
    transaction,
  } = await $graphql.default.request(query, {
    id: route.params.requestKey,
    // requestKey: 'R0x-RA7B5J7gMWNYa1CWc2HDyas5JsZtv-AyGzdyYmc',
  });

  return transaction
});

if (!transaction.value) {
  await navigateTo('/404')
}
</script>

<template>
  <PageRoot
    v-if="transaction"
  >
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
