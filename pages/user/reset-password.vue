<script lang="ts" setup>
import { ref } from "vue";

const newPassword = ref<string>("");
const confirmPassword = ref<string>("");
const isLoading = ref<boolean>(false);
const message = ref<string>("");

const resetPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    message.value = "모든 필드를 입력해주세요.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    message.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  isLoading.value = true;
  message.value = "";

  try {
    // API 요청
    const response = await fetch("/api/password-reset/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword.value }),
    });

    if (!response.ok) {
      throw new Error("비밀번호 변경 실패");
    }

    message.value = "비밀번호가 성공적으로 변경되었습니다.";
  } catch (error) {
    message.value = "오류가 발생했습니다. 다시 시도해주세요.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-4">
        비밀번호 변경
      </h1>
      <p class="text-center text-gray-600 mb-6">
        새로운 비밀번호를 입력해주세요.
      </p>

      <div class="mb-4">
        <label for="newPassword" class="block text-sm font-medium text-gray-700">
          새 비밀번호
        </label>
        <input
          type="password"
          id="newPassword"
          v-model="newPassword"
          placeholder="새 비밀번호를 입력하세요"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          :disabled="isLoading"
        />
      </div>

      <div class="mb-4">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
          비밀번호 확인
        </label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          :disabled="isLoading"
        />
      </div>

      <button
        @click="resetPassword"
        :disabled="isLoading"
        class="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isLoading ? "변경 중..." : "비밀번호 변경" }}
      </button>

      <p v-if="message" class="mt-4 text-center text-sm text-indigo-600">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 추가적인 커스텀 스타일이 필요한 경우 여기에 작성 */
</style>
