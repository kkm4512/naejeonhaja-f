<template>
    <div class="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">롤토체스 대전결과들</h1>
      <LolPlayerResultHistorySearch
        domain="tft" 
        :currentPage="currentPage" 
        @update:lolPlayerResultHistorySearchResults="handleLolPlayerResultHistorySearchResults"
        @update:currentPage="handleCurrentPageUpdate"
        v-model="searchQuery"
        />      
      <div class="w-full max-w-4xl space-y-4">
        <!-- 카드 리스트 -->
        <div
            v-for="history in displayedHistory"
            :key="history.playerResultHistoryId"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200 flex items-center justify-center"
        >
            <a
            :href="`/game/lol/tft/results/${history.playerResultHistoryId}`"
            class="block w-full text-lg font-semibold text-gray-700 text-center"
            >
            {{ history.playerResultHistoryTitle }}
            </a>
        </div>
      </div>
    
      <!-- 페이지네이션 -->
      <div class="flex flex-col items-center mt-10 space-y-2">
        <!-- 페이지 정보 -->
        <p class="text-sm text-gray-600">
          페이지 {{ currentPage }} / {{ totalPages }}
        </p>
  
        <div class="flex justify-center space-x-2">
          <!-- 이전 버튼 -->
          <button
            @click="changePage(currentPage - 1)"
            class="px-4 py-2 text-sm font-medium rounded-lg transition duration-300 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            :disabled="currentPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            이전
          </button>
    
          <!-- 페이지 버튼 -->
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            class="px-4 py-2 text-sm font-medium rounded-lg transition duration-300 border border-gray-300"
            :class="{
              'bg-blue-500 text-white': currentPage === page,
              'bg-white text-gray-700 hover:bg-gray-100': currentPage !== page
            }"
          >
            {{ page }}
          </button>
    
          <!-- 다음 버튼 -->
          <button
            @click="changePage(currentPage + 1)"
            class="px-4 py-2 text-sm font-medium rounded-lg transition duration-300 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            :disabled="currentPage === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            다음
          </button>
        </div>
      </div>
    </div>
    <LolFooter />
  </template> 
    
  <script setup lang="ts">
import LolFooter from "~/components/game/lol/LolFooter.vue";
import LolPlayerResultHistorySearch from "~/components/game/lol/LolPlayerResultHistorySearch.vue";
import type { ApiResponse, Page } from "~/types/common";
import type { LolPlayerResultHistoryResponseSimpleDto } from "~/types/game/lol/res/resLolDto";
  
  // 데이터 상태 정의
  const currentPage = ref(1);
  const totalPages = ref(1); // 총 페이지 수 초기화
  const searchQuery = ref(''); // 검색어 상태
  const lolPlayerResultHistorySearchResults = ref<Page<LolPlayerResultHistoryResponseSimpleDto>>({
    content: [], // 기본값 설정
      page: {
      totalPages: 0,
      totalElements: 0,
      size: 0,
      number: 0,
    },
  });
  const isSearchActive = computed(() => searchQuery.value.trim() !== ''); // 검색 상태를 확인
  const emit = defineEmits<{
    "update:currentPage": [number];
  }>();
  const lolPlayerResultHistoryResponseSimpleDtos = ref<LolPlayerResultHistoryResponseSimpleDto[]>([]);
  
  // 데이터 가져오기 함수
  const fetchPlayerHistories = async() => {
      const response = await uFetch<null,ApiResponse<Page<LolPlayerResultHistoryResponseSimpleDto>>>(null, `/game/lol/tft/playerResultHistory/simple/${currentPage.value}`, "GET", true);
      if (response?.data) {
        lolPlayerResultHistoryResponseSimpleDtos.value = response.data.content
        totalPages.value = response.data.page.totalPages
      }
  };
  
  // 페이지 변경 처리
  const changePage = async (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page; // 현재 페이지 변경
      if (searchQuery.value && lolPlayerResultHistorySearchResults.value.content.length > 0) {
        emit("update:currentPage", page); // currentPage 변경을 하위 컴포넌트에 알림
      } 
      else {
        await fetchPlayerHistories(); // 변경된 페이지에 맞는 데이터 요청
      }
    }
  };
  const handleLolPlayerResultHistorySearchResults = (results: Page<LolPlayerResultHistoryResponseSimpleDto>) => {
    totalPages.value = results.page.totalPages;
    lolPlayerResultHistorySearchResults.value = results;
};

const displayedHistory = computed(() => {
  // 검색 중일 때 검색 결과 사용
  if (isSearchActive.value) {
    return lolPlayerResultHistorySearchResults.value.content;
  }
  // 검색 상태가 아닐 때 기본 데이터 사용
  return lolPlayerResultHistoryResponseSimpleDtos.value;
});  

const handleCurrentPageUpdate = (page: number) => {
  currentPage.value = page;
};
  
  // 컴포넌트 로드 시 데이터 가져오기
  onMounted(async() => {
    await fetchPlayerHistories();
  });
  </script>
  