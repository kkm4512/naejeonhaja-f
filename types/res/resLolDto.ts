import type {Tier, Lines } from "../common";

export type RiftResponsePlayer = {
    name: string;
    tier: Tier;
    lines: Lines[];
    mmr: number;
    mmrReduced: boolean; 
};


// lolFetcg Response Type
export interface RiftResponseDto {
    teamA: RiftResponsePlayer[];  // Team A의 플레이어 리스트
    teamB: RiftResponsePlayer[];  // Team B의 플레이어 리스트
}

export type AbyssResponsePlayer = {
  name: string;
  tier: Tier;
  mmr: number;
};


export interface AbyssResponseDto {
  teamA: AbyssResponsePlayer[];  // Team A의 플레이어 리스트
  teamB: AbyssResponsePlayer[];  // Team B의 플레이어 리스트
}

export type TftResponsePlayer = {
  name: string;
  tier: Tier;
  mmr: number;
};


export interface TftResponseDto {
  teamA: TftResponsePlayer[];  // Team A의 플레이어 리스트
  teamB: TftResponsePlayer[];  // Team B의 플레이어 리스트
}


