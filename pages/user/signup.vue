<script lang="ts" setup>
import { ref } from "vue";
import type { ApiResponse, SigninDto, SignupDto } from "~/types/common";

const router = useRouter();
const signupDto = ref<SignupDto>({
  nickname: "",
  email: "",
  password: "",
});

const handleSignup = async () => {
  const response = await xFetch<SignupDto, ApiResponse<void>>(signupDto.value, "/users/signup", "POST");
  if (response.code === 200) {
    const signinDto = ref<SigninDto>({
      email: signupDto.value.email,
      password: signupDto.value.password,
    }); 
    const response2 = await xFetch<SigninDto, ApiResponse<void>>(signinDto.value, "/users/signin", "POST");
      if (response2.code == 200) {
        router.push("/")
      }
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white border border-black">
    <div class="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 class="text-3xl font-bold text-center text-black-700 mb-6">회원가입</h2>
      <p class="text-center text-gray-500 mb-8 text-sm">계정 정보를 입력하여 회원가입하세요</p>

      <form @submit.prevent="handleSignup" class="space-y-6">
        <div>
          <label for="nickname" class="block text-sm font-medium text-gray-600">닉네임</label>
          <input
            id="nickname"
            v-model="signupDto.nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600">이메일</label>
          <input
            id="email"
            v-model="signupDto.email"
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
            v-model="signupDto.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          회원가입
        </button>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">
          이미 계정이 있으신가요?
          <a href="/user/signin" class="text-green-500 hover:underline">로그인</a>
        </p>
      </div>
    </div>
  </div>
</template>
