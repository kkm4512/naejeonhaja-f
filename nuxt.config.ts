// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt'], // 문자열 형태로 추가
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      // prd
      // baseApi: 'https://server.naejeonhaja.com/api/v1',
      // dev
      baseApi: process.env.NUXT_PUBLIC_API_URL || 'https://server.naejeonhaja.com/api/v1',
    }
  },
})
