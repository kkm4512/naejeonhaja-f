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
            Total MMR: {{ calculateTotalMMR(lolTeamResponseDto.teamA || []) }}
          </span>
        </div>
        <span class="text-2xl font-extrabold text-gray-600">VS</span>
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-red-700">Team B</span>
          <span class="text-lg font-semibold text-red-800">
            Total MMR: {{ calculateTotalMMR(lolTeamResponseDto.teamB || []) }}
          </span>
        </div>
      </div>

      <!-- 팀 멤버 리스트 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Team A -->
        <div
          class="relative p-6 rounded-xl shadow-lg transition"
          :class="getTeamBackgroundClass(lolPlayerResultHistoryRequestDto.teamA.outcome,'TeamA')"
        >
          <!-- Winner/Lose/Draw 표시 -->
          <div
            :class="getOutcomeClass(lolPlayerResultHistoryRequestDto.teamA.outcome).class"
          >
            {{ getOutcomeClass(lolPlayerResultHistoryRequestDto.teamA.outcome).text }}
          </div>
          <ul class="space-y-3">
            <li
              v-for="(player, index) in lolTeamResponseDto.teamA"
              :key="index"
              class="flex flex-col gap-2 p-3 rounded-lg border-4 transition hover:scale-105"
              :class="getTierGroupClass(player.tier)"
            >
              <div class="flex items-center gap-4 w-full">
                <span class="text-sm font-bold text-blue-900">{{ getPlayerName(player.name) }}</span>
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
                      player.mmrReduced ? 'bg-gray-300 text-gray-800' : 'bg-blue-300 text-blue-900'
                    ]"
                  >
                    {{ player.mmrReduced ? 'Sub' : 'Main' }}
                  </div>
                </div>
              </div>
              <!-- 전력확인 버튼을 아래로 배치 -->
              <button 
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-xs text-white font-semibold rounded-lg shadow-md 
                      hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 
                      transform hover:scale-110 transition-all duration-300 ease-out self-end"
                @click="handleModalOpen(player, $event)"
              >
                전력확인
              </button>
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
          :class="getTeamBackgroundClass(lolPlayerResultHistoryRequestDto.teamB.outcome,'TeamB')"
        >
          <!-- Winner/Lose/Draw 표시 -->
          <div
            :class="getOutcomeClass(lolPlayerResultHistoryRequestDto.teamB.outcome).class"
          >
            {{ getOutcomeClass(lolPlayerResultHistoryRequestDto.teamB.outcome).text }}
          </div>
          <ul class="space-y-3">
            <li
              v-for="(player, index) in lolTeamResponseDto.teamB"
              :key="index"
              class="flex flex-col gap-2 p-3 rounded-lg border-4 transition hover:scale-105"
              :class="getTierGroupClass(player.tier)"
            >
              <div class="flex items-center gap-4 w-full">
                <span class="text-sm font-bold text-red-900">{{ getPlayerName(player.name) }}</span>
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
                      player.mmrReduced ? 'bg-gray-300 text-gray-800' : 'bg-red-300 text-red-900'
                    ]"
                  >
                    {{ player.mmrReduced ? 'Sub' : 'Main' }}
                  </div>
                </div>
              </div>
              <!-- 전력확인 버튼을 아래로 배치 -->
              <button 
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-xs text-white font-semibold rounded-lg shadow-md 
                      hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 
                      transform hover:scale-110 transition-all duration-300 ease-out self-end"
                @click="handleModalOpen(player, $event)"
              >
                전력확인
              </button>
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

      <!-- 무승부 버튼과 결과 복사하기 버튼 -->
      <div class="mt-8 flex justify-center gap-4">
        <button
          @click="declareWinner('Draw')"
          class="px-8 py-4 bg-gray-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-gray-700 hover:scale-105 transition"
        >
          무승부
        </button>
        <button
          @click="copyResults"
          class="px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-700 hover:scale-105 transition"
        >
          결과 복사하기
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
  <div v-if="isModalOpen">
    <LolSeriousPlayerDetail :player="hoveredPlayer" :position="modalPosition" />
  </div>
  <LolFooter />
</template>
    
  <script setup lang="ts">
  import LolFooter from '~/components/game/lol/LolFooter.vue';
  import LolSeriousPlayerDetail from '~/components/game/lol/LolSeriousPlayerDetail.vue';
  import { useLolStore } from '~/stores/lol/useLolStore';
  import { useSwitchStore } from '~/stores/lol/useSwitchStore';
  import type { ApiResponse } from '~/types/common';
  import type { LolPlayerDto, LolTeamResultDto } from '~/types/game/lol/common';
  import type { LolPlayerHistoryRequestDto, LolPlayerResultHistoryRequestDto } from '~/types/game/lol/req/reqLolDto';
  import type { LolTeamResponseDto } from '~/types/game/lol/res/resLolDto';

 onMounted(() => {
   lolStore.loadRiftTeams(); 
   lolStore.loadInitRiftTeamsWithTitle()
});

  // 데이터
  const lolStore = useLolStore();
  const winner = ref<string>("");
  const switchStore = useSwitchStore();
  const playerResultHistoryTitle = ref<string>("");
  const hoveredPlayer = ref<LolPlayerDto | null>(null);
  const isModalOpen = ref<boolean>(false);
  const modalPosition = ref({ x: 0, y: 0 });
  const hoverTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const lolTeamResponseDto: Ref<LolTeamResponseDto> = computed(() =>({
    teamA: lolStore.riftTeamA,
    teamB: lolStore.riftTeamB,
  })
)
  
  // PlayerResultHistory
  const lolTeamResultRequestDtoA: Ref<LolTeamResultDto> = ref({
    outcome: null,
    team: lolTeamResponseDto.value.teamA
  })
  
  const lolTeamResultRequestDtoB: Ref<LolTeamResultDto> = ref({
    outcome: null,
    team: lolTeamResponseDto.value.teamB
  })
  
  const lolPlayerResultHistoryRequestDto: Ref<LolPlayerResultHistoryRequestDto> = computed(() => ({
    playerResultHistoryTitle: playerResultHistoryTitle.value,
    teamA: lolTeamResultRequestDtoA.value,
    teamB: lolTeamResultRequestDtoB.value,
  })
)
  
  // 메서드

  const handleModalOpen = (player: LolPlayerDto, event: MouseEvent) => {
    hoveredPlayer.value = player;
    modalPosition.value = {
        x: event.clientX + 10, // 마우스 위치 기준 약간 오른쪽
        y: event.clientY + 10  // 마우스 위치 기준 약간 아래쪽
    };
    isModalOpen.value = true;
};


  const handleMouseLeave = () => {
      hoveredPlayer.value = null;
      isModalOpen.value = false;
  };

  const declareWinner = (team: string) => {
    winner.value = team; // 승리한 팀 설정
    
    if (team === 'TeamA') {
      lolPlayerResultHistoryRequestDto.value.teamA.outcome = "WINNER"
      lolPlayerResultHistoryRequestDto.value.teamB.outcome = "LOSE";
    } else if (team === 'TeamB') {
      lolPlayerResultHistoryRequestDto.value.teamA.outcome = "LOSE";
      lolPlayerResultHistoryRequestDto.value.teamB.outcome = "WINNER";
    } else if (team === 'Draw') {
      lolPlayerResultHistoryRequestDto.value.teamA.outcome = "DRAW";
      lolPlayerResultHistoryRequestDto.value.teamB.outcome = "DRAW";
    }
  };

// 결과 복사 버튼 메서드
const copyResults = () => {
  // 데이터를 보기 좋게 포맷
  const formatTeamData = (teamData: any) => {
    return teamData.map((player: any) => {
      return `
- ${player.name} / ${player.lines[0].line}
      `.trim();
    }).join('\n');
  };

  const formattedResults = `
Team A:
${formatTeamData(lolTeamResponseDto.value.teamA)}

Team B:
${formatTeamData(lolTeamResponseDto.value.teamB)}
  `.trim();

  // 클립보드에 복사
  navigator.clipboard
    .writeText(formattedResults)
    .then(() => {
      alert('결과가 복사되었습니다!');
    })
    .catch((err) => {
      console.error('복사 실패:', err);
    });
};



  // 이전으로 버튼 메서드
  const goBack = () => {
    switchStore.onRiftGoBackedSwitch();
    window.history.back();
  };
  
  // 팀 다시 구성하기 메서드 - 임시
  const recomposeTeam = async () => {
    try {
      const response = await uFetch<LolPlayerHistoryRequestDto,ApiResponse<LolTeamResponseDto>>(lolStore.riftInitTeam, "/game/lol/rift", "POST");
      lolStore.updateRiftTeams(response.data.teamA,response.data.teamB);
      lolPlayerResultHistoryRequestDto.value.teamA.team = response.data.teamA;
      lolPlayerResultHistoryRequestDto.value.teamB.team = response.data.teamB;
    } catch (error) {
      alert("팀을 다시 구성하는 데 실패했습니다.");
    }
  };
  
  // 저장 버튼 메서드
  const saveTeam = async() => {
    const response = await uFetch<LolPlayerResultHistoryRequestDto,ApiResponse<null>>(lolPlayerResultHistoryRequestDto.value,"/game/lol/rift/playerResultHistory","POST",true);
    if (response.code === 200) {
      alert("저장에 성공 하였습니다 !")
    }
  };
  
  </script>
  