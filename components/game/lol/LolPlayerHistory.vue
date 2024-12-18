<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ApiResponse, Page } from '~/types/common';
import type { LolPlayerHistoryResponseSimpleDto } from '~/types/game/lol/res/resLolDto';
import LolPlayerHistorySearch from './LolPlayerHistorySearch.vue';

const props = defineProps<{
  domain: string;
}>();

const lolPlayerHistorySearchResults = ref<LolPlayerHistoryResponseSimpleDto[]>([]);

// 메서드
const handleLolPlayerHistorySearchResults = (results: LolPlayerHistoryResponseSimpleDto[]) => {
  lolPlayerHistorySearchResults.value = results;
};

// 변수
const isHistoryVisible = ref(false);
const rawDomain = cleanDomain(props.domain);

const lolPlayerHistoryResponseSimpleDtos = ref<LolPlayerHistoryResponseSimpleDto[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);

const emit = defineEmits<{
  "update:currentPage": [number];
}>();

// 쿠키를 통해 로그인 상태 확인
const isLoggedIn = computed(() => !!useCookie("Authorization").value);

// 검색 결과와 기존 데이터를 합쳐서 표시할 데이터를 결정
const displayedHistory = computed(() => {
  // `lolPlayerHistorySearchResults`에 데이터가 있으면 그것을 사용하고, 없으면 `lolPlayerHistoryResponseSimpleDtos`를 사용
  return lolPlayerHistorySearchResults.value.length > 0
    ? lolPlayerHistorySearchResults.value
    : lolPlayerHistoryResponseSimpleDtos.value;
});

// 히스토리 토글 함수
const togglePlayerHistory = async () => {
  isHistoryVisible.value = !isHistoryVisible.value;
  if (isHistoryVisible.value === true) {
    currentPage.value = 1; // 페이지 초기화
    await getPlayerHistory(currentPage.value);
  }
};

// 서버에서 히스토리 데이터 가져오기
const getPlayerHistory = async (page: number) => {
  const response = await uFetch<null, ApiResponse<Page<LolPlayerHistoryResponseSimpleDto>>>(
    null,
    `/game/lol/${rawDomain}/playerHistory/simple/${page}`,
    'GET',
    true
  );
  if (response && response.data) {
    lolPlayerHistoryResponseSimpleDtos.value = response.data.content; // 데이터를 저장
    totalPages.value = response.data.page.totalPages; // 총 페이지 수 저장
  } else {
    lolPlayerHistoryResponseSimpleDtos.value = []; // 데이터가 없으면 빈 배열
    totalPages.value = 0;
  }
};

// 페이지 이동 함수
const changePage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;

    // 검색 결과가 있을 경우, LolPlayerHistorySearch 컴포넌트를 통해 데이터를 가져옴
    if (lolPlayerHistorySearchResults.value.length > 0) {
      emit("update:currentPage", page); // currentPage 변경을 하위 컴포넌트에 알림
    } else {
      // 검색 결과가 없으면 기존 방식으로 데이터 가져옴
      await getPlayerHistory(page);
    }
  }
};


</script>

<template>
  <div class="relative">
    <!-- 히스토리 토글 버튼 -->
    <button
      class="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      @click="togglePlayerHistory"
    >
      <span class="mr-2">팀 히스토리</span>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': isHistoryVisible }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>

    <!-- 히스토리 내역 또는 로그인 안내 -->
    <div
      v-if="isHistoryVisible"
      class="mt-2 bg-white shadow-lg rounded p-4 max-h-64 overflow-y-auto w-80 border"
    >
      <!-- 로그인 여부에 따라 내용 변경 -->
      <template v-if="isLoggedIn">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold mb-3">📜 팀 히스토리</h3>
          <LolPlayerHistorySearch :domain="rawDomain" :currentPage="currentPage" @update:lolPlayerHistorySearchResults="handleLolPlayerHistorySearchResults" />
        </div>

        <!-- 히스토리 유무에 따라 다른 메시지 표시 -->
        <template v-if="displayedHistory.length > 0">
          <ul class="space-y-2">
            <li
              v-for="(item, index) in displayedHistory"
              :key="index"
              class="bg-gray-100 p-2 rounded hover:bg-gray-200 transition"
            >
              <a 
                :href="`/game/lol/${rawDomain}/${item.playerHistoryId}`" 
                class="text-blue-500 hover:underline block truncate"
                title="{{ item.playerHistoryTitle }}"
              >
                {{ item.playerHistoryTitle }}
              </a>
            </li>
          </ul>

          <!-- 페이지 네비게이션 -->
          <div class="flex justify-between mt-4">
            <button
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              이전
            </button>
            <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
            <button
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              다음
            </button>
          </div>
        </template>
        <p v-else class="text-gray-500">아직 저장된 팀 내역이 없습니다.</p>
      </template>
      <p v-else class="text-red-500">로그인 후 이용 가능합니다.</p>
    </div>
  </div>
</template>


<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

a.truncate {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
