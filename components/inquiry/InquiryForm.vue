<script lang="ts" setup>
import { ref, defineEmits } from "vue";
import type { ApiResponse } from "~/types/common";
import { TagType, type InquiryRequestDto, type InquiryResponseDto } from "~/types/inquiry/inquiryDtos";

const emit = defineEmits(["close", "submit"]);
const title = ref("");
const content = ref("");
const selectedTags = ref<TagType[]>([]);
const availableTags:TagType[] = [TagType.BUG,TagType.ETC,TagType.FEATURE_REQUEST,TagType.MATCHING_ISSUE,TagType.TEAM_COMPOSITION];

const submitInquiry = async () => {
  if (!title.value || !content.value) {
    alert("제목, 내용, 작성자를 입력해주세요.");
    return;
  }
  const data: InquiryRequestDto = {
        title: title.value,
        content: content.value,
        tags: selectedTags.value,
    }

    await uFetch<InquiryRequestDto, ApiResponse<InquiryResponseDto>>(
      data,
      "/inquiry",
      "POST",
      true // 인증이 필요한 경우 true, 필요 없으면 false
    );

    emit("submit", {});
    // 입력 필드 초기화 후 모달 닫기
    title.value = "";
    content.value = "";
    selectedTags.value = [];
    emit("close");
};

</script>

<template>
  <!-- 모달 오버레이 -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
      <!-- 닫기 버튼 -->
      <button
        @click="emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
      >
        ×
      </button>

      <h2 class="text-xl font-bold text-gray-800 mb-4">문의 작성</h2>
      <input
        v-model="title"
        type="text"
        placeholder="제목을 입력하세요"
        class="w-full border p-2 rounded-md mb-3"
      />
      <textarea
        v-model="content"
        placeholder="문의 내용을 입력하세요"
        class="w-full border p-2 rounded-md mb-3 h-24"
      ></textarea>

      <!-- 태그 선택 -->
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">태그 선택</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in availableTags"
            :key="tag"
            @click="selectedTags.includes(tag) ? selectedTags.splice(selectedTags.indexOf(tag), 1) : selectedTags.push(tag)"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700',
            ]"
          >
            #{{ TagTypeDescriptions[tag] }}
          </button>
        </div>
      </div>

      <button
        @click="submitInquiry"
        class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
      >
        문의 작성 완료
      </button>
    </div>
  </div>
</template>
