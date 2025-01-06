import type { LolPlayerDto, LolTeamResultDto } from "../common";

// Rift - 플레이어 히스토리 내역
export type LolPlayerHistoryDto = {
  playerHistoryTitle: string; 
  playerDtos: LolPlayerDto[]; 
};

// Rift - 대전결과의 상세 목록 가져올때
export type LolPlayerResultHistoryDto = {
  playerResultHistoryTitle: string; 
  teamA: LolTeamResultDto;
  teamB: LolTeamResultDto; 
};
// Rift - 대전결과
export interface LolTeamResponseDto {
  teamA: LolPlayerDto[];  // Team A의 플레이어 리스트
  teamB: LolPlayerDto[];  // Team B의 플레이어 리스트
}

// lol - 대전결과의 심플 목록 가져올때
export type LolPlayerResultHistoryResponseSimpleDto = {
  playerResultHistoryTitle: string; 
  playerResultHistoryId: number; 
};

// lol - 플레이어 히스토리 심플목록 가져올때
export type LolPlayerHistorySimpleDto = {
  playerHistoryTitle: string; 
  playerHistoryId: number; 
};











