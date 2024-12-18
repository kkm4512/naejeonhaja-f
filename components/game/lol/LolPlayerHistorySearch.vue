<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { ApiResponse } from '~/types/common';
import type { LolPlayerHistoryResponseSimpleDto } from '~/types/game/lol/res/resLolDto';

const props = defineProps<{
  domain: string;
  currentPage: number;
}>();
const emit = defineEmits<{
  "update:lolPlayerHistorySearchResults": [LolPlayerHistoryResponseSimpleDto[]];
}>();

const searchQuery = ref('');
const rawDomain = cleanDomain(props.domain);

// 디바운스 함수
const emitSearchResults = debounce(async (query: string, page: number) => {
  if (query.trim() === '') {
    // 검색어가 비어 있을 때 결과를 초기화
    emit("update:lolPlayerHistorySearchResults", []);
    return;
  }

  const response = await uFetch<null, ApiResponse<LolPlayerHistoryResponseSimpleDto[]>>(
    null,
    `/game/lol/${rawDomain}/search?playerHistoryTitle=${query}&page=${page}`,
    "GET",
    true
  );
  emit("update:lolPlayerHistorySearchResults", response.data);
}, 300); // 300ms 대기 후 실행

// searchQuery가 변경될 때 검색
watch(searchQuery, (newQuery) => {
  emitSearchResults(newQuery, props.currentPage);
});

// currentPage가 변경될 때 검색
watch(
  () => props.currentPage,
  (newPage) => {
    emitSearchResults(searchQuery.value, newPage);
  }
);
</script>


<template>
  <div class="p-4 max-w-md mx-auto">
    <!-- 검색 입력 -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="검색할 내용 기재"
        class="w-full px-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</template>
