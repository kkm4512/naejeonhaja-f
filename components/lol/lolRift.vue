<script lang="ts" setup>
import { ref } from 'vue';
import { useLolStore } from '~/stores/lol/useLolStore';
import type { ApiResponse, Line, LineRole, Lines, Tier } from '~/types/common';
import type { RiftRequestPlayer } from '~/types/req/reqLolDto';
import type { RiftResponseDto } from '~/types/res/resLolDto';

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

const lines: Line[] = ["TOP", "JUNGLE", "MID", "AD", "SUPPORT"];

// 모든 플레이어 정보를 저장
const players = ref<RiftRequestPlayer[]>(Array.from({ length: 10 }, () => ({ name: "", tier: tiers[0], lines: [] })));

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

  const randomlines = (): Lines[] => {
    const selectedlines: Lines[] = [];
    const lineCount = Math.floor(Math.random() * lines.length) + 1;
    while (selectedlines.length < lineCount) {
      const randomline = lines[Math.floor(Math.random() * lines.length)] as Line;
      if (!selectedlines.find((l) => l.line === randomline)) {
        const type = Math.random() > 0.5 ? "MAINLINE" : "SUBLINE";
        selectedlines.push({ line: randomline, lineRole: type });
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
const updatelines = (player: RiftRequestPlayer, line: Line, type: LineRole): void => {
  const existing = player.lines.find((l) => l.line === line);

  if (existing) {
    // 이미 선택된 라인인 경우 역할 변경
    if (existing.lineRole === type) {
      existing.lineRole = null; // 선택 해제
    } else {
      existing.lineRole = type; // 역할 변경
    }
  } else {
    // 새 라인 추가
    player.lines.push({ line, lineRole: type });
  }
};

// 서버로 데이터 전달 함수
const sendToServer = async () => {
  const response = await lolFetch<RiftRequestPlayer,ApiResponse<RiftResponseDto>>(players.value, "rift");
  lolStore.setRiftRequestPlayer(players.value);
  lolStore.setRiftResponseDto(response);
  router.push("/game/lol/riftResult")
};

</script>

<template>
  <div class="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-6"> 소환사의 협곡 </h1>

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
              v-for="(player, index) in players.slice(0, 5)"
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
              <div class="mt-2">
                <span class="font-medium text-sm">Lines:</span>
                <div class="flex gap-2 mt-2">
                  <div v-for="line in lines" :key="line" class="flex flex-col items-center">
                    <span class="font-bold">{{ line }}</span>
                    <button
                      class="px-3 py-1 rounded-md text-sm border"
                      :class="{
                        'bg-gray-300 text-black': !player.lines.find((l) => l.line === line && l.lineRole === 'MAINLINE'),
                        'bg-blue-500 text-white': player.lines.find((l) => l.line === line && l.lineRole === 'MAINLINE')
                      }"
                      @click="updatelines(player, line, 'MAINLINE')"
                    >
                      MainLine
                    </button>
                    <button
                      class="px-3 py-1 rounded-md text-sm border"
                      :class="{
                        'bg-gray-300 text-black': !player.lines.find((l) => l.line === line && l.lineRole === 'SUBLINE'),
                        'bg-green-500 text-white': player.lines.find((l) => l.line === line && l.lineRole === 'SUBLINE')
                      }"
                      @click="updatelines(player, line, 'SUBLINE')"
                    >
                      SubLine
                    </button>
                  </div>
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
                <input
                  v-model="player.name"
                  class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3"
                  placeholder="Player Nickname"
                />
                <select v-model="player.tier" class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3">
                  <option v-for="tier in tiers" :key="tier" :value="tier">{{ tier }}</option>
                </select>
              </div>

              <div class="mt-2">
                <span class="font-medium text-sm">Lines:</span>
                <div class="flex gap-2 mt-2">
                  <div v-for="line in lines" :key="line" class="flex flex-col items-center">
                    <span class="font-bold">{{ line }}</span>
                    <button
                      class="px-3 py-1 rounded-md text-sm border"
                      :class="{
                        'bg-gray-300 text-black': !player.lines.find((l) => l.line === line && l.lineRole === 'MAINLINE'),
                        'bg-blue-500 text-white': player.lines.find((l) => l.line === line && l.lineRole === 'MAINLINE')
                      }"
                      @click="updatelines(player, line, 'MAINLINE')"
                    >
                      MainLine
                    </button>
                    <button
                      class="px-3 py-1 rounded-md text-sm border"
                      :class="{
                        'bg-gray-300 text-black': !player.lines.find((l) => l.line === line && l.lineRole === 'SUBLINE'),
                        'bg-green-500 text-white': player.lines.find((l) => l.line === line && l.lineRole === 'SUBLINE')
                      }"
                      @click="updatelines(player, line, 'SUBLINE')"
                    >
                      SubLine
                    </button>
                  </div>
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
      확인
    </button>
  </div>
  <LolFooter />
</template>
