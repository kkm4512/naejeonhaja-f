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
      cookieDomain: process.env.NUXT_PUBLIC_COOKIE_DOMAIN,
      baseApi: process.env.NUXT_PUBLIC_API_URL || 'https://40a6-1-229-119-49.ngrok-free.app/api/v1',
    }
  },
})
