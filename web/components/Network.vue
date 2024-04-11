<script setup lang="ts">
import {
  IconGithub as github,
  IconDiscord as discord,
  IconTwitter as twitter,
} from '#components'

const icons = {
  github,
  discord,
  twitter
}

withDefaults(
  defineProps<{
    to: string
    icon: 'github' | 'discord' | 'twitter'
  }>(),
  {
    icon: 'twitter'
  }
)
</script>
<template>
  <NuxtLink
    :to="to"
    class="p-2 rounded-lg border-gray-300 border hover:bg-gray-300"
  >
    <component :is="icons[icon]" />
  </NuxtLink>
</template>
