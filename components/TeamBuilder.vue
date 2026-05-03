<template>
  <section class="builder-shell">
    <header class="builder-header">
      <div>
        <p class="eyebrow">팀 생성</p>
        <h1>롤 내전 팀 빌더</h1>
        <p class="subtitle">줄단위 소환사 목록으로 최대 10명을 로드하고 바로 팀을 생성하세요.</p>
      </div>
      <div class="mode-tabs">
        <button :class="{ active: mode === 'builder' }" @click="setMode('builder')">플레이어 빌드</button>
        <button :class="{ active: mode === 'json' }" @click="setMode('json')">JSON 직접 입력</button>
      </div>
    </header>

    <div class="tool-panel">
      <div v-if="mode === 'builder'" class="builder-panel">
        <div class="builder-grid">
          <div class="card card-panel">
            <h2>한꺼번에 로드</h2>
            <p class="hint">줄당 1명씩 최대 10명까지 입력하면 한 번에 플레이어 정보를 불러옵니다.</p>
            <div class="field-group">
              <label>한번에 추가할 소환사</label>
              <textarea v-model="bulkSummonerText" rows="5" placeholder="Player1#KR\nPlayer2#KR"></textarea>
            </div>
            <div class="button-row">
              <button class="primary-button" type="button" @click="loadBulkPlayers" :disabled="loading || !bulkSummonerText.trim()">한꺼번에 로드</button>
              <span class="small-text">줄당 1명, 최대 10명</span>
            </div>
          </div>

          <div v-if="stagedPlayers.length" class="card card-panel wide-card">
            <h2>임시 플레이어 라인 설정</h2>
            <p class="hint">로드된 소환사의 라인을 확인하고 수정한 뒤 팀에 추가하세요.</p>
            <div class="staged-list">
              <article v-for="(player, index) in stagedPlayers" :key="`${player.name}-${index}`" class="current-item">
                <div>
                  <strong>{{ player.name }}</strong>
                  <p class="small-text">{{ player.tier }}</p>
                  <div class="line-row" v-for="(lineItem, lineIndex) in player.lines" :key="lineIndex">
                    <select v-model="lineItem.line">
                      <option v-for="line in lines" :key="line" :value="line">{{ line }}</option>
                    </select>
                    <select v-model="lineItem.lineRole">
                      <option value="MAINLINE">MAINLINE</option>
                      <option value="SUBLINE">SUBLINE</option>
                    </select>
                    <button v-if="player.lines.length > 1" type="button" class="text-button" @click="removeStagedLine(index, lineIndex)">삭제</button>
                  </div>
                  <div class="field-group button-row">
                    <button type="button" class="secondary-button" @click="addStagedLine(index)" :disabled="player.lines.length >= 10">라인 추가</button>
                    <button type="button" class="secondary-button" @click="setStagedAnyLines(index)">상관없음</button>
                  </div>
                </div>
                <button class="text-button" @click="removeStagedPlayer(index)">제외</button>
              </article>
            </div>
            <div class="action-footer">
              <div class="button-group">
                <button class="primary-button" type="button" @click="commitStagedPlayers" :disabled="loading || !stagedPlayers.length || playerList.length + stagedPlayers.length > 10">플레이어 추가</button>
              </div>
              <div class="status-text">
                <span v-if="playerList.length + stagedPlayers.length > 10" class="error-text">최대 10명 제한을 초과합니다.</span>
              </div>
            </div>
          </div>
          <div class="card card-panel wide-card">
            <h2>현재 플레이어 목록</h2>
            <p class="hint">최대 10명까지 추가 후 팀 생성을 진행하세요.</p>
            <div class="current-list">
              <article v-for="(player, index) in playerList" :key="`${player.name}-${index}`" class="current-item">
                <div>
                  <strong>{{ player.name }}</strong>
                  <p class="small-text">{{ player.tier }} · {{ formatLines(player.lines) }}</p>
                </div>
                <button class="text-button" @click="removePlayer(index)">삭제</button>
              </article>
            </div>
            <div class="info-row">
              <span>현재 플레이어: {{ playerList.length }} / 10</span>
              <button class="ghost-button" @click="fillSamplePlayers">샘플 채우기</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="json-panel card card-panel">
        <h2>JSON 직접 입력</h2>
        <p class="hint">백엔드로 전송할 JSON 형식을 그대로 입력하세요.</p>
        <textarea v-model="jsonText" rows="14"></textarea>
        <div class="json-actions">
          <button class="secondary-button" type="button" @click="loadJson">JSON 파싱</button>
          <span class="json-status">{{ jsonStatus }}</span>
        </div>
      </div>
    </div>

    <div class="action-footer">
      <div class="button-group">
        <button class="primary-button" @click="submitTeamRequest" :disabled="loading">팀 생성</button>
        <button class="ghost-button" @click="resetAll">초기화</button>
      </div>
      <div class="status-text">
        <span v-if="loading" class="loading-text">서버 응답 대기 중... 로딩중입니다.</span>
        <span v-else-if="errorMessage" class="error-text">{{ errorMessage }}</span>
        <span v-else-if="teamResult" class="success-text">팀 생성이 완료되었습니다.</span>
      </div>
    </div>

    <TeamResultDisplay v-if="teamResult" :result="teamResult" :iconMap="playerIconMap" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TeamResultDisplay from '~/components/TeamResultDisplay.vue'
import { useApiClient } from '~/composables/useApiClient'
import type { LolPlayerRequest, TeamBalanceData, TeamBalanceRequest, RiotPlayerBasicInfo } from '~/types/api'

const apiClient = useApiClient()
const mode = ref<'builder' | 'json'>('builder')
const loading = ref(false)
const errorMessage = ref('')
const jsonStatus = ref('')
const jsonText = ref(`{
  "lolPlayers": [
    {
      "name": "PlayerName",
      "tier": "GOLD_I",
      "lines": [
        {
          "line": "TOP",
          "lineRole": "MAINLINE"
        }
      ],
      "mmr": 0,
      "mmrReduced": false
    }
  ]
}`)
const teamResult = ref<TeamBalanceData | null>(null)
const playerList = ref<LolPlayerRequest[]>([])
const stagedPlayers = ref<LolPlayerRequest[]>([])
const bulkSummonerText = ref('')

const lines = ['TOP', 'JUNGLE', 'MID', 'AD', 'SUPPORT']

const playerIconMap = computed(() => {
  return playerList.value.reduce<Record<string, string>>((map, player) => {
    if (player.profileIconUrl) {
      map[player.name] = player.profileIconUrl
    }
    return map
  }, {})
})

const addStagedLine = (playerIndex: number) => {
  const player = stagedPlayers.value[playerIndex]
  if (player && player.lines.length < 10) {
    player.lines.push({ line: 'TOP', lineRole: 'MAINLINE' })
  }
}

const removeStagedLine = (playerIndex: number, lineIndex: number) => {
  const player = stagedPlayers.value[playerIndex]
  if (player && player.lines.length > 1) {
    player.lines.splice(lineIndex, 1)
  }
}

const setStagedAnyLines = (playerIndex: number) => {
  const player = stagedPlayers.value[playerIndex]
  if (player) {
    player.lines = lines.map((line) => ({ line, lineRole: 'MAINLINE' }))
  }
}

const removeStagedPlayer = (index: number) => {
  stagedPlayers.value.splice(index, 1)
}

const loadBulkPlayers = async () => {
  resetMessages()
  const names = bulkSummonerText.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!names.length) {
    errorMessage.value = '추가할 소환사를 한 줄에 하나씩 입력해주세요.'
    return
  }
  if (names.length > 10) {
    errorMessage.value = '한 번에 최대 10명까지 입력할 수 있습니다.'
    return
  }
  if (names.length + playerList.value.length > 10) {
    errorMessage.value = '최대 10명까지 추가할 수 있습니다.'
    return
  }

  loading.value = true
  try {
    const players = await Promise.all(
      names.map(async (name) => {
        const info = await apiClient.getPlayerBasicInfo(name)
        return {
          name: displayName(info, name),
          tier: displayTier(info),
          lines: [{ line: 'TOP', lineRole: 'MAINLINE' }],
          mmr: 0,
          mmrReduced: false,
          profileIconUrl: getProfileIconUrl(info) || undefined
        }
      })
    )
    stagedPlayers.value = players
    bulkSummonerText.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '소환사 정보를 불러오는 데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const commitStagedPlayers = () => {
  resetMessages()
  if (!stagedPlayers.value.length) {
    errorMessage.value = '추가할 플레이어가 없습니다.'
    return
  }
  if (playerList.value.length + stagedPlayers.value.length > 10) {
    errorMessage.value = '최대 10명까지 추가할 수 있습니다.'
    return
  }

  playerList.value.push(...stagedPlayers.value.map((player) => ({
    name: player.name,
    tier: player.tier,
    lines: player.lines.map((item) => ({ line: item.line, lineRole: item.lineRole })),
    mmr: player.mmr,
    mmrReduced: player.mmrReduced,
    profileIconUrl: player.profileIconUrl
  })))
  stagedPlayers.value = []
}

const setMode = (selected: 'builder' | 'json') => {
  mode.value = selected
  resetMessages()
}

const resetMessages = () => {
  errorMessage.value = ''
  jsonStatus.value = ''
}

const displayName = (info: RiotPlayerBasicInfo | null, fallback = '알 수 없는 소환사') => {
  const account = info?.riotAccountDto as { gameName?: string; tagLine?: string } | undefined
  if (account?.gameName) {
    return `${account.gameName}${account.tagLine ? `#${account.tagLine.trim()}` : ''}`
  }

  const summoner = info?.riotSummonerDto as { name?: string } | undefined
  if (summoner?.name) {
    return summoner.name
  }

  return fallback
}

const displayTier = (info: RiotPlayerBasicInfo | null) => {
  const league = (info?.riotLeagueDto || (info as any)?.riotLeague) as { tier?: string; rank?: string } | undefined
  if (league?.tier) {
    return `${league.tier}_${league.rank ?? ''}`.replace(/_$/, '')
  }

  const altTier = (info as any)?.tier
  if (typeof altTier === 'string' && altTier.trim()) {
    return altTier.trim()
  }

  return 'UNRANKED'
}

const getProfileIconUrl = (info: RiotPlayerBasicInfo | null) => {
  const iconId = (info?.riotSummonerDto as { profileIconId?: number } | undefined)?.profileIconId
  if (!iconId) {
    return null
  }
  return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${iconId}.png`
}

const formatLines = (linesValue: { line: string; lineRole: string }[]) => {
  return linesValue.map((item) => `${item.line} (${item.lineRole})`).join(' · ')
}


const removePlayer = (index: number) => {
  playerList.value.splice(index, 1)
}

const fillSamplePlayers = () => {
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
}

const loadJson = () => {
  resetMessages()
  try {
    const parsed = JSON.parse(jsonText.value)
    if (!parsed || !Array.isArray(parsed.lolPlayers)) {
      throw new Error('유효한 lolPlayers 배열이 포함되어 있지 않습니다.')
    }
    jsonStatus.value = `로딩 완료: ${parsed.lolPlayers.length}명`
  } catch (error) {
    jsonStatus.value = '잘못된 JSON 형식입니다.'
  }
}

const submitTeamRequest = async () => {
  resetMessages()
  teamResult.value = null

  let requestBody: TeamBalanceRequest | null = null

  if (mode.value === 'builder') {
    if (playerList.value.length !== 10) {
      errorMessage.value = '정확히 10명의 플레이어를 추가해야 합니다.'
      return
    }
    requestBody = { lolPlayers: playerList.value }
  } else {
    try {
      requestBody = JSON.parse(jsonText.value) as TeamBalanceRequest
    } catch (error) {
      errorMessage.value = 'JSON 파싱에 실패했습니다.'
      return
    }

    if (!requestBody?.lolPlayers || requestBody.lolPlayers.length !== 10) {
      errorMessage.value = 'JSON에 정확히 10개의 lolPlayers가 포함되어야 합니다.'
      return
    }
  }

  loading.value = true

  try {
    teamResult.value = await apiClient.postTeamBalance(requestBody)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '팀 생성 요청에 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const resetAll = () => {
  playerList.value = []
  bulkSummonerText.value = ''
  teamResult.value = null
  errorMessage.value = ''
  jsonStatus.value = ''
}
</script>

<style scoped>
.builder-shell {
  display: grid;
  gap: 1.5rem;
  width: 100%;
}
.builder-header {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.5rem;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  color: #60a5fa;
  margin: 0 0 0.5rem;
}
.subtitle {
  color: #cbd5e1;
  margin-top: 0.65rem;
  line-height: 1.7;
}
.mode-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.mode-tabs button {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: #f8fafc;
  border-radius: 999px;
  padding: 0.8rem 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mode-tabs button.active,
.mode-tabs button:hover {
  background: rgba(59, 130, 246, 0.18);
  border-color: rgba(59, 130, 246, 0.6);
}
.tool-panel {
  display: grid;
  gap: 1.2rem;
}
.builder-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
}
.card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.25rem;
  padding: 1.2rem;
  backdrop-filter: blur(10px);
}
.card-panel h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}
.field-group {
  display: grid;
  gap: 0.55rem;
  margin-bottom: 1rem;
}
.field-group.button-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.field-group label {
  color: #cbd5e1;
  font-size: 0.92rem;
}
.field-group input,
.field-group select,
.json-panel textarea {
  width: 100%;
  border-radius: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  padding: 0.95rem 1rem;
  font-size: 0.95rem;
}
.field-group input:focus,
.field-group select:focus,
.json-panel textarea:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.8);
}
.grid-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.primary-button,
.secondary-button,
.ghost-button,
.text-button {
  border: none;
  border-radius: 999px;
  padding: 0.95rem 1.2rem;
  cursor: pointer;
  font-weight: 700;
}
.primary-button {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
}
.secondary-button {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.14);
}
.ghost-button {
  background: transparent;
  color: #bfdbfe;
  border: 1px solid rgba(255, 255, 255, 0.14);
}
.text-button {
  background: transparent;
  color: #60a5fa;
  padding: 0.5rem 0.75rem;
}
.staged-list,
.current-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}
.button-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.card-panel.wide-card {
  grid-column: span 3;
}
.profile-panel {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
}
.profile-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  background-size: cover;
  background-position: center;
}
.profile-details {
  display: grid;
  gap: 0.25rem;
}
.profile-name {
  font-weight: 700;
  margin: 0;
}
.profile-tier {
  color: #cbd5e1;
  margin: 0.35rem 0 0;
}
.profile-level,
.profile-league {
  color: #cbd5e1;
  margin: 0;
  font-size: 0.95rem;
}
.champion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.champion-chip {
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.14);
  color: #f8fafc;
  padding: 0.55rem 0.85rem;
  font-size: 0.88rem;
}
.line-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.85rem;
  align-items: end;
}
.staged-list,
.current-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  max-height: 320px;
  overflow-y: auto;
}
.current-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.small-text {
  color: #cbd5e1;
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.json-panel {
  display: grid;
  gap: 1rem;
}
.json-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.json-status {
  color: #cbd5e1;
}
.action-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.button-group {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
}
.loading-text {
  color: #93c5fd;
}
.status-text {
  min-height: 1.5rem;
}
.error-text {
  color: #f87171;
}
.success-text {
  color: #86efac;
}
@media (max-width: 980px) {
  .builder-grid {
    grid-template-columns: 1fr;
  }
  .card-panel.wide-card {
    grid-column: span 1;
  }
}
</style>
