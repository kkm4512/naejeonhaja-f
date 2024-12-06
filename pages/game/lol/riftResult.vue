<script lang="ts" setup>
import { useLolStore } from '~/stores/lol/useLolStore';
import type { RiftResponseDto } from '~/types/res/resLolDto';
import type { ApiResponse } from '~/types/common';

const lolStore = useLolStore();

const calculateTotalMMR = (team: any[]) => {
  return team.reduce((total, player) => total + player.mmr, 0);
};

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

// 팀 다시 구성하기 메서드
const recomposeTeam = async () => {
  try {
    const reqPlayers = JSON.parse(localStorage.getItem('riftRequestPlayer') || '[]'); // 로컬스토리지에서 reqPlayers 가져오기
    if (!reqPlayers.length) {
      alert('팀 구성 데이터가 존재하지 않습니다.');
      return;
    }

    const riftResponseDto: ApiResponse<RiftResponseDto> = await lolFetch(reqPlayers, "rift");
    lolStore.setRiftResponseDto(riftResponseDto); // 결과 업데이트
  } catch (error) {
    console.error("Failed to recompose team:", error);
    alert("팀을 다시 구성하는 데 실패했습니다.");
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <!-- 총 MMR 점수 -->
    <div class="flex justify-center gap-10 mb-6 w-full max-w-4xl text-center">
      <div class="flex flex-col items-center">
        <span class="text-2xl font-semibold text-blue-600">Team A</span>
        <span class="text-lg font-bold text-blue-800">
          Total MMR: {{ calculateTotalMMR(lolStore.riftResponseDto?.data.teamA || []) }}
        </span>
      </div>
      <span class="text-lg font-bold text-gray-500">VS</span>
      <div class="flex flex-col items-center">
        <span class="text-2xl font-semibold text-red-600">Team B</span>
        <span class="text-lg font-bold text-red-800">
          Total MMR: {{ calculateTotalMMR(lolStore.riftResponseDto?.data.teamB || []) }}
        </span>
      </div>
    </div>

    <!-- 팀 컨테이너 -->
    <div class="flex gap-10 w-full max-w-4xl">
      <!-- Team A -->
      <div class="w-1/2 bg-blue-50 p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-blue-600 mb-4">Team A</h2>
        <ul class="space-y-2">
          <li
            v-for="(player, index) in lolStore.riftResponseDto?.data.teamA"
            :key="index"
            :class="`flex items-center gap-4 p-2 rounded-lg border-4 ${getTierGroupClass(player.tier)}`"
          >
            <span class="font-bold text-blue-800">{{ player.name }}</span>
            <span class="font-bold">{{ player.tier }}</span>
            <div class="flex gap-2 items-center">
              <div class="px-2 py-1 text-[10px] font-semibold rounded bg-blue-200 text-blue-700">
                {{ player.lines[0]?.line }}
              </div>
              <div
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded',
                  player.mmrReduced
                    ? 'bg-gray-300 text-gray-800' 
                    : 'bg-blue-300 text-blue-800'
                ]"
              >
                {{ player.mmrReduced ? 'Sub' : 'Main' }}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Team B -->
      <div class="w-1/2 bg-red-50 p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold text-red-600 mb-4">Team B</h2>
        <ul class="space-y-2">
          <li
            v-for="(player, index) in lolStore.riftResponseDto?.data.teamB"
            :key="index"
            :class="`flex items-center gap-4 p-2 rounded-lg border-4 ${getTierGroupClass(player.tier)}`"
          >
            <span class="font-bold text-red-800">{{ player.name }}</span>
            <span class="font-bold">{{ player.tier }}</span>
            <div class="flex gap-2 items-center">
              <div class="px-2 py-1 text-[10px] font-semibold rounded bg-red-200 text-red-700">
                {{ player.lines[0]?.line }}
              </div>
              <div
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded',
                  player.mmrReduced
                    ? 'bg-gray-300 text-gray-800'
                    : 'bg-red-300 text-red-800'
                ]"
              >
                {{ player.mmrReduced ? 'Sub' : 'Main' }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 팀 다시 구성하기 버튼 -->
    <div class="mt-6">
      <button
        @click="recomposeTeam"
        class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded shadow hover:bg-blue-700"
      >
        팀 다시 구성하기
      </button>
    </div>
  </div>
  <LolFooter />
</template>
