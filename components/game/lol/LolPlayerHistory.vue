<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ApiResponse, Page } from '~/types/common';
import type { LolPlayerHistorySimpleDto } from '~/types/game/lol/res/resLolDto';
import LolPlayerHistorySearch from './LolPlayerHistorySearch.vue';
import type { LolPlayerHistoryUpdateRequestDto } from '~/types/game/lol/req/reqLolDto';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdilPencil, mdilDelete } from '@mdi/light-js';
import LolPlayerHistoryAndResultUpdate from './LolPlayerHistoryAndResultUpdate.vue';

const props = defineProps<{
  domain: string;
}>();

const showModal = ref(false);
const selectedTitle = ref('');
const selectedId = ref(0);

const lolPlayerHistorySearchResults = ref<Page<LolPlayerHistorySimpleDto>>({
  content: [],
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
const totalPages = ref(1);
const searchQuery = ref(''); // 검색어 상태

// 선택된 항목 관리
const selectedItems = ref<LolPlayerHistorySimpleDto[]>([]);

const emit = defineEmits<{
  "update:currentPage": [number];
}>();

// 쿠키를 통해 로그인 상태 확인
const isLoggedIn = computed(() => !!useCookie("Authorization").value);

const isSearchActive = computed(() => searchQuery.value.trim() !== ''); // 검색 상태를 확인

const displayedHistory = computed(() => {
  if (isSearchActive.value) {
    return lolPlayerHistorySearchResults.value.content;
  }
  return lolPlayerHistoryResponseSimpleDtos.value;
});

// 메서드
const openEditModal = (item: LolPlayerHistorySimpleDto) => {
  selectedTitle.value = item.playerHistoryTitle;
  selectedId.value = item.playerHistoryId;
  showModal.value = true;
};

const handleCurrentPageUpdate = (page: number) => {
  currentPage.value = page;
};

const handleLolPlayerHistorySearchResults = (results: Page<LolPlayerHistorySimpleDto>) => {
  totalPages.value = results.page.totalPages;
  lolPlayerHistorySearchResults.value = results;
};

const togglePlayerHistory = async () => {
  isHistoryVisible.value = !isHistoryVisible.value;
  if (isHistoryVisible.value) {
    searchQuery.value = '';
    if (!searchQuery.value && !lolPlayerHistorySearchResults.value) {
      currentPage.value = 1;
    }
    await getPlayerHistory(currentPage.value);
  }
};

const getPlayerHistory = async (page: number) => {
  const response = await uFetch<null, ApiResponse<Page<LolPlayerHistorySimpleDto>>>(
    null,
    `/game/lol/${rawDomain}/playerHistory/simple/${page}`,
    'GET',
    true
  );
  console.log(response);
  if (response && response.data) {
    lolPlayerHistoryResponseSimpleDtos.value = response.data.content;
    totalPages.value = response.data.page.totalPages;
  }
};

const deleteItem = async (playerHistoryId: number) => {
  if (confirm(`이 플레이어 내역을 삭제하시겠습니까?`)) {
    const response = await uFetch<null, ApiResponse<void>>(null,`/game/lol/${rawDomain}/playerHistory/${playerHistoryId}`,'DELETE',true);

    if (response.code === 200) {
      // 삭제된 항목을 데이터에서 제거
      lolPlayerHistoryResponseSimpleDtos.value = lolPlayerHistoryResponseSimpleDtos.value.filter(
        item => item.playerHistoryId !== playerHistoryId
      );

      // 현재 페이지의 데이터가 모두 삭제된 경우 이전 페이지로 이동
      if (lolPlayerHistoryResponseSimpleDtos.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1; // 이전 페이지로 이동
      }

      // 페이지 데이터 새로 가져오기
      await getPlayerHistory(currentPage.value);

    }
  }
};

const changePage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    if (searchQuery.value && lolPlayerHistorySearchResults.value.content.length > 0) {
      emit("update:currentPage", page);
    } else {
      await getPlayerHistory(page);
    }
  }
};

const handleSave = async (newTitle: string, id: number) => {
  const dto: LolPlayerHistoryUpdateRequestDto = {
    playerHistoryTitle: newTitle,
  };
  const response = await uFetch<LolPlayerHistoryUpdateRequestDto, ApiResponse<void>>(
    dto,
    `/game/lol/${rawDomain}/playerHistory/${id}`,
    'PUT',
    true
  );
  if (response.code === 200) {
    const updatedItem = displayedHistory.value.find(item => item.playerHistoryId === id);
    if (updatedItem) {
      updatedItem.playerHistoryTitle = newTitle;
    }
    alert('수정에 성공하였습니다');
  }
};

// 항목 선택 및 전체 선택
const toggleItemSelection = (item: LolPlayerHistorySimpleDto) => {
  const index = selectedItems.value.findIndex(selected => selected.playerHistoryId === item.playerHistoryId);
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value.splice(index, 1);
  }
};

const toggleSelectAll = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    selectedItems.value = [...displayedHistory.value];
  } else {
    selectedItems.value = [];
  }
};

// 특정 항목이 선택되었는지 확인
const isItemSelected = (item: LolPlayerHistorySimpleDto): boolean => {
  return selectedItems.value.some(
    (selected) => selected.playerHistoryId === item.playerHistoryId
  );
};


const deleteSelectedItems = async () => {
  if (selectedItems.value.length === 0) return;

  if (confirm(`선택된 항목을 삭제하시겠습니까?`)) {
    const response = await uFetch<LolPlayerHistorySimpleDto[], ApiResponse<void>>(selectedItems.value,`/game/lol/${rawDomain}/playerHistory`,"DELETE",true);

    if (response.code === 200) {
      // 삭제 성공 시 selectedItems에 있는 항목들을 displayedHistory에서 제거
      const deletedIds: number[] = selectedItems.value.map(item => item.playerHistoryId);

      // displayedHistory에서 삭제된 항목을 필터링
      lolPlayerHistoryResponseSimpleDtos.value = lolPlayerHistoryResponseSimpleDtos.value.filter(
        item => !deletedIds.includes(item.playerHistoryId)
      );

      // 선택된 항목 초기화
      selectedItems.value = [];

      // 현재 페이지의 데이터가 모두 삭제된 경우 이전 페이지 데이터 가져오기
      if (lolPlayerHistoryResponseSimpleDtos.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1; // 이전 페이지로 이동
      }

      // 이전 또는 현재 페이지 데이터 가져오기
      await getPlayerHistory(currentPage.value);

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

        <!-- 전체 선택 및 삭제 버튼 -->
        <div class="flex items-center mb-3">
          <input
            type="checkbox"
            id="select-all"
            class="mr-2"
            @change="toggleSelectAll($event)"
          />
          <label for="select-all" class="text-sm">전체 선택</label>
          <button
            class="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            @click="deleteSelectedItems"
            :disabled="selectedItems.length === 0"
          >
            선택 삭제
          </button>
        </div>

        <!-- 히스토리 유무에 따라 다른 메시지 표시 -->
        <template v-if="displayedHistory.length > 0">
          <ul class="space-y-2">
            <li
              v-for="(item, index) in displayedHistory"
              :key="index"
              class="flex items-center bg-gray-100 p-3 rounded hover:bg-gray-200 transition"
            >
              <!-- 체크박스 -->
              <input
                type="checkbox"
                class="mr-2"
                :value="item"
                :checked="isItemSelected(item)"
                @change="toggleItemSelection(item)"
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
                    class="hover:opacity-80"
                    @click="openEditModal(item)"
                  >
                  <svg-icon type="mdi" :path="mdilPencil" class="w-6 h-6 text-black"></svg-icon>
                  </button>
                </div>
                <button
                  class="hover:opacity-80"
                  @click="deleteItem(item.playerHistoryId)"
                >
                  <!-- 삭제 아이콘 -->
                  <svg-icon type="mdi" :path="mdilDelete" class="w-6 h-6 text-black"></svg-icon>
                </button>
              </div>
            </li>
          </ul>
          <LolPlayerHistoryAndResultUpdate
              :visible="showModal"
              :currentTitle="selectedTitle"
              :currentId="selectedId"
              @update:visible="(value: boolean) => (showModal = value)"
              @save="handleSave"
            />
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
