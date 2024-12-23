<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ApiResponse, Page } from '~/types/common';
import type { LolPlayerHistorySimpleDto } from '~/types/game/lol/res/resLolDto';
import LolPlayerHistorySearch from './LolPlayerHistorySearch.vue';
import LolPlayerHistoryUpdate from './LolPlayerHistoryUpdate.vue';
import type { LolPlayerHistoryUpdateRequestDto } from '~/types/game/lol/req/reqLolDto';

const props = defineProps<{
  domain: string;
}>();

const selectedItem = ref<number>(); // 선택된 체크박스 아이템
const showModal = ref(false);
const selectedTitle = ref('');
const selectedId = ref(0);

const lolPlayerHistorySearchResults = ref<Page<LolPlayerHistorySimpleDto>>({
  content: [], // 기본값 설정
  page: {
    totalPages: 0,
    totalElements: 0,
    size: 0,
    number: 0,
  },
});

// 변수
const isHistoryVisible = ref(false);
const rawDomain = cleanDomain(props.domain);

const lolPlayerHistoryResponseSimpleDtos = ref<LolPlayerHistorySimpleDto[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);
const searchQuery = ref(''); // 검색어 상태

const emit = defineEmits<{
  "update:currentPage": [number];
}>();

// 쿠키를 통해 로그인 상태 확인
const isLoggedIn = computed(() => !!useCookie("Authorization").value);

const isSearchActive = computed(() => searchQuery.value.trim() !== ''); // 검색 상태를 확인

const displayedHistory = computed(() => {

  // 검색 중일 때 검색 결과 사용
  if (isSearchActive.value) {
    return lolPlayerHistorySearchResults.value.content
  }

  // 검색 상태가 아닐 때 기본 데이터 사용
  return lolPlayerHistoryResponseSimpleDtos.value;
});


// 메서드
// 모달 열기 및 제목 설정
const openEditModal = (item: LolPlayerHistorySimpleDto) => {
  selectedTitle.value = item.playerHistoryTitle; // 선택된 제목 업데이트
  selectedId.value = item.playerHistoryId;
  showModal.value = true; // 모달 열기
};

const handleCurrentPageUpdate = (page: number) => {
  currentPage.value = page;
};

// 검색제목에 무엇이 입력되었을때 업데이트되는 메서드
const handleLolPlayerHistorySearchResults = (results: Page<LolPlayerHistorySimpleDto>) => {
  totalPages.value = results.page.totalPages;
  lolPlayerHistorySearchResults.value = results;
};


// 히스토리 토글 함수
const togglePlayerHistory = async () => {
  isHistoryVisible.value = !isHistoryVisible.value;
  if (isHistoryVisible.value === true) {
    // 토글을 다시 열면 검색어 초기화
    searchQuery.value = "";
    if (!searchQuery.value && !lolPlayerHistorySearchResults.value)
      currentPage.value = 1; // 페이지 초기화
      await getPlayerHistory(currentPage.value);
  }
};

// 서버에서 히스토리 데이터 가져오기
const getPlayerHistory = async (page: number) => {
  const response = await uFetch<null, ApiResponse<Page<LolPlayerHistorySimpleDto>>>(
    null,
    `/game/lol/${rawDomain}/playerHistory/simple/${page}`,
    'GET',
    true
  );
  if (response && response.data) {
    lolPlayerHistoryResponseSimpleDtos.value = response.data.content; // 데이터를 저장
    totalPages.value = response.data.page.totalPages; // 총 페이지 수 저장
  }
};

// 항목 삭제
const deleteItem = async (playerHistoryId: number) => {
  if (confirm(`이 플레이어 내역을 삭제하시겠습니까?`)) {
    const response = await uFetch<null, ApiResponse<void>>(
      null,
      `/game/lol/rift/playerHistory/${playerHistoryId}`,
      'DELETE',
      true
    );
    if (response && response.code === 200) {
      alert('삭제되었습니다.');
      await getPlayerHistory(currentPage.value);
    } else {
      alert('삭제에 실패했습니다.');
    }
  }
};

// 페이지 이동 함수
const changePage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;

    // 검색 결과가 있을 경우, LolPlayerHistorySearch 컴포넌트를 통해 데이터를 가져옴
    if (searchQuery.value && lolPlayerHistorySearchResults.value.content.length > 0) {
      emit("update:currentPage", page); // currentPage 변경을 하위 컴포넌트에 알림
    } 
    else {
      // 검색 결과가 없으면 기존 방식으로 데이터 가져옴
      await getPlayerHistory(page);
    }
  }
};

// 제목 저장 이벤트 핸들러
const handleSave = async(newTitle: string, id: number) => {
  const dto: LolPlayerHistoryUpdateRequestDto = {
    playerHistoryTitle: newTitle,
  }
  const response = await uFetch<LolPlayerHistoryUpdateRequestDto,ApiResponse<void>>(dto,`/game/lol/rift/playerHistory/${id}`,"PUT",true);
  if (response.code === 200) {
    const updatedItem = displayedHistory.value.find(item => item.playerHistoryId === id);
    if (updatedItem) {
      updatedItem.playerHistoryTitle = newTitle; // 수정된 제목 반영
    }
    alert("수정에 성공 하였습니다") 
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
      class="mt-2 bg-white shadow-lg rounded p-4 max-h-64 overflow-y-auto w-96 border"
    >
      <!-- 로그인 여부에 따라 내용 변경 -->
      <template v-if="isLoggedIn">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold mb-3">📜 팀 히스토리</h3>
          <LolPlayerHistorySearch
            :domain="rawDomain" 
            :currentPage="currentPage" 
            @update:lolPlayerHistorySearchResults="handleLolPlayerHistorySearchResults"
            @update:currentPage="handleCurrentPageUpdate"
            v-model="searchQuery"
          />
        </div>

        <!-- 히스토리 유무에 따라 다른 메시지 표시 -->
        <template v-if="displayedHistory.length > 0">
          <ul class="space-y-2">
            <li
              v-for="(item, index) in displayedHistory"
              :key="index"
              class="flex items-center bg-gray-100 p-2 rounded hover:bg-gray-200 transition"
            >
              <!-- 라디오 버튼 -->
              <input
                type="radio"
                class="mr-4"
                :value="item.playerHistoryId"
                v-model="selectedItem"
              />

              <!-- 히스토리 제목 -->
              <a
                :href="`/game/lol/${rawDomain}/${item.playerHistoryId}`"
                class="flex-1 text-blue-500 hover:underline truncate"
                :title="item.playerHistoryTitle"
              >
                {{ item.playerHistoryTitle }}
              </a>

              <!-- 수정 및 삭제 버튼 -->
              <div class="flex space-x-2">
                <div>
                  <button
                    class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    @click="openEditModal(item)"
                  >
                    수정
                  </button>
                  <LolPlayerHistoryUpdate
                    :visible="showModal"
                    :currentTitle="selectedTitle"
                    :currentId="selectedId"
                    @update:visible="(value: boolean) => (showModal = value)"
                    @save="handleSave"
                  />
                </div>
                <button
                  class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  @click="deleteItem(item.playerHistoryId)"
                >
                  삭제
                </button>
              </div>
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
        <p v-else class="text-gray-500">조회되는 팀 내역이 없습니다</p>
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
