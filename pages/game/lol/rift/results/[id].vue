<script lang="ts" setup>
import LolFooter from '~/components/game/lol/LolFooter.vue';
import type { ApiResponse } from '~/types/common';
import type { LolPlayerResultHistoryResponseDetailDto } from '~/types/game/lol/res/resLolDto';

// 데이터
const route = useRoute();
const id = route.params.id;

// 대전결과 상세 정보 가져오기
const response = await uFetch<null,ApiResponse<LolPlayerResultHistoryResponseDetailDto>>(null,`/game/lol/rift/playerResultHistory/detail/${id}`,"GET",true)
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
            Total MMR: {{ calculateTotalMMR(response.data.teamA.team || []) }}
          </span>
        </div>
        <span class="text-2xl font-extrabold text-gray-600">VS</span>
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-red-700">Team B</span>
          <span class="text-lg font-semibold text-red-800">
            Total MMR: {{ calculateTotalMMR(response.data.teamB.team || []) }}
          </span>
        </div>
      </div>

      <!-- 팀 멤버 리스트 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Team A -->
        <div
          class="relative p-6 rounded-xl shadow-lg transition"
          :class="getTeamBackgroundClass(response.data.teamA.outcome, 'TeamA')"
        >
            <!-- Winner/Lose/Draw 표시 -->
            <div
              :class="getOutcomeClass(response.data.teamA.outcome).class"
            >
              {{ getOutcomeClass(response.data.teamA.outcome).text }}
            </div>
          <ul class="space-y-3">
            <li
              v-for="(player, index) in response.data.teamA.team"
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
        </div>

        <!-- Team B -->
        <div
          class="relative p-6 rounded-xl shadow-lg transition"
          :class="getTeamBackgroundClass(response.data.teamB.outcome, 'TeamB')"
        >
          <!-- Winner/Lose/Draw 표시 -->
          <div
              :class="getOutcomeClass(response.data.teamB.outcome).class"
            >
              {{ getOutcomeClass(response.data.teamB.outcome).text }}
            </div>
          <ul class="space-y-3">
            <li
              v-for="(player, index) in response.data.teamB.team"
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
        </div>
      </div>
    </div>
  </div>
  <LolFooter />
</template>
