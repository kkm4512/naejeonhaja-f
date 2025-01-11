<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = Number(route.params.id);

enum Winner {
  A = "A",
  B = "B",
}

type Round = {
  playerA: string | null;
  playerB: string | null;
  winner: Winner | null;
};

// 초기 대진표 데이터 생성 함수
const generateMatches = (teams: number) => {
  const matches: Round[][] = [];
  let players: Array<string | null> = Array.from(
    { length: teams },
    (_, i) => `Player ${i + 1}`
  );

  while (players.length > 1) {
    const round: Round[] = [];
    for (let i = 0; i < players.length; i += 2) {
      round.push({
        playerA: players[i] || null,
        playerB: players[i + 1] || null,
        winner: null,
      });
    }
    matches.push(round);
    players = round.map(() => null); // 다음 라운드 초기화
  }

  return matches;
};

// 대진표 초기화
const rounds = ref(generateMatches(id));

// 승자 결정 함수
const setWinner = (roundIndex: number, matchIndex: number, winner: Winner) => {
  const currentMatch = rounds.value[roundIndex][matchIndex];
  currentMatch.winner = winner;

  // 다음 라운드에 승자를 반영
  if (roundIndex > 0) {
    const nextRound = rounds.value[roundIndex - 1];
    const nextMatchIndex = Math.floor(matchIndex / 2);
    const playerField = matchIndex % 2 === 0 ? "playerA" : "playerB";

    // 승자 이름을 다음 라운드에 반영
    nextRound[nextMatchIndex][playerField] =
      winner === Winner.A ? currentMatch.playerA : currentMatch.playerB;
  }
};
</script>

<template>
  <div class="m-2 p-4">
    <h1 class="text-3xl font-bold text-center mb-6">{{ id }}강 대진표</h1>
    <!-- 대진표 -->
    <div class="flex flex-col-reverse items-center gap-8">
      <!-- 각 라운드 -->
      <div
        v-for="(round, roundIndex) in rounds"
        :key="roundIndex"
        class="flex flex-col items-center"
      >
        <!-- 라운드 이름 -->
        <h2 class="text-xl font-semibold mb-4">
          {{ roundIndex === rounds.length - 1 ? "Final" : `Round ${roundIndex + 1}` }}
        </h2>

        <!-- 각 경기 -->
        <div class="flex justify-center gap-8">
          <div
            v-for="(match, matchIndex) in round"
            :key="matchIndex"
            class="rounded-md bg-gray-200 px-4 py-4 shadow w-60"
          >
            <!-- Player A -->
            <div
              class="flex justify-between mb-2"
              :class="{ 'opacity-50': match.winner && match.winner !== Winner.A }"
            >
              <span>{{ match.playerA || "?" }}</span>
              <button
                v-if="match.playerA && match.playerB"
                @click="setWinner(roundIndex, matchIndex, Winner.A)"
                :class="{
                  'bg-green-500 text-white': match.winner === Winner.A,
                  'bg-gray-300': match.winner !== Winner.A,
                }"
                class="px-2 py-1 rounded"
              >
                승리
              </button>
            </div>

            <!-- Player B -->
            <div
              class="flex justify-between"
              :class="{ 'opacity-50': match.winner && match.winner !== Winner.B }"
            >
              <span>{{ match.playerB || "?" }}</span>
              <button
                v-if="match.playerA && match.playerB"
                @click="setWinner(roundIndex, matchIndex, Winner.B)"
                :class="{
                  'bg-green-500 text-white': match.winner === Winner.B,
                  'bg-gray-300': match.winner !== Winner.B,
                }"
                class="px-2 py-1 rounded"
              >
                승리
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind CSS 사용 */
</style>
