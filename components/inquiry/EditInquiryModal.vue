<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import { TagType } from "~/types/inquiry/inquiryDtos";

// Props 정의
const props = defineProps<{
  show: boolean;
  title: string;
  content: string;
  tags: TagType[];
}>();

// 사용 가능한 태그 목록
const availableTags: TagType[] = [
  TagType.BUG,
  TagType.ETC,
  TagType.FEATURE_REQUEST,
  TagType.MATCHING_ISSUE,
  TagType.TEAM_COMPOSITION,
];

// Emits 정의
const emit = defineEmits(["update:title", "update:content", "update:tags", "close", "save"]);

// 선택된 태그 (초기값을 props.tags로 설정)
const selectedTags = ref<TagType[]>([...props.tags]);

// props.tags가 변경될 경우 selectedTags를 업데이트
watch(() => props.tags, (newTags) => {
  selectedTags.value = [...newTags];
}, { immediate: true });

// 태그 추가/제거 함수
const toggleTag = (tag: TagType) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
  emit("update:tags", selectedTags.value);
};

</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg w-96 shadow-xl">
      <h3 class="text-xl font-bold mb-4">문의 수정</h3>

      <label class="block text-sm font-medium text-gray-700">제목</label>
      <input
        :value="title"
        @input="emit('update:title', ($event.target as HTMLInputElement).value)"
        type="text"
        class="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
      />

      <label class="block text-sm font-medium text-gray-700 mt-4">본문</label>
      <textarea
        :value="content"
        @input="emit('update:content', ($event.target as HTMLTextAreaElement).value)"
        rows="5"
        class="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>

      <!-- 태그 선택 -->
      <div class="mb-4 mt-4">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">태그 선택</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in availableTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition',
              selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            #{{ TagTypeDescriptions[tag] || tag }}
          </button>
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-4">
        <button @click="emit('close')" class="px-4 py-2 bg-gray-300 rounded-md">취소</button>
        <button @click="emit('save')" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          수정 완료
        </button>
      </div>
    </div>
  </div>
</template>
