<script setup>
// useHead로 메타 및 Open Graph 태그 설정
import { Analytics } from '@vercel/analytics/nuxt'
useHead({
  title: '내전하자',
  meta: [
    { name: 'description', content: '5:5 팀 내전을 위한 실시간 매칭 및 경기 관리 플랫폼. 팀을 만들고 전략적으로 내전을 즐기세요.' },
    { name: 'keywords', content: '5:5 내전, 게임 매칭, 팀 매칭, 실시간 경기 관리, 내전 플랫폼, 팀 내전' },
    { name: 'google-site-verification', content: 'PRlc-MXZDbtEUlRydHajMzyME7cq0lWQmO9SaHQubBk' },
    // Open Graph 설정
    { property: 'og:title', content: '내전하자' },
    { property: 'og:description', content: '5:5 팀 내전을 위한 실시간 매칭 및 경기 관리 플랫폼.' },
    { property: 'og:url', content: 'https://www.naejeonhaja.com' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/logo/logo.webp' },
    { property: 'og:image:alt', content: '내전하자 로고 이미지' },
    { property: 'og:image:type', content: 'image/webp' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' }
  ],
  link: [
    // Favicon 및 iOS 아이콘 설정
    { rel: 'icon', type: 'image/webp', href: '/logo/logo.webp' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo/logo.webp' }
  ]
});
</script>

<template>
  <Analytics />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
