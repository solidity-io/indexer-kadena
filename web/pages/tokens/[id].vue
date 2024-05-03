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


const { data: token } = await useAsyncData('token-detail', async () => {
  const [
    tokenDataRes,
  ] = await Promise.all([
    fetch('https://api.coingecko.com/api/v3/coins/kadena?x_cg_api_key=CG-tDrQaTrnzMSUR3NbMVb6EPyC'),
  ])

  const token = await tokenDataRes.json()

  return token;
});
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
