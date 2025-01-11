<template>
    <div 
        class="fixed z-50"
        :style="{ top: `${100}px`, right: `${50}px` }"
    >
        <!-- 모달창 -->
        <div 
            class="relative block max-w-sm p-8 bg-gradient-to-br from-blue-600 to-purple-700 border border-gray-300 rounded-2xl shadow-2xl
                   hover:shadow-3xl hover:scale-110 transform transition-all duration-500 ease-in-out"
        >

            <!-- 아이콘과 제목 -->
            <div class="flex items-center gap-3 mb-6">
                <h5 class="text-4xl font-extrabold text-white drop-shadow-xl">
                    {{ player?.name }}
                </h5>
            </div>
            
            <!-- 본문 -->
            <p class="text-lg text-white font-semibold leading-relaxed">
                소환사 레벨: <span class="text-yellow-300 font-bold">{{ riotPlayerDto?.riotSummonerDto?.summonerLevel }}</span>
            </p>

            <!-- 승패 비율을 원형 그래프 (예: donut chart) -->
            <div class="mt-6 flex justify-center">
                <!-- 전적이 있을 경우 차트 표시 -->
                <div v-if="riotPlayerDto?.riotLeagueDto && riotPlayerDto?.riotLeagueDto.wins !== undefined">
                    <canvas id="winLossChart" width="200" height="200"></canvas>
                </div>

                <!-- 전적이 없을 경우 메시지 표시 -->
                <div v-else class="text-center text-white font-semibold text-lg">
                    이번 시즌 전적이 조회되지 않습니다!
                </div>
            </div>

            
            <!-- 챔피언 정보 보여주는 곳 -->
            <div class="mt-6">
                <!-- 제목 추가 -->
                <h3 class="text-2xl font-extrabold text-white text-center mb-6">
                    🎯 모스트 3픽!
                </h3>

                <!-- 챔피언 리스트 -->
                <div class="flex flex-wrap justify-center gap-6">
                    <div class="flex flex-wrap justify-center gap-6">
                        <div 
                            v-for="(champion, index) in riotPlayerDto?.championDtos" 
                            :key="index"
                            class="text-center"
                        >
                            <!-- 챔피언 이미지 -->
                            <img 
                                :src="`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${champion.image.full}`" 
                                :alt="champion.name" 
                                class="w-16 h-16 rounded-full border-2 border-white"
                            />

                            <!-- 챔피언 정보 반복 예제 (내부 v-for) -->
                            <ul class="mt-2 text-sm text-white">
                                <li>{{ riotPlayerDto?.riotChampionMasteryDtos[index].championLevel }} Lv</li>
                                <li>{{ riotPlayerDto?.riotChampionMasteryDtos[index].championPoints }} Point</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <!-- 추가 정보 섹션 -->
            <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
                <p class="text-gray-800 font-semibold">랭크 정보</p>
                <ul class="mt-2 space-y-2">
                    <li class="text-gray-700">🏆 티어: <span class="font-bold">{{ riotPlayerDto?.riotLeagueDto?.tier + '_' + riotPlayerDto?.riotLeagueDto?.rank  }}</span></li>
                    <li class="text-gray-700">📈 포인트: <span class="font-bold">{{ riotPlayerDto?.riotLeagueDto?.leaguePoints }}p</span></li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import type { ApiResponse } from '~/types/common';
import type { LolPlayerDto } from '~/types/game/lol/common';
import type { RiotPlayerDto } from '~/types/game/riot/common';
import Chart from 'chart.js/auto';
const props = defineProps<{ 
    player: LolPlayerDto | null,
    position: { x: number, y: number },
}>();


const riotPlayerDto = ref<RiotPlayerDto>();
const fetchPlayerData = async (playerName: string) => {
    riotPlayerDto.value = undefined;
    try {
        const encodedPlayerName = encodeURIComponent(playerName);
        const riotPlayerResponse = await uFetch<null, ApiResponse<RiotPlayerDto>>(null, `/game/lol/riot/riotPlayer/${encodedPlayerName}`,"GET");
        if (riotPlayerResponse.code === 200) {
            riotPlayerDto.value = riotPlayerResponse.data;
        }
    } catch (error) {
        console.error('API 호출 실패:', error);
    }
    return null;
};

let winLossChartInstance: Chart | null = null;

// 차트 초기화 메서드
const clearChart = () => {
    if (winLossChartInstance) {
        winLossChartInstance.destroy();
        winLossChartInstance = null;
    }
};

// 차트 렌더링 메서드
const renderChart = () => {
    if (!riotPlayerDto.value || !riotPlayerDto.value.riotLeagueDto.wins) {
        clearChart(); // 데이터가 없는 경우 차트 제거
        return;
    }

    const ctx = document.getElementById('winLossChart') as HTMLCanvasElement;

    clearChart(); // 기존 차트 제거 후 새로 생성

    winLossChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Wins', 'Losses'],
            datasets: [{
                label: 'Win/Loss Ratio',
                data: [
                    riotPlayerDto.value.riotLeagueDto.wins, 
                    riotPlayerDto.value.riotLeagueDto.losses
                ],
                backgroundColor: ['#4CAF50', '#FF6384'],
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        generateLabels: (chart) => {
                            const data = chart.data.datasets[0].data;
                            return [
                                {
                                    text: `Wins: ${data[0]}`,
                                    fillStyle: '#4CAF50',
                                    strokeStyle: '#4CAF50',
                                    lineWidth: 2
                                },
                                {
                                    text: `Losses: ${data[1]}`,
                                    fillStyle: '#FF6384',
                                    strokeStyle: '#FF6384',
                                    lineWidth: 2
                                }
                            ];
                        },
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
};

// 플레이어 변경 감지
watchEffect(async () => {
    if (props.player?.name) {
        await fetchPlayerData(props.player.name);
        renderChart();  // 데이터가 변경될 때 차트 렌더링
    } else {
        clearChart();  // 플레이어가 없을 경우 차트 제거
    }
});




</script>
