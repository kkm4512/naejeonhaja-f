import type { Outcome, Lines, Tier, Team } from "../common";

// Rift - 플레이어 히스토리 내역
export type RiftPlayerHistoryResponseDetailDto = {
  playerHistoryTitle: string; 
  riftPlayerResponseDtos: RiftPlayerResponseDto[]; 
};

// Rift - 플레이어 히스토리 심플목록 가져올때
export type RiftPlayerHistoryResponseSimpleDto = {
  playerHistoryTitle: string; 
  playerHistoryId: number; 
};

// Rift - 대전결과
export interface RiftTeamResponseDto {
  teamA: RiftPlayerResponseDto[];  // Team A의 플레이어 리스트
  teamB: RiftPlayerResponseDto[];  // Team B의 플레이어 리스트
}

// Rift - 대전결과시 가져오는 유저 Info
export type RiftPlayerResponseDto = {
    name: string;
    tier: Tier;
    lines: Lines[];
    mmr: number;
    mmrReduced: boolean; 
};

// Rift - 대전결과의 플레이어 목록 가져올때 
export type RiftPlayerResultResultResponseDto = {
  name: string;
  outcome: Outcome;
  team: Team
  tier: Tier;
  lines: Lines[];
  mmr: number;
  mmrReduced: boolean;   
}


// Rift - 대전결과의 상세 목록 가져올때
export type RiftPlayerResultHistoryResponseDetailDto = {
  playerResultHistoryTitle: string; 
  teamA: RiftPlayerResultResultResponseDto[];
  teamB: RiftPlayerResultResultResponseDto[]; 
};

// Rift - 대전결과의 심플 목록 가져올때
export type RiftPlayerResultHistoryResponseSimpleDto = {
  playerResultHistoryTitle: string; 
  playerResultHistoryId: number; 
};




