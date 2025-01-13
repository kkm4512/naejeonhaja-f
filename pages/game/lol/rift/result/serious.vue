<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 p-6 w-full">
    <!-- 카드 전체 컨테이너 -->
    <div class="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <!-- 대전 내역 이름 -->
      <div class="mb-8 text-center">
        <label for="match-name" class="block text-2xl font-bold text-gray-900 mb-4">
          대전 결과 이름
        </label>
        <input
          id="match-name"
          v-model="playerResultHistoryTitle"
          type="text"
          placeholder="저장할 대전 결과 이름을 기재하세요"
          class="w-3/4 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
        />
      </div>

      <!-- Team A vs Team B -->
      <div class="flex justify-between items-center my-8 text-center">
        <div>
          <span class="text-3xl font-extrabold text-blue-700">Team A</span>
          <p class="text-lg font-semibold text-blue-800 mt-1">
            Total MMR: {{ calculateTotalMMR(lolTeamResponseDto.teamA || []) }}
          </p>
        </div>
        <span class="text-3xl font-extrabold text-gray-700">VS</span>
        <div>
          <span class="text-3xl font-extrabold text-red-700">Team B</span>
          <p class="text-lg font-semibold text-red-800 mt-1">
            Total MMR: {{ calculateTotalMMR(lolTeamResponseDto.teamB || []) }}
          </p>
        </div>
      </div>

      <!-- 팀 멤버 리스트 -->
      <div class="grid grid-cols-2 gap-8">
        <!-- Team A -->
        <div
          class="p-4 rounded-xl shadow-lg transition transform hover:scale-105"
          :class="winner === 'TeamA' ? 'bg-blue-100 border-4 border-blue-500' : 'bg-gray-50 border border-gray-300'"
        >
          <div class="space-y-4 w-full">
            <div
              v-for="(player, index) in lolTeamResponseDto.teamA"
              :key="index"
              class="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-md space-x-4"
            >
              <!-- 플레이어 정보 -->
              <div class="flex items-center space-x-4 min-w-[180px]">
                <img :src="`${lolSummonerIconUrl}${riotPlayerDtos[index]?.riotSummonerDto?.profileIconId || 0}.png`" class="w-10 h-10 rounded-full border-2 border-blue-400">
                <div>
                  <p class="text-base font-semibold text-blue-900 truncate">{{ riotPlayerDtos[index]?.riotAccountDto?.gameName }}</p>
                  <p class="text-sm text-blue-700">{{ getAbbreviatedLine(player.lines?.[0]?.line) }}</p>
                </div>
              </div>
              
              <!-- 메인/서브 정보 -->
              <div class="text-sm font-semibold" :class="player.mmrReduced ? 'text-gray-500' : 'text-blue-700'">
                {{ player.mmrReduced ? 'Sub' : 'Main' }}
              </div>

              <!-- 챔피언 정보 -->
              <div class="flex space-x-3">
                <div v-for="(riotChampionMasteryDto, _index) in riotPlayerDtos[index]?.riotChampionMasteryDtos" :key="_index" class="flex flex-col items-center space-y-1">
                  <img :src="`${lolChampionImageUrl}${riotPlayerDtos[index]?.championDtos[_index]?.image?.full}`" class="w-10 h-10 rounded-lg border border-blue-400">
                  <p class="text-xs font-semibold text-blue-900">Lv: {{ riotChampionMasteryDto.championLevel }}</p>
                  <p class="text-xs text-blue-700">Pts: {{ riotChampionMasteryDto.championPoints }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Team A 승리 버튼 -->
          <button
            @click="declareWinner('TeamA')"
            class="mt-4 w-full py-2 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Team A 승리
          </button>
        </div>

        <!-- Team B -->
        <div
          class="p-4 rounded-xl shadow-lg transition transform hover:scale-105"
          :class="winner === 'TeamB' ? 'bg-red-100 border-4 border-red-500' : 'bg-gray-50 border border-gray-300'"
        >
          <div class="space-y-4">
            <div
              v-for="(player, index) in lolTeamResponseDto.teamB"
              :key="index"
              class="flex items-center justify-between bg-red-50 p-4 rounded-lg shadow-md space-x-4"
            >
              <!-- 플레이어 정보 -->
              <div class="flex items-center space-x-4 min-w-[180px]">
                <img :src="`${lolSummonerIconUrl}${riotPlayerDtos[index + 5]?.riotSummonerDto?.profileIconId || 0}.png`" class="w-10 h-10 rounded-full border-2 border-red-400">
                <div>
                  <p class="text-base font-semibold text-red-900 truncate">{{ riotPlayerDtos[index + 5]?.riotAccountDto?.gameName }}</p>
                  <p class="text-sm text-red-700">{{ getAbbreviatedLine(player.lines?.[0]?.line) }}</p>
                </div>
              </div>
              
              <!-- 메인/서브 정보 -->
              <div class="text-sm font-semibold" :class="player.mmrReduced ? 'text-gray-500' : 'text-red-700'">
                {{ player.mmrReduced ? 'Sub' : 'Main' }}
              </div>

              <!-- 챔피언 정보 -->
              <div class="flex space-x-3">
                <div v-for="(riotChampionMasteryDto, _index) in riotPlayerDtos[index + 5]?.riotChampionMasteryDtos" :key="_index" class="flex flex-col items-center space-y-1">
                  <img :src="`${lolChampionImageUrl}${riotPlayerDtos[index + 5]?.championDtos[_index]?.image?.full}`" class="w-10 h-10 rounded-lg border border-red-400">
                  <p class="text-xs font-semibold text-red-900">Lv: {{ riotChampionMasteryDto.championLevel }}</p>
                  <p class="text-xs text-red-700">Pts: {{ riotChampionMasteryDto.championPoints }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Team B 승리 버튼 -->
          <button
            @click="declareWinner('TeamB')"
            class="mt-4 w-full py-2 bg-red-600 text-white text-lg rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Team B 승리
          </button>
        </div>
      </div>

      <!-- 무승부, 결과 복사 -->
      <div class="mt-10 flex justify-center gap-6">
        <button @click="copyResults" class="px-6 py-2 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-700 transition">
          결과 복사하기
        </button>
        <button @click="declareWinner('Draw')" class="px-6 py-2 bg-gray-600 text-white text-lg rounded-lg shadow-md hover:bg-gray-700 transition">
          무승부
        </button>
        <button @click="captureScreen(400, 240, 1100, 845)" class="px-6 py-2 bg-purple-600 text-white text-lg rounded-lg shadow-md hover:bg-purple-700 transition">
          결과화면 캡처
        </button>
      </div>

      <!-- 이전으로, 팀 다시 구성하기, 저장 버튼 -->
      <div class="mt-8 flex justify-between gap-4">
        <button @click="goBack" class="w-full py-2 bg-gray-600 text-white text-lg rounded-lg shadow-md hover:bg-gray-700 transition">
          이전으로
        </button>
        <button @click="recomposeTeam" class="w-full py-2 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition">
          팀 다시 구성하기
        </button>
        <button @click="saveTeam" class="w-full py-2 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-700 transition">
          저장
        </button>
      </div>
    </div>
  </div>
  <LolFooter />
</template>



    
  <script setup lang="ts">
  import LolFooter from '~/components/game/lol/LolFooter.vue';
  import { useLolStore } from '~/stores/lol/useLolStore';
  import { useSwitchStore } from '~/stores/lol/useSwitchStore';
  import type { ApiResponse } from '~/types/common';
  import type { LolPlayerDto, LolTeamResultDto } from '~/types/game/lol/common';
  import type { LolPlayerHistoryRequestDto, LolPlayerResultHistoryRequestDto } from '~/types/game/lol/req/reqLolDto';
  import type { LolTeamResponseDto } from '~/types/game/lol/res/resLolDto';
  import type { RiotPlayerDto } from '~/types/game/riot/common';

  onMounted(async() => {
    lolStore.loadRiftTeams();
    lolStore.loadInitRiftTeamsWithTitle();
    await getRiotPlayerDtos();
});

  // 데이터
  const lolStore = useLolStore();
  const winner = ref<string>("");
  const switchStore = useSwitchStore();
  const playerResultHistoryTitle = ref<string>("");
  const riotPlayerDtos = ref<RiotPlayerDto[]>([]);
  const lolChampionImageUrl = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/";
  const lolSummonerIconUrl = "https://ddragon.leagueoflegends.com/cdn/15.1.1/img/profileicon/"

  const getRiotPlayerDtos = async () => {
    riotPlayerDtos.value = []; // 초기화    
    let combinedTeams: LolPlayerDto[] = [
        ...lolStore.riftTeamA,
        ...lolStore.riftTeamB
    ];
    try {
        for (const combinedTeam of combinedTeams) {
            const encodedPlayerName = encodeURIComponent(combinedTeam.name);
            const riotPlayerResponse = await uFetch<null, ApiResponse<RiotPlayerDto>>(
                null, 
                `/game/lol/riot/riotPlayer/${encodedPlayerName}`, 
                "GET"
            );
            riotPlayerDtos.value.push(riotPlayerResponse.data);
        }
        
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
    }
};

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
      await getRiotPlayerDtos();
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
  