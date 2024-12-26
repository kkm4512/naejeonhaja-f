<script lang="ts" setup>
import { ref } from "vue";
import  { jwtDecode }  from "jwt-decode"; // npm install jwt-decode
import type { User } from "~/types/user/req/User";

// 모바일 메뉴 상태
const isMobileMenuOpen = ref(false);

// 모바일 메뉴 토글 함수
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// LOL 드롭다운 상태 관리
const isLolDropdownOpen = ref(false);

// LOL 드롭다운 토글 함수
const lolToggleDropdown = () => {
  isLolDropdownOpen.value = !isLolDropdownOpen.value;
};

// 사용자 상태
const jwt = ref<string | null>("");
const nickname = ref<string | null>(null)
const cookie = useCookie("Authorization");

onMounted(async () => {
  if (cookie.value) {
    jwt.value = cookie.value;
    const user: User = jwtDecode(jwt.value);
    nickname.value = user.nickname;
  }
});

// JWT 값 감시 및 닉네임 추출
watch(
  () => cookie.value, // cookie.value만 감지
  (newVal) => {
    if (newVal) {
      jwt.value = newVal;
      const user: User = jwtDecode(newVal);
      nickname.value = user.nickname;
    } else {
      jwt.value = null;
      nickname.value = "";
    }
  }
);


// 상태 관리
const isResultDropdownOpen = ref(false)

const resultToggleDropdown = () => {
  isResultDropdownOpen.value = !isResultDropdownOpen.value
}
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/logo/logo.webp" class="h-12 w-12 rounded-full" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">내전하자</span>
      </a>
      <!-- 모바일 메뉴 버튼 -->
      <button
        data-collapse-toggle="navbar-default"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded="false"
        @click="toggleMobileMenu"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <!-- 네비게이션 메뉴 -->
      <div
        :class="{ hidden: !isMobileMenuOpen, block: isMobileMenuOpen }"
        class="w-full md:block md:w-auto"
        id="navbar-default"
      >
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li class="relative">
            <!-- LOL -->
            <a
              href="#"
              @click.prevent="lolToggleDropdown"
              class="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              LOL
              <!-- 화살표 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 ml-1 transition-transform"
                :class="{ 'rotate-180': isLolDropdownOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <!-- 드롭다운 메뉴 -->
            <ul
              v-if="isLolDropdownOpen"
              class="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg dark:bg-gray-800"
            >
              <li>
                <a
                  href="/game/lol/rift"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  소환사의 협곡
                </a>
              </li>
              <li>
                <a
                  href="/game/lol/abyss"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  칼바람 나락
                </a>
              </li>
            </ul>
          </li>
          <span class="mx-2 w-px h-6 bg-white hidden md:inline-block"></span>
          <li class="relative">
            <!-- 대전결과 -->
            <a
              href="#"
              @click.prevent="resultToggleDropdown"
              class="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              내 대전결과
              <!-- 화살표 아이콘 -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 ml-1 transition-transform"
                :class="{ 'rotate-180': isResultDropdownOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <!-- 드롭다운 메뉴 -->
            <ul
              v-if="isResultDropdownOpen"
              class="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg dark:bg-gray-800"
            >
              <li>
                <a
                  href="/game/lol/rift/results"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  소환사의 협곡
                </a>
              </li>
              <li>
                <a
                  href="/game/lol/abyss/results"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  칼바람 나락
                </a>
              </li>
            </ul>
          </li>
          <span class="mx-2 w-px h-6 bg-white hidden md:inline-block"></span>
          <li>
            <a
              href="https://open.kakao.com/o/gKcd196g"
              class="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
            문의
          </a>
          </li>
          <span class="mx-2 w-px h-6 bg-white hidden md:inline-block"></span>
          <li>
            <!-- 로그인/닉네임 표시 -->
            <a
              v-if="!jwt"
              href="/user/signin"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              로그인
            </a>
            <span
              v-else
              class="flex items-center space-x-3 text-gray-900 py-2 px-3 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:p-0 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              {{ nickname }} 님 환영합니다
              <button
                @click="logout()"
                class="ml-4 block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:bg-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                로그아웃
              </button>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

