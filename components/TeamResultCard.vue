<template>
  <section class="result-card">
    <h2>팀 밸런스 결과</h2>
    <p>밸런스: {{ result.balance }}</p>
    <div class="score-row">
      <span>팀 A MMR: {{ result.teamATotalMmr }}</span>
      <span>팀 B MMR: {{ result.teamBTotalMmr }}</span>
    </div>
    <div class="team-grid">
      <div>
        <h3>Team A</h3>
        <ul>
          <li v-for="player in result.teamA" :key="player.name">
            {{ player.name }} / {{ player.tier }} / {{ player.mmr }} / {{ formatLines(player.lines) }}
          </li>
        </ul>
      </div>
      <div>
        <h3>Team B</h3>
        <ul>
          <li v-for="player in result.teamB" :key="player.name">
            {{ player.name }} / {{ player.tier }} / {{ player.mmr }} / {{ formatLines(player.lines) }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TeamBalanceData } from '~/types/api'

const props = defineProps<{ result: TeamBalanceData }>()

const formatLines = (lines: { line: string; lineRole: string }[]) => {
  return lines.map((item) => `${item.line}(${item.lineRole})`).join(', ')
}
</script>

<style scoped>
.result-card {
  background: #ffffffcc;
  padding: 1.3rem;
  border-radius: 1rem;
  margin-top: 1.2rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.score-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.8rem;
}
</style>
