<template>
  <section class="result-shell">
    <div class="summary-card">
      <div>
        <p class="summary-label">밸런스</p>
        <p class="summary-value">{{ result.balance }}</p>
      </div>
      <div>
        <p class="summary-label">팀 A MMR</p>
        <p class="summary-value">{{ result.teamATotalMmr }}</p>
      </div>
      <div>
        <p class="summary-label">팀 B MMR</p>
        <p class="summary-value">{{ result.teamBTotalMmr }}</p>
      </div>
    </div>

    <div class="team-grid">
      <div class="team-card team-card-a">
        <div class="team-title">Team A</div>
        <div class="player-list">
          <article v-for="player in result.teamA" :key="player.name" class="player-card">
            <div class="player-avatar" :style="getAvatarStyle(player)">
              <span v-if="!player.profileIconUrl && !props.iconMap?.[player.name]">{{ getInitials(player.name) }}</span>
            </div>
            <div class="player-meta">
              <div class="player-name">{{ player.name }}</div>
              <div class="player-tier">{{ player.tier }}</div>
              <div class="player-line">{{ formatLines(player.lines) }}</div>
            </div>
            <div class="player-stats">
              <span class="tag" :class="tierClass(player.tier)">{{ tierLabel(player.tier) }}</span>
              <small>MMR {{ player.mmr }}</small>
            </div>
          </article>
        </div>
      </div>

      <div class="team-card team-card-b">
        <div class="team-title">Team B</div>
        <div class="player-list">
          <article v-for="player in result.teamB" :key="player.name" class="player-card">
            <div class="player-avatar" :style="getAvatarStyle(player)">
              <span v-if="!player.profileIconUrl && !props.iconMap?.[player.name]">{{ getInitials(player.name) }}</span>
            </div>
            <div class="player-meta">
              <div class="player-name">{{ player.name }}</div>
              <div class="player-tier">{{ player.tier }}</div>
              <div class="player-line">{{ formatLines(player.lines) }}</div>
            </div>
            <div class="player-stats">
              <span class="tag" :class="tierClass(player.tier)">{{ tierLabel(player.tier) }}</span>
              <small>MMR {{ player.mmr }}</small>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TeamBalanceData } from '~/types/api'

const props = defineProps<{ result: TeamBalanceData; iconMap?: Record<string, string> }>()

const formatLines = (lines: { line: string; lineRole: string }[]) => {
  return lines.map((item) => `${item.line} (${item.lineRole})`).join(' · ')
}

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

const tierLabel = (tier: string) => {
  if (!tier) {
    return 'UNKNOWN'
  }
  return tier.replace('_', ' ')
}

const tierClass = (tier: string) => {
  const key = tier.split('_')[0]?.toLowerCase() || 'default'
  return `tier-${key}`
}

const getAvatarStyle = (player: { name: string; tier: string; profileIconUrl?: string }) => {
  const iconUrl = player.profileIconUrl || props.iconMap?.[player.name]
  if (iconUrl) {
    return {
      backgroundImage: `url(${iconUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }

  const base = player.tier.split('_')[0]?.toLowerCase() || 'default'
  const colors: Record<string, string> = {
    iron: '#9ca3af',
    bronze: '#c2410c',
    silver: '#64748b',
    gold: '#f59e0b',
    platinum: '#14b8a6',
    emerald: '#10b981',
    diamond: '#818cf8',
    master: '#f97316',
    grandmaster: '#ec4899',
    challenger: '#eab308',
    default: '#4b5563'
  }
  return {
    background: colors[base] ?? colors.default
  }
}
</script>

<style scoped>
.result-shell {
  width: 100%;
  margin-top: 1.5rem;
  display: grid;
  gap: 1.2rem;
}
.summary-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1.25rem;
  padding: 1.25rem;
  backdrop-filter: blur(10px);
}
.summary-label {
  font-size: 0.85rem;
  color: #d1d5db;
  margin-bottom: 0.35rem;
}
.summary-value {
  font-size: 1.45rem;
  font-weight: 700;
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.team-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1.5rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  min-height: 320px;
}
.team-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.player-list {
  display: grid;
  gap: 0.85rem;
}
.player-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.player-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}
.player-meta {
  flex: 1;
}
.player-name {
  font-weight: 700;
}
.player-tier,
.player-line {
  color: #cbd5e1;
  font-size: 0.9rem;
}
.player-stats {
  text-align: right;
}
.tag {
  display: inline-flex;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
  margin-bottom: 0.4rem;
}
.tier-iron {
  background: rgba(156, 163, 175, 0.18);
  color: #9ca3af;
}
.tier-bronze {
  background: rgba(194, 65, 12, 0.18);
  color: #f59e0b;
}
.tier-silver {
  background: rgba(100, 116, 139, 0.18);
  color: #cbd5e1;
}
.tier-gold {
  background: rgba(245, 158, 11, 0.18);
  color: #fbbf24;
}
.tier-platinum {
  background: rgba(20, 184, 166, 0.18);
  color: #5eead4;
}
.tier-emerald {
  background: rgba(16, 185, 129, 0.18);
  color: #6ee7b7;
}
.tier-diamond {
  background: rgba(129, 140, 248, 0.18);
  color: #c7d2fe;
}
.tier-master {
  background: rgba(249, 115, 22, 0.18);
  color: #fb923c;
}
.tier-grandmaster {
  background: rgba(236, 72, 153, 0.18);
  color: #f472b6;
}
.tier-challenger {
  background: rgba(234, 179, 8, 0.18);
  color: #fde047;
}
</style>
