<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ApiResponse, Page } from "~/types/common";
import type { InquiryResponseDto } from "~/types/inquiry/inquiryDtos";

const route = useRoute();
const router = useRouter();

// 문의 목록 상태 관리
const inquiries = ref<InquiryResponseDto[]>([]);
const currentPage = ref(Number(route.query.page) || 1); // 현재 페이지, 기본값 1
const totalPages = ref(1); // 총 페이지 수
const showModal = ref(false);

// 문의 목록을 불러오는 함수
const fetchInquiries = async (page = 1) => {
  try {
    const response = await uFetch<null, ApiResponse<Page<InquiryResponseDto>>>(
      null,
      `/inquiry?page=${page}`,
      "GET",
      true
    );

    if (response.code === 200 && response.data) {
      inquiries.value = response.data.content; // 문의 리스트
      totalPages.value = response.data.page.totalPages; // 총 페이지 수
      currentPage.value = response.data.page.number + 1; // Spring Data JPA는 0-based index이므로 +1
    }
  } catch (error) {
    console.error("문의 목록 조회 오류:", error);
  }
};

// 페이지 이동 핸들러
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    router.push({ query: { page } }); // URL 쿼리 파라미터 업데이트
  }
};

// 라우트 변경 감지 (페이지 번호가 바뀔 때 데이터를 다시 불러옴)
watch(() => route.query.page, (newPage) => {
  fetchInquiries(Number(newPage) || 1);
});

// 컴포넌트가 마운트되었을 때 첫 페이지의 문의글 가져오기
onMounted(() => fetchInquiries(currentPage.value));
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">문의 게시판</h1>

    <!-- 문의 작성 버튼 -->
    <button
      @click="showModal = true"
      class="mb-4 bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition"
    >
      문의 작성
    </button>

    <!-- 모달이 열렸을 때만 InquiryForm 표시 -->
    <InquiryForm v-if="showModal" @close="showModal = false" @submit="fetchInquiries(currentPage)" />

    <div class="space-y-4">
      <div
        v-for="inquiry in inquiries"
        :key="inquiry.id"
        class="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition"
      >
        <h2 class="text-lg font-semibold text-gray-800">{{ inquiry.title }}</h2>
        <p class="text-gray-600 mt-1 text-sm line-clamp-2">{{ inquiry.content }}</p>

        <!-- 태그 리스트 -->
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="tagDto in inquiry.tags"
            :key="tagDto.id"
            class="bg-blue-100 text-blue-700 px-2 py-1 text-xs font-medium rounded-full"
          >
            #{{ TagTypeDescriptions[tagDto.tag] }}
          </span>
        </div>

        <div class="mt-4 flex justify-between text-sm text-gray-500">
          <span class="mr-auto">{{ inquiry.userDto.nickname }}</span>  
          <span class="ml-auto">{{ formatRelativeDate(inquiry.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="flex justify-center mt-6 space-x-2">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
      >
        이전
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-4 py-2 rounded-md',
          currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
      >
        다음
      </button>
    </div>
  </div>
</template>
