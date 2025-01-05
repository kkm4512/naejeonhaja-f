<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  isModalOpen: Boolean
});

// Emit 정의
const emit = defineEmits(['update:isModalOpen']);

// 모달 표시 여부 상태
const isModalOpen = ref(false);
isModalOpen.value = props.isModalOpen;

// 현재 페이지 상태
const currentPage = ref(1);

// 최대 페이지 수
const totalPages = 4;

// 모달 닫기
function closeModal(): void {
  emit('update:isModalOpen', false); // 부모에게 모달 닫기 이벤트 전달
}

// 페이지 이동
function nextPage(): void {
  if (currentPage.value < totalPages) {
    currentPage.value += 1;
  }
}

function prevPage(): void {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}
</script>

<template>
  <div>
    <!-- 모달 -->
    <div
      v-show="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        <!-- 닫기 버튼 (오른쪽 상단 X 버튼) -->
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 현재 페이지 표시 -->
        <div v-if="currentPage === 1">
          <img src="/public/menual/1.png" />
          <br />
          - 플레이어의 닉네임, 티어, 라인을 정해주세요
        </div>
        <div v-if="currentPage === 2">
            <img src="/public/menual/2.png" />
            <br />
            - 스크롤 가장 하단에 있는 확인 버튼을 눌러주세요
        </div>
        <div v-if="currentPage === 3">
            <img src="/public/menual/3.png" />
            <br />
            - 대전결과표를 보고 친구들과 재밌게 내전하세요!
        </div>
        <div v-if="currentPage === 4">
            <img src="/public/menual/4.png" />
            <br />
            - 결과 복사하기 버튼을 누른후
            <br />
            <img src="/public/menual/5.png" />
            <br />
            - 텍스트로 친구와 공유도 가능해요!
        </div>        

        <!-- 페이지 네비게이션 -->
        <div class="flex justify-between mt-6">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-300 text-black rounded-md shadow hover:bg-gray-400 transition disabled:opacity-50"
          >
            이전
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-300 text-black rounded-md shadow hover:bg-gray-400 transition disabled:opacity-50"
          >
            다음
          </button>
        </div>

        <!-- 페이지 표시 -->
        <h2 class="text-xl font-bold mb-4 text-center">{{ currentPage }} / {{ totalPages }}</h2>
      </div>
    </div>
  </div>
</template>
