<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
  >

    <div class="bg-white w-96 p-6 rounded-lg shadow-lg transform transition-transform duration-300">
      <h2 class="text-xl font-bold mb-4">제목 수정</h2>
      
      <!-- 제목 입력 필드 -->
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">새 제목</label>
        <input
          id="title"
          type="text"
          v-model="newTitle"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      
      <!-- 버튼 그룹 -->
      <div class="flex justify-end space-x-2">
        <button
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          @click="handleCancel"
        >
          취소
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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

// Props 정의
const props = defineProps<{
  visible: boolean;
  currentTitle: string;
  currentId: number;
}>();

// Emits 정의
const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'save', newTitle: string, id: number): void;
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
/* 모달 애니메이션 */
.modal-enter-active {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-to {
  opacity: 1;
  transform: scale(1);
}
.modal-leave-active {
  opacity: 1;
  transform: scale(1);
}
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}


</style>
