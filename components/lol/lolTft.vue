<script lang="ts" setup>
import { ref } from 'vue';
import { useLolStore } from '~/stores/lol/useLolStore';
import type { ApiResponse, Tier } from '~/types/common';
import type { AbyssRequestPlayer, TftRequestPlayer } from '~/types/req/reqLolDto';
import type { TftResponseDto } from '~/types/res/resLolDto';

const router = useRouter(); // Vue Router 사용
const lolStore = useLolStore();

// 예시 데이터
const sampleNicknames = [
  "Summoner1", "Summoner2", "Summoner3", "Summoner4", "Summoner5",
  "Summoner6", "Summoner7", "Summoner8", "Summoner9", "Summoner10"
];

const tiers: Tier[] = [
  "UNRANKED",
  "IRON_IV", "IRON_III", "IRON_II", "IRON_I",
  "BRONZE_IV", "BRONZE_III", "BRONZE_II", "BRONZE_I",
  "SILVER_IV", "SILVER_III", "SILVER_II", "SILVER_I",
  "GOLD_IV", "GOLD_III", "GOLD_II", "GOLD_I",
  "PLATINUM_IV", "PLATINUM_III", "PLATINUM_II", "PLATINUM_I",
  "EMERALD_IV", "EMERALD_III", "EMERALD_II", "EMERALD_I",
  "DIAMOND_IV", "DIAMOND_III", "DIAMOND_II", "DIAMOND_I",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER"
];


// 모든 플레이어 정보를 저장
const players = ref<AbyssRequestPlayer[]>(Array.from({ length: 8 }, () => ({ name: "", tier: tiers[0] })));

// 랜덤 데이터 생성 함수
const generateRandomData = () => {
  const usedNicknames = new Set<string>();

  const randomNickname = () => {
    let nickname;
    do {
      nickname = sampleNicknames[Math.floor(Math.random() * sampleNicknames.length)];
    } while (usedNicknames.has(nickname));
    usedNicknames.add(nickname);
    return nickname;
  };

  const randomTier = () => tiers[Math.floor(Math.random() * tiers.length)];

  players.value.forEach((player) => {
    player.name = randomNickname();
    player.tier = randomTier();
  });
};

// 서버로 데이터 전달 함수
const sendToServer = async () => {
  try {
    const response = await lolFetch<TftRequestPlayer,ApiResponse<TftResponseDto>>(players.value, "tft");
    lolStore.setTftResponseDto(response);
    lolStore.setTftRequestPlayer(players.value);
    router.push("/game/lol/tftResult")
  } catch (error) {
    console.error("Failed to send players:", error);
    alert("플레이어 정보를 전송하는 데 실패했습니다.");
  }
};

// 부모 컴포넌트로부터 받는 제목
</script>

<template>
  <div class="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6"> 롤토체스 </h1>

    <!-- 랜덤 데이터 생성 버튼 -->
    <button
      @click="generateRandomData"
      class="mb-6 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
    >
      랜덤 데이터 생성
    </button>

    <!-- 팀 정보 -->
    <div class="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center bg-teal-400 text-white py-3 rounded-md mb-6">Team Info</h2>

      <!-- 플레이어 목록 두 열로 나누기 -->
      <div class="flex justify-between">
        <!-- 왼쪽 열 -->
        <div class="w-1/2 px-4">
          <ul class="space-y-4">
            <li
              v-for="(player, index) in players.slice(0, 4)"
              :key="index"
              class="p-3 bg-gray-100 border border-gray-300 rounded-md"
            >
              <div class="flex items-center justify-between">
                <input
                  v-model="player.name"
                  class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3"
                  placeholder="Player Nickname"
                />
                <select v-model="player.tier" class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3">
                  <option v-for="tier in tiers" :key="tier" :value="tier">{{ tier }}</option>
                </select>
              </div>
            </li>
          </ul>
        </div>

        <!-- 오른쪽 열 -->
        <div class="w-1/2 px-4">
          <ul class="space-y-4">
            <li
              v-for="(player, index) in players.slice(4, 8)"
              :key="index + 5"
              class="p-3 bg-gray-100 border border-gray-300 rounded-md"
            >
              <div class="flex items-center justify-between">
                <input
                  v-model="player.name"
                  class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3"
                  placeholder="Player Nickname"
                />
                <select v-model="player.tier" class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3">
                  <option v-for="tier in tiers" :key="tier" :value="tier">{{ tier }}</option>
                </select>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 서버로 전송 버튼 -->
    <button
      @click="sendToServer"
      class="mt-6 px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-md shadow hover:bg-orange-600 transition"
    >
      확인
    </button>
  </div>
  <LolFooter />
</template>
