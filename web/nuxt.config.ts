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
    "@nuxtjs/tailwindcss",
    "nuxt-graphql-request"
  ],

  build: {
    transpile: ['nuxt-graphql-request'],
  },

  alias: {
    "cross-fetch": "cross-fetch/dist/browser-ponyfill.js",
  },

  graphql: {
    /**
     * An Object of your GraphQL clients
     */
    clients: {
      default: {
        /**
         * The client endpoint url
         */
        endpoint: 'https://h5pmt2ioxe.execute-api.us-east-1.amazonaws.com/',

        options: {
          method: 'POST', // Default to `POST`
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        },
      },
    },
  },

  headlessui: {
    prefix: '',
  },
})
