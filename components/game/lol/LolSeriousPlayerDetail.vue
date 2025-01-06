<template>
    <div 
        class="fixed z-50"
        :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    >
        <!-- 모달창 -->
        <div 
            class="relative block max-w-sm p-8 bg-gradient-to-br from-blue-600 to-purple-700 border border-gray-300 rounded-2xl shadow-2xl
                   hover:shadow-3xl hover:scale-110 transform transition-all duration-500 ease-in-out"
        >

            <!-- 아이콘과 제목 -->
            <div class="flex items-center gap-3 mb-6">
                <span class="text-5xl">🚀</span>
                <h5 class="text-4xl font-extrabold text-white drop-shadow-xl">
                    {{ player?.name }}
                </h5>
            </div>
            
            <!-- 본문 -->
            <p class="text-lg text-white font-semibold leading-relaxed">
                MMR: <span class="text-yellow-300 font-bold">{{ player?.mmr }}</span>
            </p>

            <!-- 추가 정보 섹션 -->
            <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
                <p class="text-gray-800 font-semibold">랭크 정보</p>
                <ul class="mt-2 space-y-2">
                    <li class="text-gray-700">🏆 티어: <span class="font-bold">{{ riotPlayerDto?.riotLeagueDtos[0]?.tier }}</span></li>
                    <li class="text-gray-700">📈 승점: <span class="font-bold">{{ riotPlayerDto?.riotLeagueDtos[0]?.leaguePoints }}</span></li>
                    <li class="text-gray-700">🎯 승/패: <span class="font-bold">{{ riotPlayerDto?.riotLeagueDtos[0]?.wins }}W / {{ riotPlayerDto?.riotLeagueDtos[0]?.losses }}L</span></li>
                </ul>
            </div>

            <!-- 닫기 버튼 -->
            <div class="mt-6 flex justify-center">
                <button 
                    class="px-6 py-2 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out"
                >
                    자세히 보기
                </button>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import type { ApiResponse } from '~/types/common';
import type { LolPlayerDto } from '~/types/game/lol/common';
import type { RiotPlayerDto } from '~/types/game/riot/common';
import type { RiotAccountDto, RiotLeagueDto, RiotSummonerDto } from '~/types/game/riot/res/resRiotDto';
const props = defineProps<{ 
    player: LolPlayerDto | null,
    position: { x: number, y: number },
}>();


const riotPlayerDto = ref<RiotPlayerDto>();
// API 호출 및 캐싱 로직
const fetchPlayerData = async (playerName: string) => {
    try {
        const encodedPlayerName = encodeURIComponent(playerName);

        const accountResponse = await uFetch<null, ApiResponse<RiotAccountDto>>(
            null, 
            `/game/lol/riot/playerName/${encodedPlayerName}?includeData=true`,
            "GET"
        );
        
        if (accountResponse.code === 200) {
            const riotAccountDto = accountResponse.data;
            const summonerResponse = await uFetch<null, ApiResponse<RiotSummonerDto>>(
                null, 
                `/game/lol/riot/puuid/${riotAccountDto.puuid}`,
                "GET"
            );

            if (summonerResponse.code === 200) {
                const riotSummonerDto = summonerResponse.data;
                const leagueResponse = await uFetch<null, ApiResponse<RiotLeagueDto[]>>(
                    null, 
                    `/game/lol/riot/leagueId/${encodeURIComponent(riotSummonerDto.id)}`,
                    "GET"
                );

                if (leagueResponse.code === 200) {
                    riotPlayerDto.value = {
                        riotAccountDto: accountResponse?.data,
                        riotSummonerDto: summonerResponse.data,
                        riotLeagueDtos: leagueResponse.data
                    };
                }
            }
        }
    } catch (error) {
        console.error('API 호출 실패:', error);
    }
    return null;
};

// watchEffect에서 캐시 활용
watchEffect(async () => {
    if (props.player?.name) {
        await fetchPlayerData(props.player.name);
    }
});

</script>
