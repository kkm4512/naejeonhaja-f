<script lang="ts" setup>
import { ref } from "vue";
import type { ApiResponse, SigninDto } from "~/types/common";
const router = useRouter();

const signinDto = ref<SigninDto>({
  email: "",
  password: "",
});


const handleLogin = async () => {
  const response = await xFetch<SigninDto,ApiResponse<void>>(signinDto.value,"/users/signin","POST")
    if (response.code == 200) {
        router.push("/")
      }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-white border border-black">
      <div class="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg border border-gray-300">
        <h2 class="text-3xl font-bold text-center text-black-700 mb-6">로그인</h2>
        <p class="text-center text-gray-500 mb-8 text-sm">계정 정보를 입력하여 로그인하세요.</p>
  
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-600">이메일</label>
            <input
              id="email"
              v-model="signinDto.email"
              type="email"
              placeholder="이메일 주소를 입력하세요"
              class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium text-gray-600">비밀번호</label>
            <input
              id="password"
              v-model="signinDto.password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <button
            type="submit"
            class="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            로그인
          </button>
        </form>
  
        <div class="text-center mt-6">
          <p class="text-sm text-gray-500">
            비밀번호를 잊으셨나요?
            <a href="/user/forgotPassword" class="text-blue-500 hover:underline">여기를 클릭하세요</a>
          </p>
          <p class="text-sm text-gray-500 mt-4">
            계정이 없으신가요?
            <a href="/user/signup" class="text-blue-500 hover:underline">회원가입</a>
          </p>
        </div>
      </div>
    </div>
  </template>
  
