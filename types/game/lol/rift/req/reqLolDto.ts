import type { LolPlayerDto, LolTeamResultDto } from "../common";

export type LolPlayerHistoryRequestDto = {
  playerHistoryTitle: string | null; 
  riftPlayerDtos: LolPlayerDto[] | []; 
};

export type LolPlayerResultHistoryRequestDto = {
  playerResultHistoryTitle: string; 
  teamA: LolTeamResultDto; 
  teamB: LolTeamResultDto; 
};








