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
      key: 'info',
      label: 'Info',
    },
    {
      key: 'transfers',
      label: 'Transfers',
    },
    // {
    //   key: 'holders',
    //   label: 'Holders',
    // },
  ],
})

const route = useRoute()

const { $coingecko } = useNuxtApp();

const { data: token } = await useAsyncData('token-trending', async () =>
  await $coingecko.request(`coins/${route.params.coingeckoId}`, {
    vs_currency: 'usd',
    category: 'kadena-ecosystem',
  })
);

if (!token.value) {
  await navigateTo('/404')
}
</script>

<template>
  <PageRoot
    v-if="token"
  >
    <PageContainer>
      <TokenDetails
        v-bind="token"
      />
    </PageContainer>

    <PageContainer>
      <Tabs
        :tabs="data.tabs"
      >
        <!-- <template
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
        </template> -->

        <TabPanel>
          <TokenInfo
            v-bind="token"
          />
        </TabPanel>

        <TabPanel>
          <TokenTransfers
            :modulename="token.contract_address"
          />
        </TabPanel>

        <!-- <TabPanel>
          <TokenHolders
            v-bind="token"
          />
        </TabPanel> -->
      </Tabs>
    </PageContainer>
  </PageRoot>
</template>
