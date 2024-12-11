<script lang="ts" setup>
import { useLolStore } from '~/stores/lol/useLolStore';
import { useSwitchStore } from '~/stores/lol/useSwitchStore';
import type { ApiResponse } from '~/types/common';
import type { RiftPlayerRequestDto, RiftPlayerResultHistoryRequestDto, RiftPlayerResultRequestDto, RiftTeamResultRequestDto } from '~/types/game/lol/rift/req/reqLolDto';
import type { RiftPlayerResultHistoryResponseDetailDto, RiftTeamResponseDto } from '~/types/game/lol/rift/res/resLolDto';

const lolStore = useLolStore();
const switchStore = useSwitchStore();
const route = useRoute();
const id = route.params.id;

const calculateTotalMMR = (team: any[]) => {
  return team.reduce((total, player) => total + player.mmr, 0);
};

// 5:5 결과 제목
const playerResultHistoryTitle = ref<string>("");
const riftPlayerResultHistoryRequestDto: Ref<RiftPlayerResultHistoryRequestDto> = computed(() => ({
  playerResultHistoryTitle: playerResultHistoryTitle.value,
  teamA: lolStore.getRiftPlayerResultHistoryRequestDto()?.teamA || { outcome: null, team: [] },
  teamB: lolStore.getRiftPlayerResultHistoryRequestDto()?.teamB || { outcome: null, team: [] },
}));

// 대전결과 상세 정보 가져오기
const response = await uFetch<null,ApiResponse<RiftPlayerResultHistoryResponseDetailDto>>(null,`/game/lol/rift/playerResultHistory/detail/${id}`,"GET",true)



// 티어 그룹별 색상 매핑 함수
const getTierGroupClass = (tier: string) => {
  const tierGroupColors: Record<string, string> = {
    UNRANKED: "border-gray-200",
    IRON: "border-gray-400",
    BRONZE: "border-yellow-600",
    SILVER: "border-gray-200",
    GOLD: "border-yellow-300",
    PLATINUM: "border-green-300",
    EMERALD: "border-teal-300",
    DIAMOND: "border-blue-300",
    MASTER: "border-purple-400",
    GRANDMASTER: "border-red-400",
    CHALLENGER: "border-blue-400",
  };
  const tierGroup = tier.split("_")[0];
  return tierGroupColors[tierGroup] || "border-gray-200";
};

  // 라인 약어 변환 함수
const getAbbreviatedLine = (line: string | undefined) => {
  if (!line) return ''; // 라인이 없는 경우 빈 문자열 반환
  const lineAbbreviations: Record<string, string> = {
    SUPPORT: "SP",
    JUNGLE: "JG",
  };
  return lineAbbreviations[line] || line; // 매칭되지 않는 경우 원래 라인 이름 반환
};

// 승리팀
const winner = ref<string>('');

</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 p-6">
    <!-- 카드 전체 컨테이너 -->
    <div class="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
      <!-- 대전 내역 이름 -->
      <div class="mb-6">
        <label for="match-name" class="block text-xl font-semibold text-gray-800 mb-2">
          대전 결과 이름
        </label>
        <div
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
        {{ response.data.playerResultHistoryTitle }}
        </div>
      </div>

      <!-- Team A vs Team B -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-blue-700">Team A</span>
          <span class="text-lg font-semibold text-blue-800">
            Total MMR: {{ calculateTotalMMR(response.data.teamA || []) }}
          </span>
        </div>
        <span class="text-2xl font-extrabold text-gray-600">VS</span>
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-red-700">Team B</span>
          <span class="text-lg font-semibold text-red-800">
            Total MMR: {{ calculateTotalMMR(response.data.teamB || []) }}
          </span>
        </div>
      </div>

      <!-- 팀 멤버 리스트 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Team A -->
        <div
          class="relative p-6 rounded-xl shadow-lg transition"
          :class="response.data.teamA[0].outcome === 'WINNER' ? 'bg-blue-200 opacity-80' : response.data.teamA[0].outcome === 'DRAW' ? 'bg-blue-100' : 'bg-blue-50'"
        >
          <!-- Winner/Lose/Draw 표시 -->
          <div
            v-if="response.data.teamA[0].outcome === 'WINNER'"
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 text-yellow-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
          >
            Winner
          </div>
          <div
            v-if="response.data.teamA[0].outcome === 'LOSE'"
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 text-gray-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
          >
            Lose
          </div>
          <div
            v-if="response.data.teamA[0].outcome === 'DRAW'"
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 text-sm font-bold py-1 px-4 rounded-full shadow-md"
          >
            Draw
          </div>
          <h2 class="text-xl font-bold text-blue-700 mb-4">Team A</h2>
          <ul class="space-y-3">
            <li
              v-for="(player, index) in response.data.teamA"
              :key="index"
              :class="`flex items-center gap-4 p-3 rounded-lg border-4 transition ${getTierGroupClass(player.tier)} hover:scale-105`"
            >
              <span class="text-sm font-bold text-blue-900">{{ player.name }}</span>
              <span class="text-xs font-bold text-gray-800">{{ player.tier }}</span>
              <div class="flex gap-2 items-center">
                <div
                  class="px-3 py-1 text-xs font-semibold rounded bg-blue-200 text-blue-800 overflow-hidden text-ellipsis whitespace-nowrap"
                  style="max-width: 80px;"
                >
                  {{ getAbbreviatedLine(player.lines[0]?.line) }}
                </div>
                <div
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded',
                    player.mmrReduced
                      ? 'bg-gray-300 text-gray-800'
                      : 'bg-blue-300 text-blue-900'
                  ]"
                >
                  {{ player.mmrReduced ? 'Sub' : 'Main' }}
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Team B -->
        <div
          class="relative p-6 rounded-xl shadow-lg transition"
          :class="response.data.teamB[0].outcome === 'WINNER' ? 'bg-blue-200 opacity-80' : response.data.teamB[0].outcome === 'DRAW' ? 'bg-red-100' : 'bg-red-50'"
        >
          <!-- Winner/Lose/Draw 표시 -->
          <div
            v-if="response.data.teamB[0].outcome === 'WINNER'"
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 text-yellow-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
          >
            Winner
          </div>
          <div
            v-if="response.data.teamB[0].outcome === 'LOSE'"
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 text-gray-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
          >
            Lose
          </div>
          <div
            v-if="response.data.teamB[0].outcome === 'DRAW'"
            class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 text-sm font-bold py-1 px-4 rounded-full shadow-md"
          >
            Draw
          </div>
          <h2 class="text-xl font-bold text-red-700 mb-4">Team B</h2>
          <ul class="space-y-3">
            <li
              v-for="(player, index) in response.data.teamB"
              :key="index"
              :class="`flex items-center gap-4 p-3 rounded-lg border-4 transition ${getTierGroupClass(player.tier)} hover:scale-105`"
            >
              <span class="text-sm font-bold text-red-900">{{ player.name }}</span>
              <span class="text-xs font-bold text-gray-800">{{ player.tier }}</span>
              <div class="flex gap-2 items-center">
                <div
                  class="px-3 py-1 text-xs font-semibold rounded bg-red-200 text-red-800 overflow-hidden text-ellipsis whitespace-nowrap"
                  style="max-width: 80px;"
                >
                  {{ getAbbreviatedLine(player.lines[0]?.line) }}
                </div>
                <div
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded',
                    player.mmrReduced
                      ? 'bg-gray-300 text-gray-800'
                      : 'bg-red-300 text-red-900'
                  ]"
                >
                  {{ player.mmrReduced ? 'Sub' : 'Main' }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <LolFooter />
</template>