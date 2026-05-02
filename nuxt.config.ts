// Nuxt 설정 파일
export default {
  runtimeConfig: {
    public: {
      baseApiUrl: 'https://naejeonhaja-b.onrender.com'
    }
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '내전하자 프론트엔드',
      meta: [
        { name: 'description', content: '롤 내전 서비스 프론트엔드' }
      ]
    }
  }
}
