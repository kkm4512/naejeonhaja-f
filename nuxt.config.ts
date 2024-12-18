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
      baseApi: 'https://server.naejeonhaja.com/api/v1', // API 베이스 URL 등도 여기에 정의할 수 있어
    }
  },
})
