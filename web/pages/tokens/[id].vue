<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'

definePageMeta({
  layout: 'app',
})

useHead({
  title: 'Token Details'
})

const data = reactive({
  tabs: [
    {
      key: 'transfers',
      label: 'Transfers',
    },
    {
      key: 'holders',
      label: 'Holders',
    },
    {
      key: 'info',
      label: 'Info',
    },
  ],
})

const { $coingecko } = useNuxtApp();

const { data: token } = await useAsyncData('tokens-trending', async () =>
  $coingecko.request('coins/kadena', {
    vs_currency: 'usd',
    category: 'kadena-ecosystem',
  })
);

console.log('token', token.value)
</script>

<template>
  <PageRoot>
    <PageContainer>
      <TokenDetails
        v-bind="token"
      />
    </PageContainer>

    <PageContainer>
      <Tabs
        :tabs="data.tabs"
      >
        <template
          #button
        >
          <NuxtLink
            to="/collections/1"
          >
            <Button
              size="medium"
              label="View full collection"
            />
          </NuxtLink>
        </template>

        <TabPanel>
          <TokenTransfers
            v-bind="token"
          />
        </TabPanel>

        <TabPanel>
          <TokenHolders
            v-bind="token"
          />
        </TabPanel>

        <TabPanel>
          <TokenInfo
            v-bind="token"
          />
        </TabPanel>
      </Tabs>
    </PageContainer>
  </PageRoot>
</template>
