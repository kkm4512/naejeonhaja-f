<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 p-6">
      <!-- 카드 전체 컨테이너 -->
      <div class="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        <!-- 대전 내역 이름 -->
        <div class="mb-6">
          <label for="match-name" class="block text-xl font-semibold text-gray-800 mb-2">
            대전 결과 이름
          </label>
          <input
            id="match-name"
            v-model="playerResultHistoryTitle"
            type="text"
            placeholder="저장할 대전 결과 이름을 기재하세요"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
  
        <!-- Team A vs Team B -->
        <div class="flex justify-between items-center mb-8">
          <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-blue-700">Team A</span>
            <span class="text-lg font-semibold text-blue-800">
              Total MMR: {{ calculateTotalMMR(riftTeamResponseDto.teamA || []) }}
            </span>
          </div>
          <span class="text-2xl font-extrabold text-gray-600">VS</span>
          <div class="flex flex-col items-center">
            <span class="text-3xl font-bold text-red-700">Team B</span>
            <span class="text-lg font-semibold text-red-800">
              Total MMR: {{ calculateTotalMMR(riftTeamResponseDto.teamB || []) }}
            </span>
          </div>
        </div>
  
        <!-- 팀 멤버 리스트 -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Team A -->
          <div
            class="relative p-6 rounded-xl shadow-lg transition"
            :class="winner === 'TeamB' ? 'bg-blue-200 opacity-80' : winner === 'Draw' ? 'bg-blue-100' : 'bg-blue-50'"
          >
            <!-- Winner/Lose/Draw 표시 -->
            <div
              v-if="winner === 'TeamA'"
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 text-yellow-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
            >
              Winner
            </div>
            <div
              v-if="winner === 'TeamB'"
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 text-gray-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
            >
              Lose
            </div>
            <div
              v-if="winner === 'Draw'"
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 text-sm font-bold py-1 px-4 rounded-full shadow-md"
            >
              Draw
            </div>
            <h2 class="text-xl font-bold text-blue-700 mb-4">Team A</h2>
            <ul class="space-y-3">
              <li
                v-for="(player, index) in riftTeamResponseDto.teamA"
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
                    {{ getAbbreviatedLine(player.lines?.[0]?.line) }}
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
            <!-- Team A 승리 버튼 -->
            <button
              @click="declareWinner('TeamA')"
              class="mt-4 w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition"
            >
              Team A 승리
            </button>
          </div>
  
          <!-- Team B -->
          <div
            class="relative p-6 rounded-xl shadow-lg transition"
            :class="winner === 'TeamA' ? 'bg-red-200 opacity-80' : winner === 'Draw' ? 'bg-red-100' : 'bg-red-50'"
          >
            <!-- Winner/Lose/Draw 표시 -->
            <div
              v-if="winner === 'TeamB'"
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 text-yellow-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
            >
              Winner
            </div>
            <div
              v-if="winner === 'TeamA'"
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 text-gray-800 text-sm font-bold py-1 px-4 rounded-full shadow-md"
            >
              Lose
            </div>
            <div
              v-if="winner === 'Draw'"
              class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 text-sm font-bold py-1 px-4 rounded-full shadow-md"
            >
              Draw
            </div>
            <h2 class="text-xl font-bold text-red-700 mb-4">Team B</h2>
            <ul class="space-y-3">
              <li
                v-for="(player, index) in riftTeamResponseDto.teamB"
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
                    {{ getAbbreviatedLine(player.lines?.[0]?.line) }}
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
            <!-- Team B 승리 버튼 -->
            <button
              @click="declareWinner('TeamB')"
              class="mt-4 w-full py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition"
            >
              Team B 승리
            </button>
          </div>
        </div>
  
        <!-- 무승부 버튼 -->
        <div class="mt-8 flex justify-center">
          <button
            @click="declareWinner('Draw')"
            class="px-8 py-4 bg-gray-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-gray-700 hover:scale-105 transition"
          >
            무승부
          </button>
        </div>
  
        <!-- 이전으로, 팀 다시 구성하기, 저장 버튼 -->
        <div class="mt-6 flex justify-between gap-4">
          <button
            @click="goBack"
            class="w-full px-6 py-3 bg-gray-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-gray-700 hover:scale-105 transition"
          >
            이전으로
          </button>
          <button
            @click="recomposeTeam"
            class="w-full px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition"
          >
            팀 다시 구성하기
          </button>
          <button
            @click="saveTeam"
            class="w-full px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </template>
    
  <script setup lang="ts">
  import { useLolStore } from '~/stores/lol/useLolStore';
  import { useSwitchStore } from '~/stores/lol/useSwitchStore';
  import type { ApiResponse } from '~/types/common';
  import type { LolPlayerDto, LolTeamResultDto } from '~/types/game/lol/rift/common';
  import type { LolPlayerResultHistoryRequestDto } from '~/types/game/lol/rift/req/reqLolDto';
  import type { LolTeamResponseDto } from '~/types/game/lol/rift/res/resLolDto';

 onMounted(() => {
   lolStore.loadTeams(); // Session Storage에서 데이터 복원
});

  // 데이터
  const lolStore = useLolStore();
  const winner = ref<string>("");
  const switchStore = useSwitchStore();
  const playerResultHistoryTitle = ref<string>("");

  const riftTeamResponseDto: Ref<LolTeamResponseDto> = computed(() =>({
    teamA: lolStore.riftTeamA,
    teamB: lolStore.riftTeamB,
  })
)
  
  // PlayerResultHistory
  const riftTeamResultRequestDtoA: Ref<LolTeamResultDto> = ref({
    outcome: null,
    team: riftTeamResponseDto.value.teamA
  })
  
  const riftTeamResultRequestDtoB: Ref<LolTeamResultDto> = ref({
    outcome: null,
    team: riftTeamResponseDto.value.teamB
  })
  
  const riftPlayerResultHistoryRequestDto: Ref<LolPlayerResultHistoryRequestDto> = computed(() => ({
    playerResultHistoryTitle: playerResultHistoryTitle.value,
    teamA: riftTeamResultRequestDtoA.value,
    teamB: riftTeamResultRequestDtoB.value
  }));
  
  // 메서드
  const declareWinner = (team: string) => {
    winner.value = team; // 승리한 팀 설정
    
    if (team === 'TeamA') {
      riftPlayerResultHistoryRequestDto.value.teamA.outcome = "WINNER"
      riftPlayerResultHistoryRequestDto.value.teamB.outcome = "LOSE";
    } else if (team === 'TeamB') {
      riftPlayerResultHistoryRequestDto.value.teamA.outcome = "LOSE";
      riftPlayerResultHistoryRequestDto.value.teamB.outcome = "WINNER";
    } else if (team === 'Draw') {
      riftPlayerResultHistoryRequestDto.value.teamA.outcome = "DRAW";
      riftPlayerResultHistoryRequestDto.value.teamB.outcome = "DRAW";
    }
  };
  
  // 이전으로 버튼 메서드
  const goBack = () => {
    switchStore.onRiftGoBackedSwitch();
    window.history.back();
  };
  
  // 팀 다시 구성하기 메서드 - 임시
  const recomposeTeam = async () => {
    const combinedPlayerList: LolPlayerDto[] = [
      ...riftTeamResponseDto.value.teamA,
      ...riftTeamResponseDto.value.teamB
    ];
    try {
      const response = await uFetch<LolPlayerDto[],ApiResponse<LolTeamResponseDto>>(combinedPlayerList, "/game/lol/rift", "POST");
      lolStore.setTeams(response.data.teamA,response.data.teamB);
    } catch (error) {
      alert("팀을 다시 구성하는 데 실패했습니다.");
    }
  };
  
  // 저장 버튼 메서드
  const saveTeam = async() => {
    const response = await uFetch<LolPlayerResultHistoryRequestDto,ApiResponse<null>>(riftPlayerResultHistoryRequestDto.value,"/game/lol/rift/playerResultHistory","POST",true);
    if (response.code === 200) {
      alert("저장에 성공 하였습니다 !")
    }
  };
  
  </script>
  