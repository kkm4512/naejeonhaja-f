<script lang="ts" setup>
import type { Line, Player } from '~/types/lolType';
import { ref } from 'vue';

// 예시 데이터
const sampleNicknames = [
  "Summoner1", "Summoner2", "Summoner3", "Summoner4", "Summoner5",
  "Summoner6", "Summoner7", "Summoner8", "Summoner9", "Summoner10"
];

const tiers = [
  "Unranked",
  "Iron IV", "Iron III", "Iron II", "Iron I",
  "Bronze IV", "Bronze III", "Bronze II", "Bronze I",
  "Silver IV", "Silver III", "Silver II", "Silver I",
  "Gold IV", "Gold III", "Gold II", "Gold I",
  "Platinum IV", "Platinum III", "Platinum II", "Platinum I",
  "Emerald IV", "Emerald III", "Emerald II", "Emerald I",
  "Diamond IV", "Diamond III", "Diamond II", "Diamond I",
  "Master",
  "Grandmaster",
  "Challenger"
];

const lines: Line[] = ["탑", "정글", "미드", "원딜", "서폿"];

// 모든 플레이어 정보를 저장
const players = ref<Player[]>(Array.from({ length: 10 }, () => ({ name: "", tier: "Unranked", lines: [] })));

// 랜덤 데이터 생성 함수
const generateRandomData = () => {
  const randomNickname = () => sampleNicknames[Math.floor(Math.random() * sampleNicknames.length)];
  const randomTier = () => tiers[Math.floor(Math.random() * tiers.length)];
  const randomlines = () => {
    const selectedlines: Line[] = [];
    const lineCount = Math.floor(Math.random() * lines.length) + 1;
    while (selectedlines.length < lineCount) {
      const randomline = lines[Math.floor(Math.random() * lines.length)];
      if (!selectedlines.includes(randomline)) {
        selectedlines.push(randomline);
      }
    }
    return selectedlines;
  };

  players.value.forEach((player) => {
    player.name = randomNickname();
    player.tier = randomTier();
    player.lines = randomlines();
  });
};

// 역할 업데이트 함수
const updatelines = (player: Player, line: Line): void => {
  if (player.lines.includes(line)) {
    player.lines = player.lines.filter((l) => l !== line);
  } else {
    player.lines.push(line);
  }
};

// 서버로 데이터 전달 함수
const sendToServer = async () => {
  try {
    const response = await lolFetch(players.value, "rift");
    console.log("Players sent successfully:", await response.json());
    alert("플레이어 정보가 성공적으로 전송되었습니다!");
  } catch (error) {
    console.error("Failed to send players:", error);
    alert("플레이어 정보를 전송하는 데 실패했습니다.");
  }
};

// 부모 컴포넌트로 부터 받는 제목
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6"> {{ props.title }} </h1>

    <!-- 랜덤 데이터 생성 버튼 -->
    <button
      @click="generateRandomData"
      class="mb-6 px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
    >
      랜덤 데이터 생성
    </button>

    <!-- 팀 정보 -->
    <div class="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center bg-teal-400 text-white py-3 rounded-md mb-6">  Team Info </h2>


      <!-- 플레이어 목록 두 열로 나누기 -->
      <div class="flex justify-between">
        <!-- 왼쪽 열 -->
        <div class="w-1/2 px-4">
          <ul class="space-y-4">
            <li
              v-for="(player, index) in players.slice(0, 5)"
              :key="index"
              class="p-3 bg-gray-100 border border-gray-300 rounded-md"
            >
              <div class="flex items-center justify-between">
                <!-- 닉네임 입력 -->
                <input
                  v-model="player.name"
                  class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3"
                  placeholder="닉네임 입력"
                />
                <!-- 티어 선택 -->
                <select v-model="player.tier" class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3">
                  <option v-for="tier in tiers" :key="tier" :value="tier">{{ tier }}</option>
                </select>
              </div>
              <div class="mt-2">
                <span class="font-medium text-sm">Lines:</span>
                <div class="flex gap-2 mt-2">
                  <button
                    v-for="line in lines"
                    :key="line"
                    :class="[
                      'px-3 py-1 rounded-md text-sm border',
                      player.lines.includes(line) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    ]"
                    @click="updatelines(player, line)"
                  >
                    {{ line }}
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 오른쪽 열 -->
        <div class="w-1/2 px-4">
          <ul class="space-y-4">
            <li
              v-for="(player, index) in players.slice(5, 10)"
              :key="index + 5"
              class="p-3 bg-gray-100 border border-gray-300 rounded-md"
            >
              <div class="flex items-center justify-between">
                <!-- 닉네임 입력 -->
                <input
                  v-model="player.name"
                  class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3"
                  placeholder="닉네임 입력"
                />
                <!-- 티어 선택 -->
                <select v-model="player.tier" class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3">
                  <option v-for="tier in tiers" :key="tier" :value="tier">{{ tier }}</option>
                </select>
              </div>
              <div class="mt-2">
                <span class="font-medium text-sm">Lines:</span>
                <div class="flex gap-2 mt-2">
                  <button
                    v-for="line in lines"
                    :key="line"
                    :class="[
                      'px-3 py-1 rounded-md text-sm border',
                      player.lines.includes(line) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    ]"
                    @click="updatelines(player, line)"
                  >
                    {{ line }}
                  </button>
                </div>
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
      데이터 전송
    </button>
  </div>
</template>


