// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "nuxt-headlessui",
    "@nuxtjs/tailwindcss"
  ],

  headlessui: {
    prefix: '',
  },
})
