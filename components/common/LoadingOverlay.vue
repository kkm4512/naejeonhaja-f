<template>
    <div v-if="loadingStore.isLoading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="flex flex-col items-center space-y-4">
        <svg
          class="animate-spin h-10 w-10 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <p class="text-white text-lg font-semibold">로딩중...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useLoadingStore } from "~/stores/useLoadingStore";
  
  // Pinia 스토어 가져오기
  const loadingStore = useLoadingStore();
  </script>
  
  <style scoped>
  /* 로딩 오버레이 스타일 */
  </style>
  