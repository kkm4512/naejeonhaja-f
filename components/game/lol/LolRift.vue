<script lang="ts" setup>
import type { LolPlayerHistoryRequestDto } from '~/types/game/lol/req/reqLolDto';
import type { LolPlayerHistoryDto, LolTeamResponseDto } from '~/types/game/lol/res/resLolDto';
import type { ApiResponse } from '~/types/common';
import { useSwitchStore } from '~/stores/lol/useSwitchStore';
import { useLolStore } from '~/stores/lol/useLolStore';
import { PlayerMode, type Line, type LineRole, type LolPlayerDto, type Tier } from '~/types/game/lol/common';
import LolFooter from './LolFooter.vue';
import LolPlayerHistory from './LolPlayerHistory.vue';
import LolMenual from './LolMenual.vue';
import type { RiotPlayerBasicDto } from '~/types/game/riot/common';

// Props
const props = defineProps<{
  id?: number | null;
}>();

// 데이터
const lolStore = useLolStore();
const router = useRouter(); 
const switchStore = useSwitchStore();
const tiers: Tier[] = getTiers();
const lines: Line[] = getLines();
const saveData = ref(false);
const isModalOpen = ref(false);
// 플레이스홀더 값 상태
const placeholderText = ref<string>('Player Nickname');
// 현재 선택된 버튼을 추적하는 상태 변수
const selectedButton = ref<PlayerMode>(PlayerMode.CASUAL);
const lolPlayerDto = ref<LolPlayerDto[]>(
  Array.from({ length: 10 }, () => ({name: "",tier: tiers[0],lines: [],mmr: 0, mmrReduced: false, errorMessage: ""  }))
);
const playerHistoryTitle = ref<string | null>("");
const lolPlayerHistoryRequestDto: Ref<LolPlayerHistoryRequestDto> = computed(() => ({
  playerHistoryTitle: playerHistoryTitle.value,
  lolPlayerDtos: lolPlayerDto.value,
}));
 
onMounted(async() => {
  // true라면 사용자가 goBack을 눌렀다는 뜻
  if (switchStore.getRiftGoBackedSwtich() && lolStore.riftInitTeam) {
    playerHistoryTitle.value = lolStore.riftInitTeam?.playerHistoryTitle
    lolPlayerDto.value = lolStore.riftInitTeam?.lolPlayerDtos
    return;
  }
  if (props.id) {
  const response = await uFetch<null, ApiResponse<LolPlayerHistoryDto>>(
    null, 
    `/game/lol/rift/playerHistory/detail/${props.id}`, 
    "GET", 
    true
  );

  playerHistoryTitle.value = response.data.playerHistoryTitle;

  // 기존 배열의 크기를 맞춘 후, 기존 배열의 각 요소를 업데이트
  response.data.playerDtos.forEach((p, index) => {
    lolPlayerDto.value[index].name = p.name;
    lolPlayerDto.value[index].lines = p.lines;
    lolPlayerDto.value[index].tier = p.tier;
    lolPlayerDto.value[index].mmrReduced = false;
    lolPlayerDto.value[index].mmr = 0;
  });

  // 기존 데이터가 더 많을 경우 남은 데이터를 제거
  lolPlayerDto.value.splice(response.data.playerDtos.length);
}

})

// 메서드

// Riot API 호출 함수 (비동기)
const fetchPlayerData = async (playerName: string) => {
  if (selectedButton.value === PlayerMode.CASUAL) return;
  const encodedPlayerName = encodeURIComponent(playerName);
  if (!playerName) return;
    const playerIndex = lolPlayerDto.value.findIndex(player => player.name === playerName);
    const riotPlayerBasicResponse = await uFetch<null, ApiResponse<RiotPlayerBasicDto>>(null, `/game/lol/riot/riotPlayerBasic/${encodedPlayerName}`, 'GET');
    if (riotPlayerBasicResponse.code !== 200) {
      lolPlayerDto.value[playerIndex].errorMessage = riotPlayerBasicResponse.message;
      lolPlayerDto.value[playerIndex].successMessage = "";
    }
    else {
      lolPlayerDto.value[playerIndex].successMessage = riotPlayerBasicResponse.message;
      lolPlayerDto.value[playerIndex].errorMessage = "";
    }
    if (!riotPlayerBasicResponse.data.riotLeagueDto) {
          lolPlayerDto.value[playerIndex].tier = "UNRANKED";
          return;
      }
        lolPlayerDto.value[playerIndex].tier = parseTier(riotPlayerBasicResponse.data.riotLeagueDto.tier,riotPlayerBasicResponse.data.riotLeagueDto.rank);
  };


// const debouncedFetchPlayerData = debounce(fetchPlayerData, 1000);

// 진지 모드일때만 실행되게 하기
// lolPlayerDto.value.forEach((player) => {
//   watchEffect(() => {
//     if (player.name.trim() !== "") {
//       debouncedFetchPlayerData(player.name);
//       console.log(player.name)
//     } else if (player.name === "") {
//       player.errorMessage = "";
//       player.successMessage = "";
//     }
//   }, { flush: 'post' });
// });



// 역할 업데이트 함수
const updatelines = (player: LolPlayerDto, line: Line, type: LineRole): void => {
  // 기존 라인 찾기
  const existing = player.lines?.find((l) => l.line === line);

  if (existing) {
    // 이미 선택된 라인인 경우 역할 변경
    if (existing.lineRole === type) {
      existing.lineRole = null; // 선택 해제
    } else {
      existing.lineRole = type; // 역할 변경
    }
  } else {
    // 새 라인 추가
    player.lines?.push({ line, lineRole: type });
  }

  // lineRole이나 line이 null인 경우 해당 요소 제거
  player.lines = player.lines?.filter((l) => l.line !== null && l.lineRole !== null);
};

// 서버로 데이터 전달 함수
const sendToServer = async () => {
  if (selectedButton.value === PlayerMode.SERIOUS) {
    for (const p of lolPlayerDto.value) {
      await fetchPlayerData(p.name); 
      if (p.errorMessage !== "") {
        alert("유효하지 않은 플레이어가 존재합니다");
        return;
      }
    }


    let isOk = true;
    // 플레이어 전부 인증된 플레이언지 확인
    lolPlayerDto.value.forEach(p => {
      if (!p.name.includes('#')) {
        p.name += "#kr1";
      }
      if (p.errorMessage) {
        isOk = false
        return;
      }
    })
    if (!isOk) {
      alert("유효하지 않은 플레이어가 존재합니다")
      return;
    }
  }
  // 초기 플레이어 히스토리 저장 (이전으로 버튼 눌렀을떄 나오게 하기 위함)
  lolStore.setInitRiftTeamsWithTitle(lolPlayerHistoryRequestDto.value);
  // 다시 확인버튼누르면 True로 바꿈
  switchStore.offRiftGoBackedSwitch();
  const response = saveData.value   
  ? await uFetch<LolPlayerHistoryRequestDto,ApiResponse<LolTeamResponseDto>>(lolPlayerHistoryRequestDto.value, "/game/lol/rift/playerHistory","POST",true) 
  : await uFetch<LolPlayerHistoryRequestDto,ApiResponse<LolTeamResponseDto>>(lolPlayerHistoryRequestDto.value, "/game/lol/rift","POST",false)
  lolStore.updateRiftTeams(response.data.teamA,response.data.teamB);
  if (selectedButton.value === PlayerMode.CASUAL) {
    router.push("/game/lol/rift/result/casual")
  } 
  else {
    router.push("/game/lol/rift/result/serious")
  }
  
};

function handleCasual(): void {
  selectedButton.value = PlayerMode.CASUAL;
  placeholderText.value = 'Player Nickname'; // 기본 플레이스홀더
}

function handleSerious(): void {
  selectedButton.value = PlayerMode.SERIOUS;
  placeholderText.value = 'Player Nickname#kr1'; // 진지 모드 플레이스홀더
  lolPlayerDto.value.forEach(p => {
    if (p.name !== "" && p.errorMessage === "" && p.successMessage === "") {
      fetchPlayerData(p.name);
    }
  })
}
// 사용설명서 버튼 클릭 메서드
function handleHelp(): void {
  isModalOpen.value = true; // 모달 열기
}
</script>

<template>
  <div class="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
    <div class="flex w-full max-w-7xl">
      <!-- 소환사의 협곡 메인 콘텐츠 -->
      <div class="flex-1 bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">소환사의 협곡</h1>
          <div class="flex justify-end items-center mr-5">
            <!-- 사용설명서 버튼 -->
            <button
              @click="handleHelp"
              class="mb-6 px-4 py-2 bg-yellow-400 text-black rounded-md shadow hover:bg-yellow-500"
            >
              사용설명서
            </button>
          </div>
        <div class="flex justify-between items-center">
          <div>
            <!-- 모달: LolMenual 컴포넌트 -->
            <div
              v-if="isModalOpen"
              class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50"
            >
              <div class="bg-white rounded-lg p-6 w-96 shadow-lg relative">
                <!-- LolMenual 컴포넌트 -->
                <LolMenual :is-modal-open="true" v-on:update:is-modal-open="isModalOpen = false"/>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center space-x-4">
          <!-- 대충 버튼 -->
          <div class="relative group">
            <button
              @click="handleCasual"
              class="mb-6 px-4 py-2 rounded-md shadow transition"
              :class="selectedButton === 'casual' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black hover:bg-gray-500'"
            >
              대충
            </button>
            <!-- Tooltip -->
            <div
              class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap"
            >
              가벼운 내전 목적 (플레이어들의 실제 정보를 라이엇으로부터 가져오지않음)
            </div>
          </div>

          <!-- 진지 버튼 -->
          <div class="relative group">
            <button
              @click="handleSerious"
              class="mb-6 px-4 py-2 rounded-md shadow transition"
              :class="selectedButton === 'serious' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black hover:bg-gray-500'"
            >
              진지
            </button>
            <!-- Tooltip -->
            <div
              class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap"
            >
            진지한 내전 목적 (플레이어들의 실제 정보를 라이엇으로부터 가져옴)<br />
            ※ 플레이어의 닉네임 + 태그를 정확히 입력해야함 <br />
            </div>
          </div>
        </div>

        </div>

        <!-- 대전 이름 입력 섹션 -->
        <div class="w-full bg-white shadow-lg rounded-lg p-4 mb-6 flex items-center justify-between">
          <label for="match-name" class="text-lg font-medium text-gray-700">
            대전 내역 이름:
          </label>
          <input
            id="match-name"
            v-model="playerHistoryTitle"
            type="text"
            placeholder="대전 내역 이름을 입력하세요"
            class="border border-gray-300 rounded-md px-4 py-2 w-2/3 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <!-- 팀 정보 -->
        <div class="w-full bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-center bg-teal-400 text-white py-3 rounded-md mb-6">Team Info</h2>
          <!-- 플레이어 목록 -->
          <div class="flex justify-between">
            <!-- 왼쪽 열 -->
            <div class="w-1/2 px-4">
              <ul class="space-y-4">
                <li
                  v-for="(player, index) in lolPlayerDto.slice(0, lolPlayerDto.length / 2)"
                  :key="index"
                  class="p-3 bg-gray-100 border border-gray-300 rounded-md"
                >
                  <div class="flex items-center justify-between">
                    <!-- 입력 사항 반응형으로 안되는 문제 해결하기 -->
                    <input
                      v-model ="player.name"
                      class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3"
                      :placeholder="placeholderText"
                    />
                    <div class="flex items-center space-x-2">
                      <!-- 성공 메시지 -->
                      <div v-if="player.successMessage && selectedButton === PlayerMode.SERIOUS" class="text-green-500 text-sm">
                        {{ player.successMessage }}
                      </div>
                      <!-- 에러 메시지 -->
                      <div v-if="player.errorMessage && selectedButton === PlayerMode.SERIOUS" class="text-red-500 text-sm">
                        {{ player.errorMessage }}
                      </div>
                    </div>
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
                            'bg-gray-300 text-black': !player.lines?.find((l) => l.line === line && l.lineRole === 'MAINLINE'),
                            'bg-blue-500 text-white': player.lines?.find((l) => l.line === line && l.lineRole === 'MAINLINE')
                          }"
                          @click="updatelines(player, line, 'MAINLINE')"
                        >
                          MainLine
                        </button>
                        <button
                          class="px-3 py-1 rounded-md text-sm border"
                          :class="{
                            'bg-gray-300 text-black': !player.lines?.find((l) => l.line === line && l.lineRole === 'SUBLINE'),
                            'bg-green-500 text-white': player.lines?.find((l) => l.line === line && l.lineRole === 'SUBLINE')
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
                  v-for="(player, index) in lolPlayerDto.slice(lolPlayerDto.length / 2, lolPlayerDto.length)"
                  :key="index + 5"
                  class="p-3 bg-gray-100 border border-gray-300 rounded-md"
                >
                  <div class="flex items-center justify-between">
                    <input
                      v-model="player.name"
                      class="border border-gray-300 rounded-md p-1 bg-white text-sm w-1/3"
                      :placeholder="placeholderText"
                    />
                    <div class="flex items-center space-x-2">
                      <!-- 성공 메시지 -->
                      <div v-if="player.successMessage && selectedButton === PlayerMode.SERIOUS" class="text-green-500 text-sm">
                        {{ player.successMessage }}
                      </div>
                      <!-- 에러 메시지 -->
                      <div v-if="player.errorMessage && selectedButton === PlayerMode.SERIOUS" class="text-red-500 text-sm">
                        {{ player.errorMessage }}
                      </div>
                    </div>                    
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
                            'bg-gray-300 text-black': !player.lines?.find((l) => l.line === line && l.lineRole === 'MAINLINE'),
                            'bg-blue-500 text-white': player.lines?.find((l) => l.line === line && l.lineRole === 'MAINLINE')
                          }"
                          @click="updatelines(player, line, 'MAINLINE')"
                        >
                          MainLine
                        </button>
                        <button
                          class="px-3 py-1 rounded-md text-sm border"
                          :class="{
                            'bg-gray-300 text-black': !player.lines?.find((l) => l.line === line && l.lineRole === 'SUBLINE'),
                            'bg-green-500 text-white': player.lines?.find((l) => l.line === line && l.lineRole === 'SUBLINE')
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
          <!-- 버튼을 감싸는 div 추가 -->
          <div class="w-full bg-white rounded-lg p-6 flex justify-center items-center space-x-4">
            <!-- 서버로 전송 버튼 -->
            <button
              @click="sendToServer"
              class="px-6 py-3 bg-orange-500 text-white text-lg font-medium rounded-md shadow hover:bg-orange-600 transition"
            >
              확인
            </button>
            <!-- 데이터 저장 여부 체크박스 -->
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="saveData"
                class="form-checkbox h-5 w-5 text-orange-500 rounded"
              />
              <span class="ml-2 text-gray-700 text-sm">데이터 저장</span>
            </label>
          </div>
        </div>
      </div>
      <!-- 팀 히스토리 박스 -->
      <LolPlayerHistory class="ml-10 whitespace-nowrap" domain="'rift'"/>
    </div>
  </div>
  <LolFooter />
</template>



