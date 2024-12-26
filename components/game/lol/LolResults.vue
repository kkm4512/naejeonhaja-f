<template>
  <div class="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">{{ props.title }}</h1>
    <LolPlayerResultHistorySearch
      :domain="rawDomain"
      :currentPage="currentPage"
      @update:lolPlayerResultHistorySearchResults="handleLolPlayerResultHistorySearchResults"
      @update:currentPage="handleCurrentPageUpdate"
      v-model="searchQuery"
    />
    <div class="w-full max-w-4xl space-y-4">
      <!-- 전체 선택 및 삭제 버튼 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="select-all"
            @change="toggleSelectAll"
            class="form-checkbox"
          />
          <label for="select-all" class="text-sm text-gray-700">전체 선택</label>
        </div>
        <button
          @click="deleteSelectedItems"
          class="px-4 py-2 text-sm font-medium rounded-lg transition duration-300 bg-red-500 text-white hover:bg-red-600"
          :disabled="selectedItems.length === 0"
        >
          선택 삭제
        </button>
      </div>

      <!-- 카드 리스트 -->
      <div
        v-for="history in displayedHistory"
        :key="history.playerResultHistoryId"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-200 flex items-center"
      >
        <!-- 체크박스 -->
        <input
          type="checkbox"
          class="form-checkbox mr-4"
          :value="history"
          :checked="isItemSelected(history)"
          @change="toggleItemSelection(history)"
        />
        <!-- 히스토리 제목 -->
        <a
          :href="`/game/lol/${rawDomain}/results/${history.playerResultHistoryId}`"
          class="flex-1 text-lg font-semibold text-gray-700"
        >
          {{ history.playerResultHistoryTitle }}
        </a>
        <!-- 수정 및 삭제 버튼 -->
        <div class="flex space-x-2">
          <button
            class="hover:opacity-80"
            @click="openEditModal(history)"
          >
          <svg-icon type="mdi" :path="mdilPencil" class="w-6 h-6 text-black"></svg-icon>
          </button>
          <button
            @click="deleteItem(history.playerResultHistoryId)"
          >
          <svg-icon type="mdi" :path="mdilDelete" class="w-6 h-6 text-black"></svg-icon>
          </button>
        </div>
      </div>
    </div>
    <!-- 이거 왜 백그라운드가 새까맣게되냐 -->
    <LolPlayerHistoryAndResultUpdate
      :visible="showModal"
      :currentTitle="selectedTitle"
      :currentId="selectedId"
      @update:visible="(value: boolean) => (showModal = value)"
      @save="handleSave" 
    />

    <!-- 페이지네이션 -->
    <div class="flex flex-col items-center mt-10 space-y-2">
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

        <!-- 페이지 정보 -->
        <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
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
import { cleanDomain } from "#build/imports";
import LolFooter from "~/components/game/lol/LolFooter.vue";
import LolPlayerResultHistorySearch from "~/components/game/lol/LolPlayerResultHistorySearch.vue";
import type { ApiResponse, Page } from "~/types/common";
import type { LolPlayerResultHistoryResponseSimpleDto as LolPlayerResultHistorySimpleDto } from "~/types/game/lol/res/resLolDto";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdilPencil, mdilDelete } from '@mdi/light-js';
import LolPlayerHistoryAndResultUpdate from "./LolPlayerHistoryAndResultUpdate.vue";
import type { LolPlayerResultHistoryUpdateRequestDto } from "~/types/game/lol/req/reqLolDto";

// Props
const props = defineProps<{
  domain: string;
  title: string;
}>();

const rawDomain = cleanDomain(props.domain);
const showModal = ref(false);
const selectedTitle = ref('');
const selectedId = ref(0);

// 데이터 상태 정의
const lolPlayerResultHistoryResponseSimpleDtos = ref<LolPlayerResultHistorySimpleDto[]>([]);
const currentPage = ref(1);
const totalPages = ref(1); // 총 페이지 수 초기화
const lolPlayerResultHistorySearchResults = ref<Page<LolPlayerResultHistorySimpleDto>>({
  content: [], // 기본값 설정
  page: {
    totalPages: 1,
    totalElements: 0,
    size: 0,
    number: 0,
  },
});
const searchQuery = ref(""); // 검색어 상태
const isSearchActive = computed(() => searchQuery.value.trim() !== ""); // 검색 상태를 확인
const selectedItems = ref<LolPlayerResultHistorySimpleDto[]>([]); // 선택된 항목
const emit = defineEmits<{
  "update:currentPage": [number];
}>();

// 데이터 가져오기 함수
const fetchPlayerHistories = async () => {
  const response = await uFetch<null,ApiResponse<Page<LolPlayerResultHistorySimpleDto>>>(null,`/game/lol/${rawDomain}/playerResultHistory/simple/${currentPage.value}`,"GET",true);
  if (response?.data) {
    lolPlayerResultHistoryResponseSimpleDtos.value = response.data.content;
    totalPages.value = response.data.page.totalPages === 0 ? 1 : response.data.page.totalPages;
  }
};

const handleSave = async (newTitle: string, id: number) => {
  const dto: LolPlayerResultHistoryUpdateRequestDto = {
    playerResultHistoryTitle: newTitle,
  };
  const response = await uFetch<LolPlayerResultHistoryUpdateRequestDto, ApiResponse<void>>(dto,`/game/lol/${rawDomain}/playerResultHistory/${id}`,'PUT',true);
  if (response.code === 200) {
    const updatedItem = displayedHistory.value.find(item => item.playerResultHistoryId === id);
    if (updatedItem) {
      updatedItem.playerResultHistoryTitle = newTitle;
    }
  }
};

// 특정 항목이 선택되었는지 확인
const isItemSelected = (item: LolPlayerResultHistorySimpleDto): boolean => {
  return selectedItems.value.some(
    (selected) => selected.playerResultHistoryId === item.playerResultHistoryId
  );
};


// 페이지 변경 처리
const changePage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page; // 현재 페이지 변경
    if (searchQuery.value && lolPlayerResultHistorySearchResults.value.content.length > 0) {
      emit("update:currentPage", page); // currentPage 변경을 하위 컴포넌트에 알림
    } else {
      await fetchPlayerHistories(); // 변경된 페이지에 맞는 데이터 요청
    }
  }
};

// 검색 결과 처리
const handleLolPlayerResultHistorySearchResults = (
  results: Page<LolPlayerResultHistorySimpleDto>) => {
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

// 수정 모달 열기 (미리보기만 포함)
const openEditModal = (item: LolPlayerResultHistorySimpleDto) => {
  selectedTitle.value = item.playerResultHistoryTitle;
  selectedId.value = item.playerResultHistoryId;
  showModal.value = true;
};

// 항목 삭제
const deleteItem = async (playerResultHistoryId: number) => {
  if (confirm(`이 항목을 삭제하시겠습니까?`)) {
    const response = await uFetch<null,ApiResponse<void>>(null, `/game/lol/${rawDomain}/playerResultHistory/${playerResultHistoryId}`, "DELETE", true);
    if (response.code === 200) {
      lolPlayerResultHistoryResponseSimpleDtos.value = lolPlayerResultHistoryResponseSimpleDtos.value.filter(
        (item) => item.playerResultHistoryId !== playerResultHistoryId
      );
      if (lolPlayerResultHistoryResponseSimpleDtos.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
      }

      await fetchPlayerHistories();
    }
  }
};

// 전체 선택
const toggleSelectAll = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    selectedItems.value = [...displayedHistory.value];
  } else {
    selectedItems.value = [];
  }
};

// 개별 선택
const toggleItemSelection = (item: LolPlayerResultHistorySimpleDto) => {
  const index = selectedItems.value.findIndex(
    (selected) => selected.playerResultHistoryId === item.playerResultHistoryId
  );
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value.splice(index, 1);
  }
};

// 선택된 항목 삭제
const deleteSelectedItems = async () => {
  if (selectedItems.value.length === 0) return;
  if (confirm(`선택된 항목을 삭제하시겠습니까?`)) {
    const selectedIds = selectedItems.value.map((item) => item.playerResultHistoryId);
    const response = await uFetch<LolPlayerResultHistorySimpleDto[],ApiResponse<void>>(selectedItems.value, `/game/lol/${rawDomain}/playerResultHistory`, "DELETE", true);
    if (response.code === 200) {
      lolPlayerResultHistoryResponseSimpleDtos.value = lolPlayerResultHistoryResponseSimpleDtos.value.filter(
        (item) => !selectedIds.includes(item.playerResultHistoryId)
      );

      selectedItems.value = [];

      if (lolPlayerResultHistoryResponseSimpleDtos.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
      }

      await fetchPlayerHistories();
    }
  }
};

// 컴포넌트 로드 시 데이터 가져오기
onMounted(async () => {
  await fetchPlayerHistories();
});
</script>
