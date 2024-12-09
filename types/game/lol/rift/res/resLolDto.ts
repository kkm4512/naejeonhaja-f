import type { Lines, Tier } from "../common";

// Rift
export type RiftResponsePlayer = {
    name: string;
    tier: Tier;
    lines: Lines[];
    mmr: number;
    mmrReduced: boolean; 
};

export type RiftPlayerHistoryResponseDetailDto = {
  playerHistoryTitle: string; 
  lolPlayerDtos: RiftResponsePlayer[]; 
};

export type RiftPlayerHistoryResponseSimpleDto = {
  playerHistoryTitle: string; 
  playerHistoryId: number; 
};

export interface RiftTeamResponseDto {
    teamA: RiftResponsePlayer[];  // Team A의 플레이어 리스트
    teamB: RiftResponsePlayer[];  // Team B의 플레이어 리스트
}


