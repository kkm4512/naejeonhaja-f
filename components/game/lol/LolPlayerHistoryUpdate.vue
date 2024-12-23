<template>
    <div v-if="visible" class="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">제목 수정</h2>
        
        <!-- 제목 입력 필드 -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">새 제목</label>
          <input
            id="title"
            type="text"
            v-model="newTitle"
            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <!-- 버튼 그룹 -->
        <div class="flex justify-end space-x-4">
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            @click="handleCancel"
          >
            취소
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="handleSave"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    visible: boolean;
    currentTitle: string;
    currentId: number
  }>();
  
// Emits 정의
const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'save', newTitle: string, id: number): void; // currentId 포함
}>();
  
  // 로컬 상태 관리
  const newTitle = ref(props.currentTitle);
  
  // Props가 변경되었을 때 newTitle 업데이트
  watch(() => props.currentTitle, (newValue) => {
    newTitle.value = newValue;
  });
  
  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    emit('save', newTitle.value, props.currentId);
    emit('update:visible', false);
  };
  
  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    emit('update:visible', false);
  };
  </script>
  
  <style scoped>
  /* 모달 애니메이션이나 추가 스타일을 적용하려면 여기에 작성 */
  </style>
  