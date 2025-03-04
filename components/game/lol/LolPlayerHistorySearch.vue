<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { ApiResponse, Page } from '~/types/common';
import type { LolPlayerHistoryResponseSimpleDto } from '~/types/game/lol/res/resLolDto';

const props = defineProps<{
  domain: string;
  currentPage: number;
}>();

const onInput = (event: Event) => {
  const newQuery = (event.target as HTMLInputElement).value;
  emit("update:modelValue", newQuery); // 부모로 입력 값을 전달
};

const emit = defineEmits<{
  "update:lolPlayerHistorySearchResults": [Page<LolPlayerHistoryResponseSimpleDto>];
  "update:modelValue": [string]; // 부모와 검색어 공유를 위한 이벤트
  "update:currentPage": [number];
}>();

const searchQuery = ref(''); // 로컬에서 검색어 관리
const rawDomain = cleanDomain(props.domain);

// 디바운스 함수
const emitSearchResults = debounce(async (query: string, page: number) => {

  const response = await uFetch<null, ApiResponse<Page<LolPlayerHistoryResponseSimpleDto>>>(
    null,
    `/game/lol/${rawDomain}/simpleSearch?playerHistoryTitle=${query}&page=${page}`,
    "GET",
    true
  );
  emit("update:lolPlayerHistorySearchResults", response.data); // 부모에게 검색 결과 전달
}, 300);

// 검색어 변경 시 부모에게 알림
watch(searchQuery, (newQuery) => {
  emit("update:modelValue", newQuery); // 부모에게 검색어 업데이트
  emit("update:currentPage", 1); // 부모에게 페이지 번호를 1로 초기화 요청
  emitSearchResults(newQuery, props.currentPage); // 검색 실행
});

// 페이지 변경 시 검색 실행
watch(
  () => props.currentPage,
  (newPage) => {
    emitSearchResults(searchQuery.value, newPage);
  }
);
</script>

<template>
  <div class="flex justify-end items-center p-4">
    <!-- 검색 입력 -->
    <input
      type="text"
      v-model="searchQuery"
      @input="onInput"
      placeholder="검색할 내용을 입력하세요"
      class="w-48 p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>

