import type {Tier, Lines } from "../common";

// Rift
export type RiftResponsePlayer = {
    name: string;
    tier: Tier;
    lines: Lines[];
    mmr: number;
    mmrReduced: boolean; 
};

export type RiftResponsePayload = {
  playerHistoryTitle: string; 
  lolPlayerDtos: RiftResponsePlayer[]; 
};

export type RiftResponseSimplePayload = {
  playerHistoryTitle: string; 
  playerHistoryId: number; 
};

export interface RiftResponseDto {
    teamA: RiftResponsePlayer[];  // Team A의 플레이어 리스트
    teamB: RiftResponsePlayer[];  // Team B의 플레이어 리스트
}


