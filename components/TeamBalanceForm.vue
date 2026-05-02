<template>
  <section class="form-card">
    <h2>팀 밸런스 요청</h2>
    <p>10명의 플레이어 정보를 입력하여 팀을 생성합니다.</p>
    <div class="input-group">
      <label for="playerCount">플레이어 수</label>
      <input id="playerCount" type="number" v-model.number="playerCount" min="1" max="10" />
    </div>
    <div class="button-row">
      <button @click="makeSampleRequest" type="button">샘플 데이터 생성</button>
      <button @click="submitBalanceRequest" :disabled="loading" type="button">팀 생성</button>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="loading" class="loading-message">요청을 처리 중입니다...</div>

    <div v-if="balanceResult">
      <TeamResultCard :result="balanceResult" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiClient } from '~/composables/useApiClient'
import TeamResultCard from '~/components/TeamResultCard.vue'
import type { LolPlayerRequest, TeamBalanceData, TeamBalanceRequest } from '~/types/api'

const apiClient = useApiClient()
const playerCount = ref(10)
const loading = ref(false)
const errorMessage = ref('')
const balanceResult = ref<TeamBalanceData | null>(null)
const playerList = ref<LolPlayerRequest[]>([])

const resetCurrentState = () => {
  errorMessage.value = ''
  balanceResult.value = null
}

const makeSampleRequest = () => {
  // 샘플 플레이어 데이터를 생성한다.
  playerList.value = [
    { name: 'Player1', tier: 'GOLD_I', lines: [{ line: 'TOP', lineRole: 'MAINLINE' }], mmr: 0, mmrReduced: false },
    { name: 'Player2', tier: 'SILVER_II', lines: [{ line: 'MID', lineRole: 'MAINLINE' }], mmr: 0, mmrReduced: false },
    { name: 'Player3', tier: 'PLATINUM_III', lines: [{ line: 'AD', lineRole: 'MAINLINE' }], mmr: 0, mmrReduced: false },
    { name: 'Player4', tier: 'BRONZE_I', lines: [{ line: 'JUNGLE', lineRole: 'MAINLINE' }], mmr: 0, mmrReduced: false },
    { name: 'Player5', tier: 'DIAMOND_II', lines: [{ line: 'SUPPORT', lineRole: 'MAINLINE' }], mmr: 0, mmrReduced: false },
    { name: 'Player6', tier: 'IRON_IV', lines: [{ line: 'TOP', lineRole: 'SUBLINE' }], mmr: 0, mmrReduced: true },
    { name: 'Player7', tier: 'EMERALD_I', lines: [{ line: 'MID', lineRole: 'SUBLINE' }], mmr: 0, mmrReduced: true },
    { name: 'Player8', tier: 'MASTER_I', lines: [{ line: 'JUNGLE', lineRole: 'SUBLINE' }], mmr: 0, mmrReduced: true },
    { name: 'Player9', tier: 'GRANDMASTER_I', lines: [{ line: 'SUPPORT', lineRole: 'SUBLINE' }], mmr: 0, mmrReduced: true },
    { name: 'Player10', tier: 'CHALLENGER_I', lines: [{ line: 'AD', lineRole: 'MAINLINE' }], mmr: 0, mmrReduced: false }
  ]
  playerCount.value = playerList.value.length
  resetCurrentState()
}

onMounted(() => {
  makeSampleRequest()
})

const submitBalanceRequest = async () => {
  resetCurrentState()

  if (playerCount.value !== 10) {
    errorMessage.value = '정확히 10명의 플레이어 정보를 사용해야 합니다.'
    return
  }

  const requestBody: TeamBalanceRequest = {
    lolPlayers: playerList.value.length === 10 ? playerList.value : []
  }

  if (requestBody.lolPlayers.length !== 10) {
    errorMessage.value = '10명의 플레이어 정보를 먼저 생성하거나 입력해주세요.'
    return
  }

  loading.value = true

  try {
    balanceResult.value = await apiClient.postTeamBalance(requestBody)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-card {
  background: #ffffffcc;
  padding: 1.3rem;
  border-radius: 1rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}
.input-group label {
  font-weight: 600;
}
.input-group input {
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  padding: 0.85rem;
  font-size: 1rem;
}
.button-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
button {
  border: none;
  border-radius: 0.85rem;
  background-color: #2563eb;
  color: white;
  padding: 0.95rem 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: #1d4ed8;
}
button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}
.error-message {
  color: #b91c1c;
  margin-top: 1rem;
}
.loading-message {
  margin-top: 1rem;
}
</style>
