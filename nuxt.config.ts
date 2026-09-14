import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2026-09-14',
  runtimeConfig: {
 public: {
 googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID
 }
 },
 
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    plugins: [
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})

