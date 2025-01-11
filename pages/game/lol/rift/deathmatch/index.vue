<script lang="ts" setup>
import { useRouter } from 'vue-router';

// Vue Router 사용
const router = useRouter();

// 버튼 클릭 시 페이지 이동 함수
const navigateToPage = (id: number) => {
  router.push(`/game/lol/rift/deathmatch/${id}`);
};
</script>

<template>
  <div class="flex justify-center gap-4 mt-8">
    <!-- 4, 8, 16, 32강 버튼 -->
    <button
      v-for="id in [4, 8, 16]"
      :key="id"
      @click="navigateToPage(id)"
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      {{ id }}강
    </button>
  </div>
</template>

<style lang="postcss" scoped>
/* Tailwind CSS 스타일은 별도의 추가 작업 없이 사용할 수 있습니다. */
</style>
