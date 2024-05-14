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
    "nuxt-graphql-request",
  ],

  build: {
    transpile: ['nuxt-graphql-request'],
  },

  alias: {
    "cross-fetch": "cross-fetch/dist/browser-ponyfill.js",
  },

  runtimeConfig: {
    public: {
      // // Numbers
      // GA_ID: process.env.GTM_TAG,
    },
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
        endpoint: process.env.API_URL || 'localhost:3000',

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
