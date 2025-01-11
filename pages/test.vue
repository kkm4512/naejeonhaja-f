<script lang="ts" setup>
import LolResult from '~/components/game/LolResult.vue';
import type { RiftTeamResponseDto } from '~/types/game/lol/rift/res/resLolDto';

const mockRiftTeamResponse: RiftTeamResponseDto = {
  teamA: [
    {
      name: 'Player1',
      tier: 'GOLD_IV',
      lines: [
        { line: 'TOP', lineRole: 'MAINLINE' },
        { line: 'MID', lineRole: 'SUBLINE' },
        { line: 'SUPPORT', lineRole: 'SUBLINE' },
      ],
      mmr: 1000,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player2',
      tier: 'SILVER_III',
      lines: [
        { line: 'JUNGLE', lineRole: 'MAINLINE' },
        { line: 'TOP', lineRole: 'SUBLINE' },
        { line: 'MID', lineRole: 'SUBLINE' },
      ],
      mmr: 950,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player3',
      tier: 'PLATINUM_I',
      lines: [
        { line: 'MID', lineRole: 'MAINLINE' },
        { line: 'TOP', lineRole: 'SUBLINE' },
        { line: 'AD', lineRole: 'SUBLINE' },
      ],
      mmr: 1200,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player4',
      tier: 'DIAMOND_III',
      lines: [
        { line: 'AD', lineRole: 'MAINLINE' },
        { line: 'SUPPORT', lineRole: 'SUBLINE' },
        { line: 'TOP', lineRole: 'SUBLINE' },
      ],
      mmr: 1400,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player5',
      tier: 'CHALLENGER',
      lines: [
        { line: 'SUPPORT', lineRole: 'MAINLINE' },
        { line: 'MID', lineRole: 'SUBLINE' },
        { line: 'JUNGLE', lineRole: 'SUBLINE' },
      ],
      mmr: 2000,
      mmrReduced: Math.random() < 0.5,
    },
  ],
  teamB: [
    {
      name: 'Player6',
      tier: 'BRONZE_I',
      lines: [
        { line: 'TOP', lineRole: 'MAINLINE' },
        { line: 'MID', lineRole: 'SUBLINE' },
        { line: 'AD', lineRole: 'SUBLINE' },
      ],
      mmr: 850,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player7',
      tier: 'GOLD_I',
      lines: [
        { line: 'JUNGLE', lineRole: 'MAINLINE' },
        { line: 'TOP', lineRole: 'SUBLINE' },
        { line: 'SUPPORT', lineRole: 'SUBLINE' },
      ],
      mmr: 1050,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player8',
      tier: 'EMERALD_IV',
      lines: [
        { line: 'MID', lineRole: 'MAINLINE' },
        { line: 'SUPPORT', lineRole: 'SUBLINE' },
        { line: 'JUNGLE', lineRole: 'SUBLINE' },
      ],
      mmr: 1100,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player9',
      tier: 'IRON_III',
      lines: [
        { line: 'AD', lineRole: 'MAINLINE' },
        { line: 'TOP', lineRole: 'SUBLINE' },
        { line: 'MID', lineRole: 'SUBLINE' },
      ],
      mmr: 800,
      mmrReduced: Math.random() < 0.5,
    },
    {
      name: 'Player10',
      tier: 'GRANDMASTER',
      lines: [
        { line: 'SUPPORT', lineRole: 'MAINLINE' },
        { line: 'AD', lineRole: 'SUBLINE' },
        { line: 'JUNGLE', lineRole: 'SUBLINE' },
      ],
      mmr: 1800,
      mmrReduced: Math.random() < 0.5,
    },
  ],
};


</script>

<template>
    <LolResult 
        :team-a="(mockRiftTeamResponse.teamA)" 
        :team-b="(mockRiftTeamResponse.teamB)" 
    />
</template>


<style lang="postcss" scoped>
    
</style>
