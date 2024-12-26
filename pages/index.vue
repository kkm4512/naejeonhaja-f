<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-20">
    <div
      v-for="(comment, index) in comments"
      :key="index"
      class="w-full bg-white shadow-md border-t-4 border-b-4 border-gray-300 py-8 px-6"
    >
      <h1 class="text-2xl font-bold text-center text-gray-700">
        {{ comment }}
      </h1>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts" setup>
import Footer from '~/components/common/footer.vue';

const comments = [
  "어서오세요!",
  "팀 내전짜기 정말 힘드셨죠?",
  "오른쪽 위의 희망하는 게임의 내전 팀을 편하게 구성해보세요!",
];
</script>

<style lang="postcss" scoped>
</style>
