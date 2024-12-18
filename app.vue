<script setup>
import { Analytics } from '@vercel/analytics/nuxt';
useHead({
  title: '내전하자',
  meta: [
    { name: 'description', content: '5:5 팀 내전을 위한 실시간 매칭 및 경기 관리 플랫폼. 팀을 만들고 전략적으로 내전을 즐기세요.' },
    { name: 'keywords', content: '5:5 내전, 게임 매칭, 팀 매칭, 실시간 경기 관리, 내전 플랫폼, 팀 내전' },
    { name: 'google-site-verification', content: 'PRlc-MXZDbtEUlRydHajMzyME7cq0lWQmO9SaHQubBk' },
    // Open Graph 이미지
    { property: 'og:image', content: '/logo/logo.webp' },
    { property: 'og:image:alt', content: '내전하자 로고 이미지' },
    { property: 'og:image:type', content: 'image/webp' },
    { property: 'og:image:width', content: '1200' }, // 이미지 너비
    { property: 'og:image:height', content: '630' }  // 이미지 높이
  ],
  link: [
    // Favicon 설정
    { rel: 'icon', type: 'image/webp', href: '/logo/logo.webp' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo/logo.webp' } // iOS용 아이콘
  ]
});

</script>

<template>
  <Analytics />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
