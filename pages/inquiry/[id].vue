<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import EditInquiryModal from "~/components/inquiry/EditInquiryModal.vue";
import type { ApiResponse } from "~/types/common";
import type { InquiryRequestDto, InquiryResponseDto, TagType } from "~/types/inquiry/inquiryDtos";

const route = useRoute();
const router = useRouter();

// 문의 상세 상태
const inquiry = ref<InquiryResponseDto | null>(null);
const showEditModal = ref(false);

// 수정할 데이터 (각각 ref로 관리)
const editTitle = ref("");
const editContent = ref("");
const editTags = ref<TagType[]>([]);

const cookie = getAuthorizationCookie();
const loginUser = getJwtFormatUser(cookie.value);

// 현재 URL에서 id 가져오기
const inquiryId = ref<number | null>(route.params.id ? Number(route.params.id) : null);

// 상세 문의글 조회 함수
const fetchInquiry = async () => {
  if (!inquiryId.value) return;

  const response = await uFetch<null, ApiResponse<InquiryResponseDto>>(
    null,
    `/inquiry/${inquiryId.value}`,
    "GET",
    true
  );

  if (response.code === 200 && response.data) {
    inquiry.value = response.data;
  }
};

// 수정 모달 열기 (기존 데이터 채우기)
const openEditModal = () => {
  if (!inquiry.value) return;
  editTitle.value = inquiry.value.title;
  editContent.value = inquiry.value.content;
  editTags.value = inquiry.value.tags.map(tagDto => tagDto.tag);
  showEditModal.value = true;
};

// 문의글 수정 요청
const updateInquiry = async () => {
  if (!inquiryId.value) return;
  const response = await uFetch<InquiryRequestDto, ApiResponse<void>>(
    { title: editTitle.value, content: editContent.value, tags: editTags.value },
    `/inquiry/${inquiryId.value}`,
    "PUT",
    true
  );

  if (response.code === 200) {
    fetchInquiry(); // 수정 후 데이터 다시 불러오기
    showEditModal.value = false; // 모달 닫기
  }
};

// 문의글 삭제 요청
const deleteInquiry = async () => {
  if (!inquiryId.value) return;

  if (confirm("정말 삭제하시겠습니까?")) {
    const response = await uFetch<null,ApiResponse<void>>(null, `/inquiry/${inquiryId.value}`, "DELETE", true);

    if (response.code === 200) {
      router.push("/inquiry"); // 삭제 후 목록 페이지로 이동
    }
  }
};

// 컴포넌트 마운트 시 데이터 요청
onMounted(fetchInquiry);
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">문의 상세</h1>

    <div v-if="inquiry" class="relative bg-white shadow-xl rounded-xl p-8 border border-gray-200">
      
      <!-- 수정 & 삭제 버튼 (오른쪽 상단 배치) -->
      <div v-if="Number(loginUser?.sub) === inquiry.userDto.id" class="absolute top-2 right-2 flex space-x-2">
        <button @click="openEditModal" class="text-blue-500 hover:text-blue-700">
          ✏️
        </button>
        <button @click="deleteInquiry" class="text-red-500 hover:text-red-700">
          🗑
        </button>
      </div>

      <!-- 문의글 제목 -->
      <h2 class="text-3xl font-bold text-gray-900">{{ inquiry.title }}</h2>

      <!-- 작성자 정보 -->
      <div class="flex items-center justify-between text-sm text-gray-500 mt-3">
        <span class="font-medium">작성자: {{ inquiry.userDto.nickname }}</span>
        <span class="text-gray-400">{{ inquiry.createdAt.split("T")[0] }}</span>
      </div>

      <!-- 본문 내용 -->
      <p class="mt-6 text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
        {{ inquiry.content }}
      </p>

      <!-- 태그 리스트 -->
      <div v-if="inquiry.tags.length" class="mt-6 flex flex-wrap gap-2">
        <span
          v-for="tagDto in inquiry.tags"
          :key="tagDto.id"
          class="bg-blue-200 text-blue-900 px-3 py-1 text-sm font-medium rounded-full"
        >
          #{{ TagTypeDescriptions[tagDto.tag] }}
        </span>
      </div>
    </div>

    <!-- 수정 모달 -->
    <EditInquiryModal
      :show="showEditModal"
      :title="editTitle"
      :content="editContent"
      :tags="editTags"
      @update:title="editTitle = $event"
      @update:content="editContent = $event"
      @update:tags="editTags = $event"
      @close="showEditModal = false"
      @save="updateInquiry"
    />
  </div>
</template>
