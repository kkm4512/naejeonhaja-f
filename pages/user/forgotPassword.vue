<script lang="ts" setup>
import { ref } from "vue";
import type { ApiResponse } from "~/types/common";
import type { SendVerificationCodeDto, UpdatePasswordDto, VerificationCodeDto } from "~/types/user/req/ForgotPasswordDto";

const email = ref<string>("");
const code = ref<string>("");
const newPassword = ref<string>("");
const confirmPassword = ref<string>("");
const isCodeSent = ref(false);
const isCodeVerified = ref(false);
const router = useRouter();

const sendVerificationCodeDto: Ref<SendVerificationCodeDto> = computed(() => ({
  email: email.value,
}));

const verificationCodeDto: Ref<VerificationCodeDto> = computed(() => ({
  email: email.value,
  code: code.value,
}));

const updatePasswordDto: Ref<UpdatePasswordDto> = computed(() => ({
  email: email.value,
  password: newPassword.value
}));


const sendCode = async () => {
  try {
    const response = await uFetch<SendVerificationCodeDto, ApiResponse<void>>(sendVerificationCodeDto.value,"/users/send-code","POST");
    if (response.code === 200) {
      alert("인증번호가 이메일로 전송되었습니다.");
      isCodeSent.value = true;
    } else {
      alert("오류가 발생했습니다. 이메일을 확인해주세요.");
    }
  } catch (error) {
    alert("서버에 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

const verifyCode = async () => {
  if (!code.value) {
    alert("인증번호를 입력해주세요.");
    return;
  }
  try {
    const response = await uFetch<VerificationCodeDto,ApiResponse<void>>(verificationCodeDto.value,"/users/verify-code","POST");
    if (response.code === 200) {
      alert("인증번호가 확인되었습니다.");
      isCodeVerified.value = true;
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  } catch (error) {
    alert("서버에 문제가 발생했습니다. 다시 시도해주세요.");
  }
};

const updatePassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    alert("모든 필드를 입력해주세요.");
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
    const response = await uFetch<UpdatePasswordDto, ApiResponse<void>>(updatePasswordDto.value,"/users/update-password","PUT");
    if (response.code === 200) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      router.push("/")
    } else {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-white border border-black">
    <div class="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg border border-gray-300">
      <h2 class="text-3xl font-bold text-center text-black-700 mb-6">비밀번호 찾기</h2>
      <p class="text-center text-gray-500 mb-8 text-sm">이메일 주소를 입력하여 인증번호를 요청하세요.</p>

      <!-- 이메일 입력 -->
      <div class="flex items-center">
        <div class="flex-1">
          <label for="email" class="block text-sm font-medium text-gray-600">이메일</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="이메일 주소를 입력하세요"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="button"
          @click="sendCode"
          class="ml-4 mt-6 py-2 px-4 bg-green-600 text-white text-sm font-semibold rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          확인
        </button>
      </div>

      <!-- 인증번호 입력 -->
      <div v-if="isCodeSent" class="flex items-center mt-6">
        <div class="flex-1">
          <label for="verificationCode" class="block text-sm font-medium text-gray-600">인증번호</label>
          <input
            id="verificationCode"
            v-model="code"
            type="text"
            placeholder="인증번호 6자리를 입력하세요"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="button"
          @click="verifyCode"
          class="ml-4 mt-6 py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          인증
        </button>
      </div>

      <!-- 비밀번호 변경 -->
      <div v-if="isCodeVerified" class="mt-6">
        <div class="mb-4">
          <label for="newPassword" class="block text-sm font-medium text-gray-600">새 비밀번호</label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-600">비밀번호 확인</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            class="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="updatePassword"
          class="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
/* 기본 스타일링 */
</style>
